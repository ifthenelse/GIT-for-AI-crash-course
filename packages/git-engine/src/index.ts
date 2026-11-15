import type { Action, EngineResult, Objective, ObjectiveResult, RepoSeed, RepositoryState } from '../../contracts/src/index.ts';
import { ancestors, checkedTree, clone, createRepository, effectiveConfig, getHeadCommit, getStatus, isIgnored, MAX_ACTIONS } from './model.ts';
import { platformAction } from './platform.ts';
import { editFile, shellCommand } from './shell.ts';
export { createRepository, getHeadCommit, getStatus } from './model.ts';

/** Commands are transactions: invalid commands return the exact unchanged input. */
export function executeCommand(state: RepositoryState, command: string): EngineResult {
  try {
    if (typeof command !== 'string') throw new Error('Command must be a string.');
    const next = clone(state), output = shellCommand(next, command);
    checkedTree(next.files); checkedTree(next.index);
    return { state: next, output };
  } catch (error) { return { state, output: error instanceof Error ? error.message : 'Invalid command.', error: true }; }
}
export function applyAction(state: RepositoryState, action: Action): EngineResult {
  try {
    if (!action || typeof action !== 'object') throw new Error('Invalid action.');
    if (action.type === 'command') return executeCommand(state, action.command);
    if (action.type === 'undo' || action.type === 'redo' || action.type === 'reset') throw new Error('History controls require replayActions(seed, actions), which retains complete state snapshots.');
    const next = clone(state); let output: string;
    if (action.type === 'edit') {
      if (typeof action.content !== 'string') throw new Error('File content must be a string.');
      output = editFile(next, action.path, action.content);
    } else if (action.type === 'answer') {
      if (!/^[\w.-]{1,120}$/.test(action.questionId) || ['__proto__', 'constructor', 'prototype'].includes(action.questionId) || typeof action.value !== 'string' || action.value.length > 1024) throw new Error('Invalid quiz answer.');
      next.answers[action.questionId] = action.value; output = 'Answer recorded.';
    } else if (action.type === 'platform') output = platformAction(next, action);
    else throw new Error('Unsupported action.');
    checkedTree(next.files); checkedTree(next.index);
    return { state: next, output };
  } catch (error) { return { state, output: error instanceof Error ? error.message : 'Invalid action.', error: true }; }
}

/** Server and frontend replay precisely the same log; history never contains user progress. */
export function replayActions(seed: RepoSeed | undefined, actions: Action[]): RepositoryState {
  if (!Array.isArray(actions) || actions.length > MAX_ACTIONS) throw new Error(`An exercise accepts at most ${MAX_ACTIONS} actions.`);
  if (JSON.stringify(actions).length > 262144) throw new Error('Exercise action payload exceeds 256 KiB.');
  const initial = createRepository(seed), undo: RepositoryState[] = [], redo: RepositoryState[] = [];
  let state = initial;
  for (const action of actions) {
    if (!action || typeof action !== 'object') throw new Error('Invalid action in replay.');
    if (action.type === 'reset') { state = clone(initial); undo.length = 0; redo.length = 0; continue; }
    if (action.type === 'undo') { if (undo.length) { redo.push(state); state = undo.pop()!; } continue; }
    if (action.type === 'redo') { if (redo.length) { undo.push(state); state = redo.pop()!; } continue; }
    const result = applyAction(state, action);
    if (result.error) continue;
    if (JSON.stringify(result.state) !== JSON.stringify(state)) { undo.push(state); redo.length = 0; state = result.state; }
  }
  return state;
}

function passedObjective(state: RepositoryState, objective: Objective): boolean {
  switch (objective.type) {
    case 'file': {
      if (!(objective.path in state.files)) return false;
      if (objective.content !== undefined && state.files[objective.path] !== objective.content) return false;
      if (objective.includes !== undefined && !state.files[objective.path].includes(objective.includes)) return false;
      if (objective.tracked !== undefined && (objective.path in state.index) !== objective.tracked) return false;
      return true;
    }
    case 'commit': {
      const head = getHeadCommit(state); if (!head) return false;
      const reachable = ancestors(state, head.id);
      return state.commits.some(commit => reachable.has(commit.id) && (objective.messageIncludes === undefined || commit.message.includes(objective.messageIncludes)) && (objective.file === undefined || objective.file in commit.tree && (objective.contains === undefined || commit.tree[objective.file].includes(objective.contains))));
    }
    case 'branch': return objective.name in state.branches && (!objective.current || state.head.kind === 'branch' && state.head.name === objective.name);
    case 'clean': { const status = getStatus(state); return !status.staged.length && !status.modified.length && !status.untracked.length && !Object.keys(state.conflicts).length && !state.operation; }
    case 'config': return (objective.scope ? state.config[objective.scope][objective.key] : effectiveConfig(state, objective.key)) === objective.value;
    case 'remote': return !!state.remotes[objective.name] && (objective.urlIncludes === undefined || state.remotes[objective.name].url.includes(objective.urlIncludes));
    case 'tag': return !!state.tags[objective.name];
    case 'operation-complete': return state.operation === null;
    case 'no-conflicts': return Object.keys(state.conflicts).length === 0;
    case 'flag': return objective.value === undefined ? !!state.flags[objective.name] : state.flags[objective.name] === objective.value;
    case 'answer': return state.answers[objective.questionId] === objective.value;
    case 'platform': {
      const keys = {
        pullRequestOpen: state.platform.pullRequests.some(pr => !pr.merged),
        pullRequestApproved: state.platform.pullRequests.some(pr => pr.approved),
        pullRequestMerged: state.platform.pullRequests.some(pr => pr.merged),
        reviewRequired: state.platform.reviewRequired, blockDirectPush: state.platform.blockDirectPush,
        releasePublished: state.platform.releases.length > 0, forked: state.platform.forked, provider: state.platform.provider,
      };
      return keys[objective.key] === objective.value;
    }
    case 'worktree': return !!state.worktrees[objective.path];
    case 'history': { const head = getHeadCommit(state); if (!head) return false; return (objective.minimum === undefined || ancestors(state, head.id).size >= objective.minimum) && (objective.parentCount === undefined || head.parents.length === objective.parentCount); }
    case 'ignore': return isIgnored(state, objective.path);
    case 'attributes': return (state.files[objective.path] ?? '').includes(objective.includes);
    case 'hook': return !!state.files[`.git/hooks/${objective.name}`] && state.flags[`executable:.git/hooks/${objective.name}`] === true;
    default: return false;
  }
}
export function evaluateObjectives(state: RepositoryState, objectives: Objective[]): ObjectiveResult[] {
  if (!Array.isArray(objectives) || objectives.length > 100) throw new Error('Invalid exercise objectives.');
  return objectives.map(objective => ({ objective, passed: passedObjective(state, objective) }));
}
