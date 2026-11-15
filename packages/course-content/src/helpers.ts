import type { Action, Commit, Lesson, RepoSeed, Text, Tier } from '../../contracts/src/index.ts';

export const t = (it: string, en: string): Text => ({ it, en });
export const c = (it: string, en: string, bodyIt: string, bodyEn: string) => ({ title: t(it, en), body: t(bodyIt, bodyEn) });
export const cmd = (command: string): Action => ({ type: 'command', command });
export const edit = (path: string, content: string): Action => ({ type: 'edit', path, content });
export const answer = (questionId: string, value: string): Action => ({ type: 'answer', questionId, value });
export const platform = (operation: Extract<Action, { type: 'platform' }>['operation'], payload?: Record<string, string>): Action => ({ type: 'platform', operation, payload });
export const ROOT = 'a1b2c3d';
export const MAIN = 'b2c3d4e';
export const FEATURE = 'c3d4e5f';
export const MERGE = 'd4e5f6a';
export const files = { 'README.md': '# Git Practice Lab\n', 'catalog.json': '{"items":["tea"]}\n' };
export const commit = (id: string, parents: string[], message: string, tree: Record<string, string>): Commit => ({ id, parents, message, tree: { ...tree } });
export function seed(overrides: RepoSeed = {}): RepoSeed {
  return {
    files: { ...files }, trackedFiles: { ...files },
    commits: [commit(ROOT, [], 'Initial catalog', files)], branches: { main: ROOT }, currentBranch: 'main',
    config: { global: { 'user.name': 'Alex Learner', 'user.email': 'alex@example.test' } },
    remotes: { origin: { url: 'https://github.com/example/git-lab.git', branches: { main: ROOT } } },
    ...overrides,
  };
}
export function diverged(conflict = false): RepoSeed {
  const main = { ...files, 'README.md': '# Git Practice Lab\nReviewed catalog\n' };
  const feature = conflict
    ? { ...files, 'README.md': '# Git Practice Lab\nExpanded catalog\n' }
    : { ...files, 'catalog.json': '{"items":["tea","coffee"]}\n' };
  return seed({
    files: main, trackedFiles: main,
    commits: [commit(ROOT, [], 'Initial catalog', files), commit(MAIN, [ROOT], 'Review README', main), commit(FEATURE, [ROOT], 'Expand catalog', feature)],
    branches: { main: MAIN, feature: FEATURE },
  });
}
export function linear(): RepoSeed {
  const first = { ...files, 'README.md': '# Git Practice Lab\nDraft catalog guide\n' };
  const second = { ...first, 'catalog.json': '{"items":["tea","coffee"]}\n' };
  return seed({
    files: second, trackedFiles: second,
    commits: [commit(ROOT, [], 'Initial catalog', files), commit(MAIN, [ROOT], 'Draft guide', first), commit(FEATURE, [MAIN], 'Fix catalog', second)],
    branches: { main: ROOT, feature: FEATURE }, currentBranch: 'feature',
  });
}
export const refs = (...items: [string, string][]) => items.map(([label, url]) => ({ label, url }));
export const gitRef = (name: string): [string, string] => [`git ${name}`, `https://git-scm.com/docs/git-${name}`];
export function lesson(input: Omit<Lesson, 'tier' | 'order' | 'estimatedMinutes'> & { estimatedMinutes?: number }): Lesson {
  const tier: Tier = input.id.startsWith('B') ? 'base' : input.id.startsWith('M') ? 'intermediate' : 'advanced';
  return { ...input, tier, order: Number(input.id.slice(1)), estimatedMinutes: input.estimatedMinutes ?? (tier === 'base' ? 18 : tier === 'intermediate' ? 24 : 28) };
}
