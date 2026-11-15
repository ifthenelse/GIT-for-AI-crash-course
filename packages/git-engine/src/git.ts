import type { RepositoryState } from '../../contracts/src/index.ts';
import { filePath, validRef } from './parser.ts';
import { abortOperation, ancestors, assertClean, beginConflicts, changedPaths, checkoutTree, clearOperation, clone, commonAncestor, effectiveConfig, getHeadCommit, getStatus, headTree, isIgnored, mergeTrees, moveHead, recordCommit, rememberResolutions, resolve, same, saveOperation, type Tree } from './model.ts';

function flags(args: string[], supported: string[]): void {
  for (const arg of args) if (arg.startsWith('-') && arg !== '--' && !supported.includes(arg)) throw new Error(`Unsupported flag: ${arg}`);
}
function requireHead(state: RepositoryState) { const head = getHeadCommit(state); if (!head) throw new Error('The repository has no commits yet.'); return head; }
function selectedPaths(state: RepositoryState, paths: string[], pool: string[]): string[] {
  if (!paths.length) throw new Error('Specify a file or directory.');
  const result = new Set<string>();
  for (const input of paths) {
    if (input === '.' || input === ':/' || input === '--all') { pool.forEach(p => result.add(p)); continue; }
    const path = filePath(input);
    const matches = pool.filter(p => p === path || p.startsWith(path.replace(/\/$/, '') + '/'));
    if (!matches.length) throw new Error(`Path does not exist in the selected tree: ${input}`);
    matches.forEach(p => result.add(p));
  }
  return [...result].sort();
}
function ensureNoOperation(state: RepositoryState): void { if (state.operation) throw new Error(`Finish or abort the ${state.operation.kind} first.`); }
function hookCheck(state: RepositoryState): void {
  const path = '.git/hooks/pre-commit';
  if (!state.files[path] || state.flags[`executable:${path}`] !== true) return;
  state.flags.hookExecuted = true;
  const lines = state.files[path].split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
  if (lines.some(line => !/^exit [01]$/.test(line))) throw new Error('This simulator only runs declarative hook fixtures containing exit 0 or exit 1; no shell is executed.');
  if (lines[0] === 'exit 1') throw new Error('pre-commit hook rejected the commit.');
}
export function commitIndex(state: RepositoryState, message: string, allowEmpty = false): string {
  if (!message.trim()) throw new Error('A commit message is required.');
  if (Object.keys(state.conflicts).length) throw new Error('Resolve and stage every conflict before committing.');
  if (state.operation?.kind === 'rebase') throw new Error('Use git rebase --continue to finish the rebase.');
  if (!allowEmpty && same(headTree(state), state.index) && !state.operation) throw new Error('Nothing staged to commit.');
  hookCheck(state);
  const head = getHeadCommit(state);
  const parents = state.operation?.kind === 'merge' ? [state.operation.originalHead, state.operation.target] : head ? [head.id] : [];
  const pending = state.flags.__pendingParents;
  const commit = recordCommit(state, state.index, pending ? JSON.parse(String(pending)) as string[] : parents, message);
  rememberResolutions(state); moveHead(state, commit.id, `commit: ${message}`); clearOperation(state);
  return `[${state.head.kind === 'branch' ? state.head.name : 'detached HEAD'} ${commit.id.slice(0, 7)}] ${message}`;
}
export function merge(state: RepositoryState, targetRef: string, options: { noFF?: boolean; ffOnly?: boolean; squash?: boolean; message?: string } = {}): string {
  ensureNoOperation(state); assertClean(state);
  const target = resolve(state, targetRef), current = requireHead(state);
  if (ancestors(state, current.id).has(target.id)) return 'Already up to date.';
  const fastForward = ancestors(state, target.id).has(current.id);
  if (options.ffOnly && !fastForward) throw new Error('Fast-forward is not possible; branches have diverged.');
  if (fastForward && !options.noFF && !options.squash) {
    checkoutTree(state, target.tree); moveHead(state, target.id, `merge ${targetRef}: fast-forward`); state.flags.merged = true; return `Fast-forward to ${target.id.slice(0, 7)}.`;
  }
  saveOperation(state);
  const base = commonAncestor(state, current.id, target.id);
  if (!base) throw new Error('Unrelated histories are not merged in this course.');
  const result = mergeTrees(base.tree, current.tree, target.tree);
  const conflicted = beginConflicts(state, result);
  if (options.squash) {
    state.flags.squashed = true;
    // Squash records no merge parent. A pending conflict still needs an abortable operation.
    if (conflicted) { state.operation = { kind: 'merge', target: target.id, originalHead: current.id }; state.flags.__pendingParents = JSON.stringify([current.id]); }
    else { delete state.flags.__operationSnapshot; }
    return conflicted ? 'Squash stopped: resolve conflicts, git add the resolutions, then git commit.' : 'Squash changes staged. HEAD is unchanged; run git commit.';
  }
  state.operation = { kind: 'merge', target: target.id, originalHead: current.id };
  if (conflicted) return `Automatic merge stopped with conflicts: ${Object.keys(state.conflicts).join(', ')}. Resolve, stage, and commit, or git merge --abort.`;
  const output = commitIndex(state, options.message ?? `Merge branch '${targetRef}'`); state.flags.merged = true; return output;
}
interface RebaseStep { id: string; action: 'pick' | 'reword' | 'squash' | 'fixup' | 'drop'; message?: string; }
function finishRebase(state: RepositoryState): string {
  const id = String(state.flags.__rebaseHead), name = String(state.flags.__rebaseBranch);
  if (name) state.head = { kind: 'branch', name }; else state.head = { kind: 'detached', commit: id };
  moveHead(state, id, 'rebase finished');
  clearOperation(state); state.flags.rebased = true; return 'Successfully rebased the selected commits.';
}
function applyRebaseStep(state: RepositoryState, step: RebaseStep): boolean {
  if (step.action === 'drop') return true;
  const original = resolve(state, step.id), onto = resolve(state, String(state.flags.__rebaseHead));
  const parentTree = original.parents.length ? resolve(state, original.parents[0]).tree : {};
  const result = mergeTrees(parentTree, onto.tree, original.tree);
  state.head = { kind: 'detached', commit: onto.id };
  if (beginConflicts(state, result)) { state.flags.__rebaseCurrent = JSON.stringify(step); return false; }
  createRebasedCommit(state, step);
  return true;
}
function createRebasedCommit(state: RepositoryState, step: RebaseStep): void {
  const original = resolve(state, step.id), onto = resolve(state, String(state.flags.__rebaseHead));
  const squash = step.action === 'squash' || step.action === 'fixup';
  if (squash && onto.id === state.operation!.target) throw new Error('Cannot squash the first selected commit without a preceding pick.');
  const message = step.action === 'reword' ? state.files['.git/rebase-message']?.trim() || step.message || original.message : step.action === 'squash' ? `${onto.message}\n\n${original.message}` : step.action === 'fixup' ? onto.message : original.message;
  const commit = recordCommit(state, state.index, squash ? onto.parents : [onto.id], message);
  rememberResolutions(state); state.flags.__rebaseHead = commit.id; state.head = { kind: 'detached', commit: commit.id };
  state.reflog.unshift({ commit: commit.id, message: `rebase (${step.action}): ${message}` });
  delete state.flags.__rebaseCurrent;
}
function runRebaseQueue(state: RepositoryState): string {
  const queue = JSON.parse(String(state.flags.__rebaseQueue ?? '[]')) as RebaseStep[];
  while (queue.length) {
    const step = queue.shift()!;
    state.flags.__rebaseQueue = JSON.stringify(queue);
    if (!applyRebaseStep(state, step)) return 'Rebase stopped with conflicts. Resolve, git add, then git rebase --continue; or git rebase --abort.';
  }
  return finishRebase(state);
}
function rebase(state: RepositoryState, args: string[]): string {
  flags(args, ['-i', '--interactive', '--continue', '--abort']);
  if (args.includes('--abort')) { if (state.operation?.kind !== 'rebase') throw new Error('No rebase in progress.'); abortOperation(state); return 'Rebase aborted.'; }
  if (args.includes('--continue')) {
    if (state.operation?.kind !== 'rebase') throw new Error('No rebase in progress.');
    if (Object.keys(state.conflicts).length) throw new Error('Resolve and stage all rebase conflicts first.');
    if (state.flags.__rebaseCurrent) createRebasedCommit(state, JSON.parse(String(state.flags.__rebaseCurrent)) as RebaseStep);
    if (state.flags.__rebaseInteractivePending) {
      const todo = state.files['.git/rebase-todo'] ?? '';
      const allowed = new Set((JSON.parse(String(state.flags.__rebaseQueue)) as RebaseStep[]).map(s => s.id));
      const seen = new Set<string>();
      const steps: RebaseStep[] = todo.split('\n').filter(line => line.trim() && !line.trim().startsWith('#')).map(line => {
        const [action, ref, ...message] = line.trim().split(/\s+/);
        if (!['pick', 'reword', 'squash', 'fixup', 'drop'].includes(action)) throw new Error(`Unsupported rebase instruction: ${action}`);
        const commit = resolve(state, ref);
        if (!allowed.has(commit.id) || seen.has(commit.id)) throw new Error('The todo list may only contain each originally selected commit once.');
        seen.add(commit.id); return { action: action as RebaseStep['action'], id: commit.id, ...(action === 'reword' && message.length ? { message: message.join(' ') } : {}) };
      });
      if (steps[0]?.action === 'squash' || steps[0]?.action === 'fixup') throw new Error('Start the todo list with pick or reword.');
      state.flags.__rebaseQueue = JSON.stringify(steps); delete state.flags.__rebaseInteractivePending; state.flags.interactiveRebase = true;
    }
    return runRebaseQueue(state);
  }
  ensureNoOperation(state); assertClean(state);
  const targetRef = args.find(a => !a.startsWith('-'));
  if (!targetRef) throw new Error('Specify the new base, for example git rebase main.');
  const target = resolve(state, targetRef), original = requireHead(state), base = commonAncestor(state, original.id, target.id);
  if (!base) throw new Error('No common ancestor for rebase.');
  const steps: RebaseStep[] = [];
  let cursor = original;
  const targetAncestors = ancestors(state, target.id);
  while (!targetAncestors.has(cursor.id)) {
    if (cursor.parents.length > 1) throw new Error('This simulator rebases linear commit sequences; merge-preserving rebase is not supported.');
    steps.unshift({ action: 'pick', id: cursor.id });
    if (!cursor.parents[0]) break; cursor = resolve(state, cursor.parents[0]);
  }
  saveOperation(state);
  state.operation = { kind: 'rebase', target: target.id, originalHead: original.id, remaining: steps.map(step => step.id) };
  state.flags.__rebaseQueue = JSON.stringify(steps); state.flags.__rebaseHead = target.id; state.flags.__rebaseBranch = state.head.kind === 'branch' ? state.head.name : '';
  if (args.includes('-i') || args.includes('--interactive')) {
    state.files['.git/rebase-todo'] = steps.map(step => `pick ${step.id} ${resolve(state, step.id).message}`).join('\n') + '\n';
    state.flags.__rebaseInteractivePending = true;
    return 'Interactive editor: edit .git/rebase-todo using pick, reword, squash, fixup or drop; then git rebase --continue. For reword, edit .git/rebase-message or supply a replacement message on the reword line. No external editor is executed.';
  }
  checkoutTree(state, target.tree); return runRebaseQueue(state);
}
export function gitCommand(state: RepositoryState, command: string, args: string[]): string {
  if (command === '--version' || command === 'version') return 'git version 2.x (deterministic teaching simulator; not a system installation)';
  switch (command) {
    case 'init': {
      flags(args, ['-b', '--initial-branch']);
      const i = args.findIndex(a => a === '-b' || a === '--initial-branch');
      if (i >= 0) { const name = validRef(args[i + 1] ?? ''); if (state.commits.length) throw new Error('Cannot change an existing repository branch using init.'); state.head = { kind: 'branch', name }; }
      state.flags.initialized = true; return 'Initialized simulated Git repository in /workspace/project/.git/';
    }
    case 'clone': {
      flags(args, []); const url = args[0];
      if (!url || !/^(https?:\/\/|ssh:\/\/|git@)[^\s]+$/.test(url)) throw new Error('Specify an HTTPS or SSH repository URL.');
      if (args.length > 2) throw new Error('Usage: git clone <url> [directory]');
      assertClean(state); const remote = state.remotes.origin;
      if (!state.commits.length) {
        const initial = recordCommit(state, { 'README.md': '# Git practice repository\n' }, [], 'Initial repository');
        state.branches.main = initial.id; state.head = { kind: 'branch', name: 'main' };
      }
      const branches = clone(remote?.branches ?? state.branches);
      const name = branches.main ? 'main' : Object.keys(branches)[0];
      if (!name) throw new Error('The simulated remote fixture has no branch.');
      state.remotes.origin = { url, branches }; state.branches = clone(branches); state.head = { kind: 'branch', name };
      checkoutTree(state, resolve(state, name).tree); state.config.local[`branch.${name}.remote`] = 'origin'; state.config.local[`branch.${name}.merge`] = `refs/heads/${name}`;
      state.flags.cloned = true; state.flags.cloneProtocol = url.startsWith('http') ? 'https' : 'ssh'; state.flags.cloneDirectory = args[1] ?? 'project'; return `Cloned simulated remote fixture into '${args[1] ?? 'project'}'. No network request was made.`;
    }
    case 'config': {
      flags(args, ['--system', '--global', '--local', '--worktree', '--show-origin', '--show-scope', '--list', '-l', '--get', '--unset']);
      const scope = (['system', 'global', 'local', 'worktree'] as const).find(s => args.includes(`--${s}`));
      const positional = args.filter(a => !a.startsWith('-'));
      if (args.includes('--list') || args.includes('-l')) {
        const locations = { system: '/etc/gitconfig', global: '~/.gitconfig', local: '.git/config', worktree: '.git/config.worktree' };
        return (scope ? [scope] : ['system', 'global', 'local', 'worktree'] as const).flatMap(s => Object.entries(state.config[s]).map(([k, v]) => `${args.includes('--show-scope') ? s + '\t' : ''}${args.includes('--show-origin') ? `file:${locations[s]}\t` : ''}${k}=${v}`)).join('\n') || '(no configuration values)';
      }
      const [key, value] = positional;
      if (!key || !/^[a-zA-Z][\w-]*(\.[a-zA-Z][\w.-]*)+$/.test(key) || /(?:__proto__|constructor|prototype)/.test(key)) throw new Error('Specify a supported Git configuration key.');
      if (args.includes('--unset')) { delete state.config[scope ?? 'local'][key]; return `Unset ${key}.`; }
      if (value !== undefined) { if (positional.length !== 2) throw new Error('Quote configuration values containing spaces.'); state.config[scope ?? 'local'][key] = value; return `${scope ?? 'local'} ${key}=${value}`; }
      const result = scope ? state.config[scope][key] : effectiveConfig(state, key);
      if (result === undefined) throw new Error(`No value configured for ${key}.`); return result;
    }
    case 'status': {
      flags(args, ['--short', '-s', '--porcelain']); const status = getStatus(state);
      const lines = [...Object.keys(state.conflicts).map(p => `UU ${p}`), ...status.staged.map(p => `${p in headTree(state) ? p in state.index ? 'M' : 'D' : 'A'}  ${p}`), ...status.modified.map(p => ` ${p in state.files ? 'M' : 'D'} ${p}`), ...status.untracked.map(p => `?? ${p}`)];
      return `${args.length ? '' : `On ${state.head.kind === 'branch' ? `branch ${state.head.name}` : `detached HEAD ${state.head.commit}`}\n`}${lines.join('\n') || 'nothing to commit, working tree clean'}`;
    }
    case 'add': {
      flags(args, ['-A', '--all', '-u', '--']);
      const all = args.includes('-A') || args.includes('--all') || args.includes('-u');
      const paths = args.filter(a => !a.startsWith('-'));
      const pool = [...new Set([...Object.keys(state.files), ...Object.keys(state.index)])].filter(p => !p.startsWith('.git/') && (!args.includes('-u') || p in state.index));
      const selected = selectedPaths(state, paths.length ? paths : all ? ['.'] : [], pool);
      for (const path of selected) {
        if (isIgnored(state, path)) { if (paths.some(p => p !== '.' && filePath(p) === path)) throw new Error(`Ignored path: ${path}`); continue; }
        if (path in state.files) {
          if (path in state.conflicts && /^(<<<<<<<|=======|>>>>>>>)/m.test(state.files[path])) throw new Error(`Conflict markers remain in ${path}.`);
          state.index[path] = state.files[path];
        } else delete state.index[path];
        delete state.conflicts[path];
      }
      return `Staged ${selected.filter(p => !isIgnored(state, p)).length} path(s).`;
    }
    case 'commit': {
      flags(args, ['-m', '--message', '--allow-empty', '-a', '--all']);
      const at = args.findIndex(a => a === '-m' || a === '--message');
      if (at < 0 || args[at + 1] === undefined) throw new Error('Use git commit -m "A meaningful message".');
      if (args.includes('-a') || args.includes('--all')) for (const path of Object.keys(state.index)) { if (path in state.files) state.index[path] = state.files[path]; else delete state.index[path]; }
      return commitIndex(state, args[at + 1], args.includes('--allow-empty'));
    }
    case 'diff': {
      flags(args, ['--cached', '--staged', '--stat', '--']);
      const cached = args.includes('--cached') || args.includes('--staged');
      const left = cached ? headTree(state) : state.index, right = cached ? state.index : state.files;
      const positionals = args.filter(a => !a.startsWith('-'));
      const paths = changedPaths(left, right).filter(p => cached || p in state.index).filter(p => !positionals.length || positionals.some(a => p === a || p.startsWith(a + '/')));
      return paths.map(path => args.includes('--stat') ? `${path} | changed` : `diff --git a/${path} b/${path}\n--- a/${path}\n+++ b/${path}\n${(left[path] ?? '').split('\n').map(l => '-' + l).join('\n')}\n${(right[path] ?? '').split('\n').map(l => '+' + l).join('\n')}`).join('\n') || '(no differences)';
    }
    case 'log': {
      flags(args.filter(a => !/^-[1-9]\d*$/.test(a)), ['--oneline', '--graph', '--all', '--decorate', '-n', '--max-count']);
      let limit = 30;
      const at = args.findIndex(a => a === '-n' || a === '--max-count'); if (at >= 0) limit = Math.min(100, Number(args[at + 1]) || 30);
      const shortcut = args.find(a => /^-[1-9]\d*$/.test(a)); if (shortcut) limit = Math.min(100, Number(shortcut.slice(1)));
      const reached = getHeadCommit(state) ? ancestors(state, requireHead(state).id) : new Set<string>();
      return state.commits.slice().reverse().filter(c => args.includes('--all') || reached.has(c.id)).slice(0, limit).map(c => `${args.includes('--graph') ? '* ' : ''}${c.id.slice(0, 7)} ${c.message}`).join('\n') || '(no commits)';
    }
    case 'branch': {
      flags(args, ['--list', '-a', '--all', '-d', '-D', '-m']);
      const names = args.filter(a => !a.startsWith('-'));
      if (!names.length || args.includes('--list')) return Object.entries(state.branches).map(([name, id]) => `${state.head.kind === 'branch' && state.head.name === name ? '*' : ' '} ${name} ${id.slice(0, 7)}`).join('\n') || '(no branches yet)';
      const name = validRef(names[0]);
      if (args.includes('-d') || args.includes('-D')) {
        if (!(name in state.branches)) throw new Error('Branch does not exist.');
        if (state.head.kind === 'branch' && state.head.name === name || Object.values(state.worktrees).some(w => w.branch === name)) throw new Error('Cannot delete a checked out branch.');
        if (!args.includes('-D') && !ancestors(state, requireHead(state).id).has(state.branches[name])) throw new Error('Branch is not fully merged.');
        delete state.branches[name]; return `Deleted branch ${name}.`;
      }
      if (args.includes('-m')) {
        if (names.length !== 1 || state.head.kind !== 'branch') throw new Error('Usage: git branch -m <new-name>');
        if (state.branches[name]) throw new Error('Branch already exists.');
        const old = state.head.name; if (state.branches[old]) { state.branches[name] = state.branches[old]; delete state.branches[old]; } state.head = { kind: 'branch', name }; return `Renamed branch to ${name}.`;
      }
      if (state.branches[name]) throw new Error('Branch already exists.');
      state.branches[name] = resolve(state, names[1] ?? 'HEAD').id; return `Created branch ${name}.`;
    }
    case 'switch':
    case 'checkout': {
      flags(args, ['-c', '-b', '--create', '--detach', '--']);
      if (command === 'checkout' && args.includes('--')) {
        const delimiter = args.indexOf('--'), source = args[0] === '--' ? state.index : resolve(state, args[0]).tree;
        const paths = selectedPaths(state, args.slice(delimiter + 1), Object.keys(source));
        for (const path of paths) { state.files[path] = source[path]; if (args[0] !== '--') state.index[path] = source[path]; }
        return `Restored ${paths.length} path(s).`;
      }
      ensureNoOperation(state);
      const values = args.filter(a => !a.startsWith('-')), name = values[0]; if (!name) throw new Error(`Specify a branch for ${command}.`);
      const create = args.includes('-c') || args.includes('-b') || args.includes('--create');
      if (create) { validRef(name); if (state.branches[name]) throw new Error('Branch already exists.'); state.branches[name] = resolve(state, values[1] ?? 'HEAD').id; }
      if (Object.values(state.worktrees).some(w => w.branch === name)) throw new Error('Branch is already checked out in another worktree.');
      const commit = resolve(state, name);
      if (command === 'switch' && !(name in state.branches) && !args.includes('--detach')) throw new Error('Use git switch --detach to inspect a commit.');
      const before = getHeadCommit(state)?.tree ?? {};
      const localIndex = { ...state.index }, localFiles = { ...state.files };
      for (const path of new Set([...Object.keys(before), ...Object.keys(commit.tree)])) {
        if (before[path] !== commit.tree[path] && (localIndex[path] !== before[path] || localFiles[path] !== localIndex[path])) throw new Error(`Local changes would be overwritten: ${path}`);
      }
      checkoutTree(state, commit.tree);
      for (const path of new Set([...Object.keys(before), ...Object.keys(localIndex), ...Object.keys(localFiles)])) {
        if (localIndex[path] !== before[path]) { if (path in localIndex) state.index[path] = localIndex[path]; else delete state.index[path]; }
        if (localFiles[path] !== before[path]) { if (path in localFiles) state.files[path] = localFiles[path]; else delete state.files[path]; }
      }
      state.head = name in state.branches && !args.includes('--detach') ? { kind: 'branch', name } : { kind: 'detached', commit: commit.id };
      state.reflog.unshift({ commit: commit.id, message: `${command}: ${name}` }); return state.head.kind === 'branch' ? `Switched to branch '${name}'.` : `HEAD detached at ${commit.id.slice(0, 7)}.`;
    }
    case 'restore': {
      flags(args, ['--staged', '-S', '--worktree', '-W', '--source', '-s', '--']);
      const values: string[] = []; let source: Tree | undefined;
      for (let i = 0; i < args.length; i++) { if (args[i] === '--source' || args[i] === '-s') source = resolve(state, args[++i]).tree; else if (!args[i].startsWith('-')) values.push(args[i]); }
      const staged = args.includes('--staged') || args.includes('-S'); source ??= staged ? headTree(state) : state.index;
      const paths = selectedPaths(state, values, [...new Set([...Object.keys(source), ...Object.keys(state.index)])]);
      for (const path of paths) {
        if (staged) { if (path in source) state.index[path] = source[path]; else delete state.index[path]; }
        if (!staged || args.includes('--worktree') || args.includes('-W')) { if (path in source) state.files[path] = source[path]; else delete state.files[path]; }
      }
      return `Restored ${paths.length} path(s).`;
    }
    case 'reset': {
      ensureNoOperation(state); flags(args, ['--soft', '--mixed', '--hard', '--']);
      const modes = args.filter(a => ['--soft', '--mixed', '--hard'].includes(a)); if (modes.length > 1) throw new Error('Choose one reset mode.');
      const delimiter = args.indexOf('--');
      let values = args.filter(a => !a.startsWith('-')), target = 'HEAD', paths: string[] = [];
      if (delimiter >= 0) { const before = args.slice(0, delimiter).filter(a => !a.startsWith('-')); target = before[0] ?? 'HEAD'; paths = args.slice(delimiter + 1); }
      else if (values.length) { try { resolve(state, values[0]); target = values.shift()!; paths = values; } catch { paths = values; } }
      const commit = resolve(state, target);
      if (paths.length) {
        if (modes.length) throw new Error('Path reset does not accept soft/mixed/hard modes.');
        for (const path of selectedPaths(state, paths, [...new Set([...Object.keys(state.index), ...Object.keys(commit.tree)])])) { if (path in commit.tree) state.index[path] = commit.tree[path]; else delete state.index[path]; }
        return 'Unstaged selected paths; HEAD is unchanged.';
      }
      if (args.includes('--hard')) checkoutTree(state, commit.tree);
      else if (!args.includes('--soft')) state.index = clone(commit.tree);
      moveHead(state, commit.id, `reset: ${target}`); state.flags.resetMode = args.includes('--hard') ? 'hard' : args.includes('--soft') ? 'soft' : 'mixed'; return `HEAD is now at ${commit.id.slice(0, 7)}.`;
    }
    case 'revert': {
      flags(args, ['-m', '--mainline', '--no-edit']); ensureNoOperation(state); assertClean(state);
      let parentNumber: number | undefined; const refs: string[] = [];
      for (let i = 0; i < args.length; i++) if (args[i] === '-m' || args[i] === '--mainline') parentNumber = Number(args[++i]); else if (!args[i].startsWith('-')) refs.push(args[i]);
      if (refs.length !== 1) throw new Error('This simulator reverts one commit per command.');
      const target = resolve(state, refs[0]), current = requireHead(state);
      if (target.parents.length > 1 && parentNumber === undefined) throw new Error('Merge revert requires -m <parent-number>. Inspect its parents before choosing.');
      if (parentNumber !== undefined && (!Number.isInteger(parentNumber) || parentNumber < 1 || parentNumber > target.parents.length)) throw new Error('Invalid mainline parent.');
      const parent = target.parents[(parentNumber ?? 1) - 1];
      const result = mergeTrees(target.tree, current.tree, parent ? resolve(state, parent).tree : {});
      if (Object.keys(result.conflicts).length) throw new Error('This revert conflicts with subsequent changes. This scenario requires choosing an isolated revert commit.');
      checkoutTree(state, result.tree); const output = commitIndex(state, `Revert "${target.message}"`, true);
      state.flags.reverted = true; if (target.parents.length > 1) state.flags.mergeReverted = true;
      return output;
    }
    case 'merge': {
      flags(args, ['--abort', '--continue', '--no-ff', '--ff-only', '--squash', '-m']);
      if (args.includes('--abort')) { if (state.operation?.kind !== 'merge') throw new Error('No merge in progress.'); abortOperation(state); return 'Merge aborted.'; }
      if (args.includes('--continue')) { if (state.operation?.kind !== 'merge') throw new Error('No merge in progress.'); return commitIndex(state, 'Complete merge'); }
      const values: string[] = []; let message: string | undefined;
      for (let i = 0; i < args.length; i++) { if (args[i] === '-m') message = args[++i]; else if (!args[i].startsWith('-')) values.push(args[i]); }
      if (values.length !== 1) throw new Error('Usage: git merge [--no-ff|--ff-only|--squash] <branch>');
      if (args.includes('--no-ff') && args.includes('--ff-only')) throw new Error('Conflicting merge modes.');
      return merge(state, values[0], { noFF: args.includes('--no-ff'), ffOnly: args.includes('--ff-only'), squash: args.includes('--squash'), message });
    }
    case 'rebase': return rebase(state, args);
    case 'remote': {
      const [operation, ...values] = args;
      if (!operation || operation === '-v') return Object.entries(state.remotes).map(([name, remote]) => `${name}\t${remote.url} (fetch/push)`).join('\n') || '(no remotes)';
      if (operation === 'add') { const name = validRef(values[0] ?? ''); if (state.remotes[name]) throw new Error('Remote already exists.'); if (!values[1] || values.length !== 2) throw new Error('Usage: git remote add <name> <url>'); state.remotes[name] = { url: values[1], branches: {} }; return `Added remote ${name}.`; }
      if (operation === 'set-url') { const remote = state.remotes[values[0]]; if (!remote || !values[1] || values.length !== 2) throw new Error('Usage: git remote set-url <existing-name> <url>'); remote.url = values[1]; return 'Remote URL updated.'; }
      if (operation === 'remove' || operation === 'rm') { if (!state.remotes[values[0]]) throw new Error('Remote does not exist.'); delete state.remotes[values[0]]; return 'Remote removed.'; }
      if (operation === 'get-url') { if (!state.remotes[values[0]]) throw new Error('Remote does not exist.'); return state.remotes[values[0]].url; }
      throw new Error('Supported remote operations: -v, add, set-url, remove, get-url.');
    }
    case 'fetch':
    case 'pull':
    case 'push': {
      flags(args, ['--ff-only', '--rebase', '-u', '--set-upstream', '--tags', '--force-with-lease']);
      const values = args.filter(a => !a.startsWith('-')), remoteName = values[0] ?? 'origin', remote = state.remotes[remoteName];
      if (!remote) throw new Error(`No remote named ${remoteName}.`);
      const branch = values[1] ?? (state.head.kind === 'branch' ? state.head.name : 'main');
      if (command === 'push') {
        if (state.platform.blockDirectPush && (branch === 'main' || branch === 'master')) throw new Error('Protected branch: direct push is blocked. Open a pull request.');
        if (args.includes('--tags')) { if (!Object.keys(state.tags).length) throw new Error('No tags to push.'); state.flags.tagsPushed = true; state.flags.pushed = true; return 'Tags published to the simulated remote.'; }
        if (state.tags[branch]) { state.flags.tagsPushed = true; state.flags.pushed = true; return `Tag ${branch} published to the simulated remote.`; }
        if (!state.branches[branch]) throw new Error('Specify an existing local branch to push.');
        if (remote.branches[branch] && !ancestors(state, state.branches[branch]).has(remote.branches[branch]) && !args.includes('--force-with-lease')) throw new Error('Push rejected: non-fast-forward. Fetch and integrate first.');
        if (args.includes('--force-with-lease') && !state.flags[`fetched:${remoteName}`]) throw new Error('Fetch first to establish the expected remote reference for force-with-lease.');
        remote.branches[branch] = state.branches[branch]; state.flags.pushed = true;
        if (args.includes('-u') || args.includes('--set-upstream')) { state.config.local[`branch.${branch}.remote`] = remoteName; state.config.local[`branch.${branch}.merge`] = `refs/heads/${branch}`; }
        return `Published ${branch} to ${remoteName} (simulation).`;
      }
      // Seed fixtures represent server-side heads; fetch exposes them without changing the local branch.
      state.flags.fetched = true; state.flags[`fetched:${remoteName}`] = true;
      if (command === 'fetch') return `Fetched ${Object.keys(remote.branches).length} branch reference(s) from ${remoteName}. Local files and branch did not change.`;
      const target = remote.branches[branch]; if (!target) throw new Error('Remote branch does not exist.');
      const output = args.includes('--rebase') ? rebase(state, [target]) : merge(state, target, { ffOnly: args.includes('--ff-only') || effectiveConfig(state, 'pull.ff') === 'only' }); state.flags.pulled = true; return output;
    }
    case 'tag': {
      flags(args, ['-a', '-m', '-d', '--list']);
      const names: string[] = []; let message: string | undefined;
      for (let i = 0; i < args.length; i++) { if (args[i] === '-m') message = args[++i]; else if (!args[i].startsWith('-')) names.push(args[i]); }
      if (!names.length) return Object.keys(state.tags).sort().join('\n') || '(no tags)';
      const name = validRef(names[0]);
      if (args.includes('-d')) { if (!state.tags[name]) throw new Error('Tag does not exist.'); delete state.tags[name]; return `Deleted tag ${name}.`; }
      if (state.tags[name]) throw new Error('Tag already exists.');
      if (args.includes('-a') && !message) throw new Error('Use -m for the annotated tag message.');
      state.tags[name] = resolve(state, names[1] ?? 'HEAD').id;
      if (args.includes('-a')) state.flags[`tagAnnotation:${name}`] = message!;
      return `Created ${args.includes('-a') ? 'annotated' : 'lightweight'} tag ${name}.`;
    }
    case 'reflog': flags(args, ['--oneline']); return state.reflog.map((entry, i) => `${entry.commit.slice(0, 7)} HEAD@{${i}} ${entry.message}`).join('\n') || '(empty reflog)';
    case 'worktree': {
      const [operation, ...values] = args;
      if (operation === 'list') return `/workspace/project ${requireHead(state).id.slice(0, 7)} [${state.head.kind === 'branch' ? state.head.name : 'detached'}]\n` + Object.entries(state.worktrees).map(([path, worktree]) => `${path} ${state.branches[worktree.branch]?.slice(0, 7)} [${worktree.branch}]`).join('\n');
      if (operation === 'add') {
        flags(values, ['-b']); let path: string | undefined, branch: string | undefined, source = 'HEAD';
        for (let i = 0; i < values.length; i++) { if (values[i] === '-b') branch = validRef(values[++i] ?? ''); else if (!path) path = values[i]; else source = values[i]; }
        if (!path || !/^(\.\.\/)?[\w./-]{1,120}$/.test(path) || path.includes('/../../') || path === '.' || path === '..') throw new Error('Specify a simulated sibling directory, for example ../hotfix.');
        if (state.worktrees[path]) throw new Error('Worktree path already exists.');
        if (!branch) branch = source !== 'HEAD' ? source : path.split('/').at(-1)!;
        validRef(branch);
        if (state.head.kind === 'branch' && state.head.name === branch || Object.values(state.worktrees).some(w => w.branch === branch)) throw new Error('Branch is already checked out in another worktree.');
        if (values.includes('-b')) { if (state.branches[branch]) throw new Error('Branch already exists.'); state.branches[branch] = resolve(state, source).id; }
        else if (!state.branches[branch]) throw new Error('Branch does not exist. Use -b to create one.');
        state.worktrees[path] = { branch, files: clone(resolve(state, branch).tree) }; state.flags.worktreeCreated = true; return `Created worktree ${path} on ${branch}. HEAD/index are separate; objects and branch refs are shared.`;
      }
      if (operation === 'remove') { if (!state.worktrees[values[0]]) throw new Error('Worktree does not exist.'); delete state.worktrees[values[0]]; return 'Removed linked worktree; its branch is retained.'; }
      throw new Error('Supported worktree operations: add, list, remove.');
    }
    case 'show': {
      flags(args, ['--format=raw', '--no-patch', '-s']);
      const ref = args.find(a => !a.startsWith('-')) ?? 'HEAD';
      const colon = ref.indexOf(':'); if (colon >= 0) { const tree = resolve(state, ref.slice(0, colon)).tree, path = filePath(ref.slice(colon + 1)); if (!(path in tree)) throw new Error('File not found in commit.'); return tree[path]; }
      const commit = resolve(state, ref); state.flags.historyInspected = true;
      return `commit ${commit.id}\n${commit.parents.map(p => `parent ${p}`).join('\n')}\n\n${commit.message}\n${Object.keys(commit.tree).map(path => `${path}`).join('\n')}`;
    }
    case 'rev-parse': {
      if (args[0] === '--git-dir') return '.git';
      if (args[0] === '--git-common-dir') return '.git';
      if (args[0] === '--show-toplevel') return '/workspace/project';
      if (args[0] === '--git-path' && args[1]) return `.git/${args[1]}`;
      flags(args, ['--short', '--verify']); return args.includes('--short') ? resolve(state, args.find(a => !a.startsWith('-')) ?? 'HEAD').id.slice(0, 7) : resolve(state, args.find(a => !a.startsWith('-')) ?? 'HEAD').id;
    }
    case 'ls-files': flags(args, ['--stage']); return Object.keys(state.index).sort().map(p => args.includes('--stage') ? `100644 ${p}` : p).join('\n');
    case 'check-ignore': { flags(args, ['-v']); const paths = args.filter(a => !a.startsWith('-')); const ignored = paths.filter(p => isIgnored(state, filePath(p))); if (!ignored.length) throw new Error('No matching ignore rule for these paths.'); return ignored.join('\n'); }
    case 'check-attr': {
      if (!args.includes('--')) throw new Error('Usage: git check-attr <attribute|--all> -- <path>');
      const path = filePath(args[args.indexOf('--') + 1] ?? ''); state.flags.attributesInspected = true;
      return (state.files['.gitattributes'] ?? '').split('\n').filter(line => { const pattern = line.trim().split(/\s+/)[0]; return pattern && (pattern === '*' || pattern === path || pattern.startsWith('*.') && path.endsWith(pattern.slice(1))); }).map(line => `${path}: ${line.trim().split(/\s+/).slice(1).join(' ')}`).join('\n') || `${path}: unspecified`;
    }
    case 'rm': {
      flags(args, ['--cached', '-f', '--']); const paths = selectedPaths(state, args.filter(a => !a.startsWith('-')), Object.keys(state.index));
      for (const path of paths) { if (!args.includes('-f') && state.files[path] !== state.index[path]) throw new Error(`Unstaged changes in ${path}; refusing removal.`); delete state.index[path]; if (!args.includes('--cached')) delete state.files[path]; }
      return `Removed ${paths.length} tracked path(s).`;
    }
    default: throw new Error(`Unsupported Git command: ${command}. Type help for the implemented teaching subset.`);
  }
}
