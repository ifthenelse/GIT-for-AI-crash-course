import { expect, it } from 'vitest';
import { getLesson } from '@gitcourse/content';
import { getHeadCommit, replayActions } from '@gitcourse/engine';
import { useLab } from './store';
it('keeps Zundo and the server action log aligned across edit, commit, undo, redo and reset', () => {
  const lesson = getLesson('B07')!;
  useLab.getState().hydrate(lesson);
  for (const action of lesson.solution) useLab.getState().act(action);
  expect(getHeadCommit(useLab.getState().repo)?.message).toBe('Fix catalog introduction');
  for (const type of ['undo', 'redo', 'reset'] as const) {
    useLab.getState().act({
      type
    });
    expect(useLab.getState().repo).toEqual(replayActions(lesson.seed, useLab.getState().actions));
  }
  expect(useLab.getState().actions).toEqual([{
    type: 'reset'
  }]);
  expect(useLab.temporal.getState().pastStates).toHaveLength(0);
});
