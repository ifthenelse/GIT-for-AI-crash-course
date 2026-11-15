import { baseLessons } from './base.ts';
import { intermediateLessons } from './intermediate.ts';
import { advancedLessons } from './advanced.ts';
import type { Lesson, Tier } from '../../contracts/src/index.ts';
export const lessons: Lesson[] = [...baseLessons, ...intermediateLessons, ...advancedLessons];
export const tiers: Tier[] = ['base', 'intermediate', 'advanced'];
export const getLesson = (id: string) => lessons.find(lesson => lesson.id === id);

export {referenceLabel} from './reference-labels.ts';
