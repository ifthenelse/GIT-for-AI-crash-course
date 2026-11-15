import type { Commit, Conflict, RepoSeed, RepositoryState } from '../../contracts/src/index.ts';
import { filePath } from './parser.ts';

export type Tree = Record<string, string>;
export const MAX_FILES = 160;
export const MAX_CONTENT = 32_768;
export const MAX_ACTIONS = 500;
export const clone = <T>(value: T): T => structuredClone(value);
export const sorted = (tree: Tree): Tree => Object.fromEntries(Object.keys(tree).sort().map(k => [k, tree[k]]));
export const same = (a: Tree, b: Tree): boolean => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
export const changedPaths = (a: Tree, b: Tree): string[] => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => a[k] !== b[k]).sort();
export function checkedTree(tree: Tree): Tree {
  if (Object.keys(tree).length > MAX_FILES) throw new Error('The simulated repository supports at most 160 files.');
  for (const [path, content] of Object.entries(tree)) {
    filePath(path);
    if (typeof content !== 'string' || content.length > MAX_CONTENT) throw new Error('Each simulated file is limited to 32 KiB.');
  }
  return tree;
}
export function getHeadCommit(state: RepositoryState): Commit | undefined {
  const id = state.head.kind === 'branch' ? state.branches[state.head.name] : state.head.commit;
  return state.commits.find(c => c.id === id);
}
export const headTree = (state: RepositoryState): Tree => getHeadCommit(state)?.tree ?? {};
export function effectiveConfig(state: RepositoryState, key: string): string | undefined {
  return state.config.worktree[key] ?? state.config.local[key] ?? state.config.global[key] ?? state.config.system[key];
}
export function hash(value: string): string {
  let a = 0x811c9dc5, b = 0x85ebca6b;
  for (let i = 0; i < value.length; i++) { a = Math.imul(a ^ value.charCodeAt(i), 0x01000193); b = Math.imul(b ^ value.charCodeAt(i), 0x5bd1e995); }
  return (a >>> 0).toString(16).padStart(8, '0') + (b >>> 0).toString(16).padStart(8, '0');
}
export function recordCommit(state: RepositoryState, tree: Tree, parents: string[], message: string): Commit {
  const value = { parents, message, tree: sorted(tree) };
  const id = hash(JSON.stringify(value));
  const existing = state.commits.find(c => c.id === id);
  if (existing) return existing;
  if (state.commits.length >= 512) throw new Error('Simulated commit limit reached. Reset the exercise.');
  const commit = { id, ...clone(value) };
  state.commits.push(commit);
  return commit;
}
export function moveHead(state: RepositoryState, id: string, message: string): void {
  if (state.head.kind === 'branch') state.branches[state.head.name] = id;
  else state.head.commit = id;
  state.reflog.unshift({ commit: id, message });
  state.reflog = state.reflog.slice(0, 256);
}
export function createRepository(seed: RepoSeed = {}): RepositoryState {
  const commits = clone(seed.commits ?? []);
  if (commits.length > 256) throw new Error('Too many seed commits.');
  for (const commit of commits) checkedTree(commit.tree);
  const tracked = clone(seed.trackedFiles ?? commits.at(-1)?.tree ?? {});
  const state: RepositoryState = {
    files: clone(seed.files ?? tracked), index: tracked, commits,
    head: { kind: 'branch', name: seed.currentBranch ?? 'main' },
    branches: clone(seed.branches ?? {}), tags: clone(seed.tags ?? {}), remotes: clone(seed.remotes ?? {}),
    config: { system: {}, global: {}, local: {}, worktree: {}, ...clone(seed.config ?? {}) },
    reflog: [], conflicts: clone(seed.conflicts ?? {}), operation: clone(seed.operation ?? null), worktrees: {},
    flags: { initialized: true, ...clone(seed.flags ?? {}) }, answers: {},
    platform: { provider: 'github', pullRequests: [], reviewRequired: false, blockDirectPush: false, releases: [], forked: false, ...clone(seed.platform ?? {}) },
  };
  if (!state.commits.length && Object.keys(tracked).length) recordCommit(state, tracked, [], 'Initial commit');
  if (!Object.keys(state.branches).length && state.commits.length) state.branches[seed.currentBranch ?? 'main'] = state.commits.at(-1)!.id;
  const current = getHeadCommit(state);
  if (seed.trackedFiles === undefined && current) {
    state.index = clone(current.tree);
    if (seed.files === undefined) state.files = clone(current.tree);
  }
  if (current) state.reflog.push({ commit: current.id, message: 'initial state' });
  checkedTree(state.files); checkedTree(state.index);
  return state;
}
function glob(pattern: string, path: string): boolean {
  // Patterns are parsed as text, never executed as regex supplied by the user.
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]').replace(/\u0000/g, '.*');
  return new RegExp(`^${escaped}$`).test(path);
}
export function isIgnored(state: RepositoryState, path: string): boolean {
  // A tracked file is not made untracked by .gitignore.
  if (path in state.index) return false;
  if (path.startsWith('.git/')) return true;
  let ignored = false;
  const rules = (state.files['.gitignore'] ?? '').split('\n').slice(0, 256);
  for (let line of rules) {
    line = line.trim(); if (!line || line.startsWith('#')) continue;
    const negated = line.startsWith('!'); if (negated) line = line.slice(1);
    const anchored = line.startsWith('/'); if (anchored) line = line.slice(1);
    const directory = line.endsWith('/'); if (directory) line = line.slice(0, -1);
    const parts = path.split('/');
    const candidates = anchored || line.includes('/') ? [path] : parts;
    const matches = candidates.some(p => glob(line, p)) || (directory && (path.startsWith(line + '/') || (!anchored && parts.slice(0, -1).some(p => glob(line, p)))));
    if (matches) ignored = !negated;
  }
  return ignored;
}
export function getStatus(state: RepositoryState): { staged: string[]; modified: string[]; untracked: string[] } {
  return {
    staged: changedPaths(headTree(state), state.index).filter(p => !(p in state.conflicts)),
    modified: Object.keys(state.index).filter(p => state.files[p] !== state.index[p]).sort(),
    untracked: Object.keys(state.files).filter(p => !(p in state.index) && !(p in state.conflicts) && !isIgnored(state, p)).sort(),
  };
}
export function assertClean(state: RepositoryState): void {
  const status = getStatus(state);
  if (status.staged.length || status.modified.length || Object.keys(state.conflicts).length) throw new Error('Commit or restore your tracked changes before this operation.');
}
export function checkoutTree(state: RepositoryState, tree: Tree): void {
  // Preserve untracked files unless the incoming tree would overwrite them.
  const untracked = Object.fromEntries(Object.entries(state.files).filter(([p]) => !(p in state.index)));
  for (const path of Object.keys(untracked)) if (path in tree && tree[path] !== untracked[path]) throw new Error(`Untracked file would be overwritten: ${path}`);
  state.files = { ...untracked, ...clone(tree) }; state.index = clone(tree);
}
export function resolve(state: RepositoryState, expression = 'HEAD'): Commit {
  const suffix = expression.match(/^(.*?)([~^])(\d*)$/);
  if (suffix) {
    let commit = resolve(state, suffix[1] || 'HEAD'); const count = Number(suffix[3] || 1);
    if (count > 256) throw new Error('Revision traversal limit exceeded.');
    if (suffix[2] === '^') {
      if (count === 0) return commit;
      const parent = state.commits.find(c => c.id === commit.parents[count - 1]);
      if (!parent) throw new Error(`Unknown parent: ${expression}`); return parent;
    }
    for (let i = 0; i < count; i++) { const parent = state.commits.find(c => c.id === commit.parents[0]); if (!parent) throw new Error(`Unknown ancestor: ${expression}`); commit = parent; }
    return commit;
  }
  const reflog = expression.match(/^HEAD@\{(\d+)\}$/);
  const remoteParts = expression.split('/');
  const id = expression === 'HEAD' ? getHeadCommit(state)?.id : reflog ? state.reflog[Number(reflog[1])]?.commit : state.branches[expression] ?? state.tags[expression] ?? state.remotes[remoteParts[0]]?.branches[remoteParts.slice(1).join('/')];
  const matches = state.commits.filter(c => id ? c.id === id : c.id.startsWith(expression));
  if (matches.length !== 1) throw new Error(`Unknown or ambiguous revision: ${expression}`);
  return matches[0];
}
export function ancestors(state: RepositoryState, id: string): Set<string> {
  const result = new Set<string>(), queue = [id];
  while (queue.length) { const next = queue.pop()!; if (result.has(next)) continue; result.add(next); queue.push(...(state.commits.find(c => c.id === next)?.parents ?? [])); }
  return result;
}
export function commonAncestor(state: RepositoryState, ours: string, theirs: string): Commit | undefined {
  const theirsAncestors = ancestors(state, theirs), queue = [ours], visited = new Set<string>();
  while (queue.length) { const next = queue.shift()!; if (visited.has(next)) continue; visited.add(next); const commit = state.commits.find(c => c.id === next); if (theirsAncestors.has(next)) return commit; queue.push(...(commit?.parents ?? [])); }
  return undefined;
}
function textMerge(base: string | undefined, ours: string | undefined, theirs: string | undefined): string | undefined | false {
  if (ours === theirs || theirs === base) return ours;
  if (ours === base) return theirs;
  if (base === undefined || ours === undefined || theirs === undefined) return false;
  const original = base.split('\n');
  function edit(value: string) {
    const lines = value.split('\n'); let start = 0, end = original.length, replacementEnd = lines.length;
    while (start < end && start < replacementEnd && original[start] === lines[start]) start++;
    while (end > start && replacementEnd > start && original[end - 1] === lines[replacementEnd - 1]) { end--; replacementEnd--; }
    return { start, end, lines: lines.slice(start, replacementEnd) };
  }
  const a = edit(ours), b = edit(theirs);
  // Two changes with disjoint line ranges are combined. Ambiguous edits conservatively conflict.
  if ((a.start === b.start && (a.start === a.end || b.start === b.end)) || !(a.end <= b.start || b.end <= a.start)) return false;
  const result = original.slice();
  for (const change of [a, b].sort((x, y) => y.start - x.start)) result.splice(change.start, change.end - change.start, ...change.lines);
  return result.join('\n');
}
export function mergeTrees(base: Tree, ours: Tree, theirs: Tree): { tree: Tree; conflicts: Record<string, Conflict> } {
  const tree: Tree = {}, conflicts: Record<string, Conflict> = {};
  for (const path of new Set([...Object.keys(base), ...Object.keys(ours), ...Object.keys(theirs)])) {
    const result = textMerge(base[path], ours[path], theirs[path]);
    if (result === false) conflicts[path] = { base: base[path] ?? '', ours: ours[path] ?? '', theirs: theirs[path] ?? '' };
    else if (result !== undefined) tree[path] = result;
  }
  return { tree, conflicts };
}
export function beginConflicts(state: RepositoryState, result: ReturnType<typeof mergeTrees>): boolean {
  const cache = JSON.parse(String(state.flags.__rerereCache ?? '{}')) as Record<string, string>;
  state.conflicts = clone(result.conflicts);
  const reused = new Set<string>();
  for (const [path, conflict] of Object.entries(state.conflicts)) {
    const key = hash(JSON.stringify(conflict));
    if (effectiveConfig(state, 'rerere.enabled') === 'true' && key in cache) {
      result.tree[path] = cache[key]; reused.add(path); state.flags.rerereApplied = true;
    }
  }
  state.files = { ...Object.fromEntries(Object.entries(state.files).filter(([p]) => !(p in state.index))), ...clone(result.tree) };
  state.index = clone(result.tree);
  state.flags.__conflictOriginal = JSON.stringify(result.conflicts);
  for (const [path, conflict] of Object.entries(state.conflicts)) if (!reused.has(path)) state.files[path] = `<<<<<<< HEAD\n${conflict.ours.replace(/\n$/, '')}\n=======\n${conflict.theirs.replace(/\n$/, '')}\n>>>>>>> incoming\n`;
  return Object.keys(state.conflicts).length > 0;
}
export function rememberResolutions(state: RepositoryState): void {
  if (effectiveConfig(state, 'rerere.enabled') !== 'true') return;
  const original = JSON.parse(String(state.flags.__conflictOriginal ?? '{}')) as Record<string, Conflict>;
  const cache = JSON.parse(String(state.flags.__rerereCache ?? '{}')) as Record<string, string>;
  for (const [path, conflict] of Object.entries(original)) if (path in state.index) cache[hash(JSON.stringify(conflict))] = state.index[path];
  state.flags.__rerereCache = JSON.stringify(cache);
}
export function saveOperation(state: RepositoryState): void {
  state.flags.__operationSnapshot = JSON.stringify({ files: state.files, index: state.index, head: state.head });
}
export function clearOperation(state: RepositoryState): void {
  state.operation = null; state.conflicts = {};
  for (const key of ['__operationSnapshot', '__rebaseQueue', '__rebaseHead', '__rebaseBranch', '__rebaseCurrent', '__conflictOriginal', '__pendingParents']) delete state.flags[key];
  delete state.files['.git/rebase-todo']; delete state.files['.git/rebase-message'];
}
export function abortOperation(state: RepositoryState): void {
  if (!state.operation) throw new Error('No operation to abort.');
  const snapshot = state.flags.__operationSnapshot;
  if (snapshot) { const data = JSON.parse(String(snapshot)); state.files = data.files; state.index = data.index; state.head = data.head; }
  else { const original = resolve(state, state.operation.originalHead); checkoutTree(state, original.tree); moveHead(state, original.id, 'abort'); }
  clearOperation(state);
}
