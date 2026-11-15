import { create } from 'zustand';
import { temporal } from 'zundo';
import type { Action, Lesson, RepoSeed, RepositoryState } from '@gitcourse/contracts';
import { applyAction, createRepository, replayActions } from '@gitcourse/engine';

export interface ConsoleLine { id: number; command?: string; output: string; error?: boolean; }
interface LabState {
  lessonId: string; seed: RepoSeed; repo: RepositoryState; actions: Action[]; lines: ConsoleLine[];
  hydrate: (lesson: Lesson, actions?: Action[]) => void;
  act: (action: Action) => void;
}
let lineId = 0;
export const useLab = create<LabState>()(temporal((set, get) => ({
  lessonId: '', seed: {}, repo: createRepository(), actions: [], lines: [],
  hydrate: (lesson, actions = []) => {
    useLab.temporal.getState().pause();
    set({ lessonId: lesson.id, seed: lesson.seed, repo: replayActions(lesson.seed, actions), actions, lines: [] });
    useLab.temporal.getState().clear(); useLab.temporal.getState().resume();
  },
  act: (action) => {
    const current = get();
    if(current.actions.length>=500 && action.type!=='reset') { set({lines:[...current.lines.slice(-199),{id:++lineId,output:'Action limit reached (500). Reset the exercise to start a fresh log. Server-confirmed progress stays saved.',error:true}]}); return; }
    const actions:Action[] = action.type==='reset'?[{type:'reset'}]:[...current.actions, action];
    if (action.type === 'undo' || action.type === 'redo' || action.type === 'reset') {
      const history = useLab.temporal.getState();
      if (action.type === 'undo' && history.pastStates.length) history.undo();
      if (action.type === 'redo' && history.futureStates.length) history.redo();
      history.pause();
      set({ repo: replayActions(current.seed, actions), actions, lines: [...current.lines, { id: ++lineId, output: action.type.toUpperCase() }] });
      if (action.type === 'reset') history.clear();
      history.resume(); return;
    }
    const result = applyAction(current.repo, action);
    set({ repo: result.state, actions, lines: action.type === 'command' || result.error || action.type === 'platform'
      ? [...current.lines.slice(-199), { id: ++lineId, command: action.type === 'command' ? action.command : undefined, output: result.output, error: result.error }]
      : current.lines });
  },
}), { partialize: ({ repo }) => ({ repo }), equality: (left, right) => JSON.stringify(left.repo) === JSON.stringify(right.repo), limit: 128 }));
