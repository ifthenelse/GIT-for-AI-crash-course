import { describe, expect, it } from 'vitest';
import { lessons, tiers } from './index.ts';
import { applyAction, createRepository, evaluateObjectives, replayActions } from '../../git-engine/src/index.ts';

describe('bilingual, solvable course catalog',()=>{
 it('contains36unique modules,12in each ordered tier',()=>{expect(lessons).toHaveLength(36);expect(new Set(lessons.map(l=>l.id)).size).toBe(36);for(const tier of tiers)expect(lessons.filter(l=>l.tier===tier).map(l=>l.order)).toEqual(Array.from({length:12},(_,i)=>i+1));});
 for(const lesson of lessons){it(`${lesson.id}: substantive IT/EN, unfulfilled initial objective, executable solution and replay`,()=>{
   for(const locale of ['it','en'] as const){expect(lesson.title[locale].length).toBeGreaterThan(8);expect(lesson.summary[locale].length).toBeGreaterThan(20);expect(lesson.task[locale].length).toBeGreaterThan(30);for(const c of lesson.concepts){expect(c.title[locale]).toBeTruthy();expect(c.body[locale].length).toBeGreaterThan(100);}for(const hint of lesson.hints)expect(hint[locale]).toBeTruthy();if(lesson.quiz)for(const choice of lesson.quiz.choices)expect(choice.label[locale]).toBeTruthy();}
   expect(lesson.reference.length).toBeGreaterThan(0);expect(lesson.concepts.length).toBeGreaterThanOrEqual(2);
   let state=createRepository(lesson.seed);const untouched=structuredClone(state);expect(evaluateObjectives(state,lesson.objectives).every(o=>o.passed)).toBe(false);
   for(const action of lesson.solution){const previous=structuredClone(state);const result=applyAction(state,action);expect(result.error,result.output).not.toBe(true);expect(state).toEqual(previous);state=result.state;}
   expect(evaluateObjectives(state,lesson.objectives).filter(o=>!o.passed)).toEqual([]);expect(replayActions(lesson.seed,lesson.solution)).toEqual(state);expect(createRepository(lesson.seed)).toEqual(untouched);
 });}
});
