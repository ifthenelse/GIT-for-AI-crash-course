import {expect,it} from 'vitest';
import {canOpenLesson,completePractice} from './courseProgress';
import {COURSE_VERSION,type Progress} from '@gitcourse/contracts';
const initial:Progress={courseVersion:COURSE_VERSION,completedLessons:[],results:[],completions:[],unlockedTiers:['base']};
it('unlocks only the next lesson and retains practice completions on repetition',()=>{
 expect(canOpenLesson('B01',initial)).toBe(true);expect(canOpenLesson('B02',initial)).toBe(false);
 const next=completePractice(initial,'B01',1500);expect(canOpenLesson('B02',next)).toBe(true);expect(canOpenLesson('B03',next)).toBe(false);expect(next.unlockedTiers).toEqual(['base']);expect(next.results[0].score).toBe(0);expect(completePractice(next,'B01',3000)).toBe(next);expect(initial.completedLessons).toEqual([]);
});
