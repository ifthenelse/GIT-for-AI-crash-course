import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applyAction, createRepository, executeCommand, getHeadCommit, getStatus, replayActions } from './index.ts';
import { diverged, files, linear, ROOT } from '../../course-content/src/helpers.ts';
const run = (state: ReturnType<typeof createRepository>, command: string) => {
  const r = executeCommand(state, command);
  expect(r.error, r.output).not.toBe(true);
  return r.state;
};
function realRepo(test: (git: (...args: string[]) => string, path: string) => void) {
  const path = mkdtempSync(join(tmpdir(), 'git-lab-'));
  const git = (...args: string[]) => execFileSync('git', args, {
    cwd: path,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_CONFIG_GLOBAL: '/dev/null'
    }
  }).trim();
  try {
    git('init', '-b', 'main');
    git('config', 'user.name', 'Test');
    git('config', 'user.email', 'test@example.test');
    for (const [p, s] of Object.entries(files)) writeFileSync(join(path, p), s);
    git('add', '.');
    git('commit', '-m', 'Initial catalog');
    test(git, path);
  } finally {
    rmSync(path, {
      recursive: true,
      force: true
    });
  }
}
describe('Git state semantics and execution boundary', () => {
  it('matches real Git staging snapshots rather than committing later edits', () => realRepo((git, path) => {
    let s = createRepository({
      files,
      trackedFiles: files
    });
    s = applyAction(s, {
      type: 'edit',
      path: 'README.md',
      content: 'first\n'
    }).state;
    writeFileSync(join(path, 'README.md'), 'first\n');
    s = run(s, 'git add README.md');
    git('add', 'README.md');
    s = applyAction(s, {
      type: 'edit',
      path: 'README.md',
      content: 'later\n'
    }).state;
    writeFileSync(join(path, 'README.md'), 'later\n');
    s = run(s, 'git commit -m "Snapshot"');
    git('commit', '-m', 'Snapshot');
    expect(getHeadCommit(s)?.tree['README.md']).toBe(git('show', 'HEAD:README.md') + '\n');
    expect(getStatus(s).modified).toEqual(['README.md']);
    expect(git('status', '--porcelain')).toContain('M README.md');
  }));
  for (const mode of ['soft', 'mixed', 'hard']) it(`matches real Git reset --${mode} destinations`, () => realRepo((git, path) => {
    let s = createRepository({
      files,
      trackedFiles: files
    });
    s = applyAction(s, {
      type: 'edit',
      path: 'README.md',
      content: 'changed\n'
    }).state;
    writeFileSync(join(path, 'README.md'), 'changed\n');
    s = run(s, 'git add README.md');
    git('add', 'README.md');
    s = run(s, 'git commit -m "Change"');
    git('commit', '-m', 'Change');
    s = run(s, `git reset --${mode} HEAD~1`);
    git('reset', `--${mode}`, 'HEAD~1');
    expect(s.files['README.md']).toBe(readFileSync(join(path, 'README.md'), 'utf8'));
    expect(s.index['README.md']).toBe(git('show', ':README.md') + '\n');
  }));
  it('matches real Git independent-file merge and merge revert contents/parents', () => realRepo((git, path) => {
    git('switch', '-c', 'feature');
    writeFileSync(join(path, 'catalog.json'), '{"items":["tea","coffee"]}\n');
    git('add', '.');
    git('commit', '-m', 'Expand catalog');
    git('switch', 'main');
    writeFileSync(join(path, 'README.md'), '# Git by doing\nReviewed catalog\n');
    git('add', '.');
    git('commit', '-m', 'Review README');
    let s = run(createRepository(diverged()), 'git merge feature');
    git('merge', 'feature', '-m', 'Merge feature');
    expect(getHeadCommit(s)?.parents).toHaveLength(2);
    for (const p of Object.keys(files)) expect(s.files[p]).toBe(readFileSync(join(path, p), 'utf8'));
    s = run(s, 'git revert -m 1 HEAD');
    git('revert', '-m', '1', '--no-edit', 'HEAD');
    for (const p of Object.keys(files)) expect(s.files[p]).toBe(readFileSync(join(path, p), 'utf8'));
  }));
  it('retains both sides of a conflict until the learner resolves and stages it', () => {
    let s = run(createRepository(diverged(true)), 'git merge feature');
    expect(Object.keys(s.conflicts)).toEqual(['README.md']);
    expect(s.files['README.md']).toContain('<<<<<<<');
    const denied = executeCommand(s, 'git commit -m "premature"');
    expect(denied.error).toBe(true);
    expect(denied.state).toBe(s);
    s = applyAction(s, {
      type: 'edit',
      path: 'README.md',
      content: 'both intentions\n'
    }).state;
    s = run(s, 'git add README.md');
    s = run(s, 'git commit -m "Resolve"');
    expect(getHeadCommit(s)?.parents).toHaveLength(2);
    expect(s.operation).toBeNull();
  });
  it('rebase changes parent relationships while preserving intended files', () => {
    let s = run(createRepository(diverged()), 'git switch feature');
    s = run(s, 'git rebase main');
    const head = getHeadCommit(s)!;
    expect(head.parents).toEqual([s.branches.main]);
    expect(head.id).not.toBe('c3d4e5f');
    expect(s.files['README.md']).toContain('Reviewed catalog');
    expect(s.files['catalog.json']).toContain('coffee');
  });
  it('replay undo/redo/reset reconstructs state and never mutates seed', () => {
    const seed = linear();
    const actions = [{
      type: 'command' as const,
      command: 'git switch -c scratch'
    }, {
      type: 'edit' as const,
      path: 'README.md',
      content: 'draft'
    }, {
      type: 'undo' as const
    }];
    const state = replayActions(seed, actions);
    expect(state.files['README.md']).not.toBe('draft');
    expect(state.branches.scratch).toBeTruthy();
    expect(replayActions(seed, [...actions, {
      type: 'redo'
    }]).files['README.md']).toBe('draft');
    expect(replayActions(seed, [...actions, {
      type: 'reset'
    }])).toEqual(createRepository(seed));
    expect(seed.branches).not.toHaveProperty('scratch');
  });
  it('rejects arbitrary shell execution, traversal, prototype paths and destructive internals', () => {
    const state = createRepository();
    for (const command of ['git status; touch bad', 'echo $(whoami)', 'cat ../../etc/passwd', 'touch __proto__/polluted', 'echo hacked > .git/HEAD', 'curl https://example.com']) {
      const result = executeCommand(state, command);
      expect(result.error, command).toBe(true);
      expect(result.state).toBe(state);
    }
    expect({}).not.toHaveProperty('polluted');
  });
  it('forbids checking out the same branch in another worktree', () => {
    let s = createRepository(linear());
    s = run(s, 'git worktree add main-worktree main');
    const result = executeCommand(s, 'git switch main');
    expect(result.error).toBe(true);
    expect(result.state).toBe(s);
  });
  it('refuses merge revert without choosing a mainline', () => {
    let s = run(createRepository(diverged()), 'git merge feature');
    expect(executeCommand(s, 'git revert HEAD').error).toBe(true);
  });
});
