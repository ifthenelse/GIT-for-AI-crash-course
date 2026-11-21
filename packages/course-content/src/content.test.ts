import { describe, expect, it } from 'vitest';
import { getLesson, lessons, tiers } from './index.ts';
import { applyAction, createRepository, evaluateObjectives, executeCommand, getHeadCommit, replayActions } from '../../git-engine/src/index.ts';

describe('bilingual, solvable course catalog',()=>{
 it('contains36unique modules,12in each ordered tier',()=>{expect(lessons).toHaveLength(36);expect(new Set(lessons.map(l=>l.id)).size).toBe(36);for(const tier of tiers)expect(lessons.filter(l=>l.tier===tier).map(l=>l.order)).toEqual(Array.from({length:12},(_,i)=>i+1));});
 for(const lesson of lessons){it(`${lesson.id}: substantive IT/EN, unfulfilled initial objective, executable solution and replay`,()=>{
   for(const locale of ['it','en'] as const){expect(lesson.title[locale].length).toBeGreaterThan(8);expect(lesson.summary[locale].length).toBeGreaterThan(20);expect(lesson.task[locale].length).toBeGreaterThan(30);for(const c of lesson.concepts){expect(c.title[locale]).toBeTruthy();expect(c.body[locale].length).toBeGreaterThan(100);}for(const hint of lesson.hints)expect(hint[locale]).toBeTruthy();}
   expect(lesson.reference.length).toBeGreaterThan(0);expect(lesson.concepts.length).toBeGreaterThanOrEqual(2);
   let state=createRepository(lesson.seed);const untouched=structuredClone(state);expect(evaluateObjectives(state,lesson.objectives).every(o=>o.passed)).toBe(false);
   for(const action of lesson.solution){const previous=structuredClone(state);const result=applyAction(state,action);expect(result.error,result.output).not.toBe(true);expect(state).toEqual(previous);state=result.state;}
   expect(evaluateObjectives(state,lesson.objectives).filter(o=>!o.passed)).toEqual([]);expect(replayActions(lesson.seed,lesson.solution)).toEqual(state);expect(createRepository(lesson.seed)).toEqual(untouched);
 });}

 it('contains practical tasks without quiz data or answer goals/actions', () => {
   for (const lesson of lessons) {
     expect(lesson).not.toHaveProperty('quiz');
     for (const objective of lesson.objectives) expect(objective).not.toHaveProperty('questionId');
     for (const action of lesson.solution) expect(action).not.toHaveProperty('questionId');
     expect(lesson.solution.some(action => ['command', 'edit', 'platform'].includes(action.type))).toBe(true);
     for (const locale of ['it', 'en'] as const) {
       expect(lesson.task[locale]).not.toMatch(/rispondi|scegli la descrizione|answer the|choose the correct/i);
     }
   }
 });
 it('B01 separates a recorded snapshot from later working edits', () => {
   const lesson = getLesson('B01')!;
   const beforeWorkingEdit = replayActions(lesson.seed, lesson.solution.slice(0, -1));
   expect(evaluateObjectives(beforeWorkingEdit, lesson.objectives).every(result => result.passed)).toBe(false);
   const completed = replayActions(lesson.seed, lesson.solution);
   expect(getHeadCommit(completed)?.tree['catalog.json']).toBe('{"items":["tea","coffee"]}\n');
   expect(completed.files['catalog.json']).toBe('{"items":["tea","coffee","draft"]}\n');
   expect(completed.index['catalog.json']).toBe(getHeadCommit(completed)?.tree['catalog.json']);
 });
 it.each([
   'sudo apt install git',
   'sudo dnf install git',
   'winget install --id Git.Git -e --source winget',
   'brew install git',
   'xcode-select --install',
   'sudo port install git',
 ])('B02 accepts supported installation alternative: %s', command => {
   const lesson = getLesson('B02')!;
   const result = executeCommand(createRepository(lesson.seed), command);
   expect(result.error, result.output).not.toBe(true);
   expect(evaluateObjectives(result.state, lesson.objectives).every(objective => objective.passed)).toBe(true);
 });
 it('B01 accepts equivalent readable JSON without requiring compact formatting or a final newline', () => {
   const lesson = getLesson('B01')!;
   const formatted = replayActions(lesson.seed, [...lesson.solution.slice(0, -1), {
     type: 'edit', path: 'catalog.json', content: JSON.stringify({ items: ['tea', 'coffee', 'draft'] }, null, 2),
   }]);
   expect(evaluateObjectives(formatted, lesson.objectives).every(result => result.passed)).toBe(true);
 });
 it('B05 requires key generation in addition to an SSH configuration', () => {
   const lesson = getLesson('B05')!;
   const configurationOnly = replayActions(lesson.seed, lesson.solution.filter(action => action.type === 'edit'));
   expect(evaluateObjectives(configurationOnly, lesson.objectives).every(result => result.passed)).toBe(false);
 });
 it.each(['M09', 'A11'])('%s requires a reviewed practical change rather than policy selection alone', id => {
   const lesson = getLesson(id)!;
   const partial = replayActions(lesson.seed, lesson.solution.filter(action => action.type === 'platform' && ['switch-provider', 'enable-policy'].includes(action.operation)));
   expect(evaluateObjectives(partial, lesson.objectives).every(result => result.passed)).toBe(false);
   const completed = replayActions(lesson.seed, lesson.solution);
   expect(completed.platform.pullRequests.some(request => request.approved && request.merged)).toBe(true);
   expect(getHeadCommit(completed)?.tree['README.md']).toContain(id === 'M09' ? 'Small catalog change reviewed' : 'Hotfix reviewed');
 });
});

it('provides bilingual location-specific steps and expected results for every exercise', () => {
  for (const item of lessons) for (const locale of ['it', 'en'] as const) {
    expect(item.task[locale]).toContain(locale === 'it' ? 'Passi nel laboratorio:' : 'Steps in the laboratory:');
    expect(item.task[locale]).toContain(locale === 'it' ? 'Risultato atteso:' : 'Expected result:');
    expect(item.task[locale]).toContain('1. ');
    for (const action of item.solution) if (action.type === 'command') expect(item.task[locale]).toContain(`\n${action.command}\n`);
  }
});
