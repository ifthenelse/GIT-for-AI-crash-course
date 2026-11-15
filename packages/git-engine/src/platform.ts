import type { Action, RepositoryState } from '../../contracts/src/index.ts';
import { checkedTree, clone, getHeadCommit, recordCommit, resolve } from './model.ts';
import { filePath, validRef } from './parser.ts';
import { merge } from './git.ts';

type PlatformAction = Extract<Action, { type: 'platform' }>;
export function platformAction(state: RepositoryState, action: PlatformAction): string {
  const payload = action.payload ?? {};
  if (Object.keys(payload).length > 12 || Object.values(payload).some(v => typeof v !== 'string' || v.length > 32768)) throw new Error('Invalid platform payload.');
  switch (action.operation) {
    case 'switch-provider': {
      if (payload.provider !== 'github' && payload.provider !== 'azure') throw new Error('Choose github or azure.');
      state.platform.provider = payload.provider; return `Selected ${payload.provider}. This is a local platform simulation.`;
    }
    case 'open-pr': {
      const source = validRef(payload.source ?? (state.head.kind === 'branch' ? state.head.name : ''));
      const target = validRef(payload.target ?? 'main');
      if (source === target) throw new Error('Pull request source and target must differ.');
      if (!state.branches[source] || !state.branches[target]) throw new Error('Both pull request branches must exist.');
      if (state.branches[source] === state.branches[target]) throw new Error('There are no changes between these branches.');
      if (!payload.title?.trim()) throw new Error('Add a descriptive pull request title.');
      const id = Math.max(0, ...state.platform.pullRequests.map(p => p.id)) + 1;
      if (id > 100) throw new Error('Pull request limit reached.');
      state.platform.pullRequests.push({ id, source, target, title: payload.title, approved: false, merged: false }); return `Pull request #${id} opened: ${source} → ${target}.`;
    }
    case 'approve-pr':
    case 'merge-pr': {
      const id = Number(payload.id); const pr = state.platform.pullRequests.find(p => p.id === id);
      if (!pr) throw new Error('Pull request not found.');
      if (pr.merged) throw new Error('Pull request is already merged.');
      if (action.operation === 'approve-pr') { pr.approved = true; return `Pull request #${id} approved by the simulated reviewer.`; }
      if (state.platform.reviewRequired && !pr.approved) throw new Error('Policy blocks this merge: an approval is required.');
      const originalHead = clone(state.head), originalFiles = clone(state.files), originalIndex = clone(state.index);
      state.head = { kind: 'branch', name: pr.target };
      state.index = clone(resolve(state, pr.target).tree); state.files = clone(state.index);
      const output = merge(state, pr.source, { noFF: true, message: `Merge pull request #${id}: ${pr.title}` });
      if (Object.keys(state.conflicts).length) throw new Error('Pull request has conflicts. Resolve them on the source branch before merging.');
      pr.merged = true; state.flags.pullRequestMerged = true;
      // A website merge updates branch references without overwriting an unrelated local working copy.
      if (originalHead.kind !== 'branch' || originalHead.name !== pr.target) { state.head = originalHead; state.files = originalFiles; state.index = originalIndex; }
      return output;
    }
    case 'enable-policy': {
      const keys = Object.keys(payload);
      if (!keys.length || keys.some(k => !['reviewRequired', 'blockDirectPush'].includes(k)) || Object.values(payload).some(v => v !== 'true' && v !== 'false')) throw new Error('Policy values must be reviewRequired/blockDirectPush with string true or false.');
      if (payload.reviewRequired !== undefined) state.platform.reviewRequired = payload.reviewRequired === 'true';
      if (payload.blockDirectPush !== undefined) state.platform.blockDirectPush = payload.blockDirectPush === 'true';
      return 'Simulated repository policy updated.';
    }
    case 'create-release': {
      if (state.platform.provider !== 'github') throw new Error('This lesson models GitHub releases. Select GitHub first.');
      const tag = validRef(payload.tag ?? '');
      if (!state.tags[tag]) throw new Error('Create the release tag first.');
      if (!payload.title?.trim()) throw new Error('A release title is required.');
      if (state.platform.releases.some(r => r.tag === tag)) throw new Error('A release already exists for this tag.');
      state.platform.releases.push({ tag, title: payload.title }); return `Published simulated release ${tag}.`;
    }
    case 'fork': {
      if (state.platform.provider !== 'github') throw new Error('The fork exercise models GitHub.');
      if (state.platform.forked) throw new Error('Repository is already forked.');
      if (!state.remotes.origin) throw new Error('Clone a repository before forking it.');
      state.platform.forked = true; return 'Created simulated fork. Configure your local origin and upstream explicitly.';
    }
    case 'agent-change': {
      if (state.operation) throw new Error('Finish the current Git operation first.');
      const parent = getHeadCommit(state); if (!parent) throw new Error('The cloud agent needs a repository with a commit.');
      const branch = validRef(payload.branch ?? 'agent/catalog');
      if (state.branches[branch]) throw new Error('Agent branch already exists.');
      const path = filePath(payload.path ?? '');
      if (payload.content === undefined || path.startsWith('.git/') || path.startsWith('.ssh/')) throw new Error('Choose a regular source file and content for the simulated agent.');
      const tree = checkedTree({ ...clone(parent.tree), [path]: payload.content });
      const commit = recordCommit(state, tree, [parent.id], payload.message ?? 'Agent: update requested file');
      state.branches[branch] = commit.id; state.flags.agentChanged = true;
      return `Simulated cloud agent created ${branch}. Your local uncommitted files were not part of its checkout. Review the branch using a pull request.`;
    }
    default: throw new Error('Unsupported platform operation.');
  }
}
