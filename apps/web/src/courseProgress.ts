import {lessons,tiers} from '@gitcourse/content';
import {COURSE_VERSION,type Progress} from '@gitcourse/contracts';
export function canOpenLesson(id:string,progress:Progress){const index=lessons.findIndex(l=>l.id===id);return index>=0&&(progress.completedLessons.includes(id)||lessons.slice(0,index).every(l=>progress.completedLessons.includes(l.id)));}
export function completePractice(progress:Progress,id:string,elapsedMs:number):Progress{
 if(progress.completedLessons.includes(id))return progress;
 const completedLessons=[...progress.completedLessons,id];
 return {...progress,completedLessons,results:[...progress.results,{lessonId:id,score:0,elapsedMs,completedAt:new Date().toISOString()}],unlockedTiers:tiers.filter((_,index)=>index===0||lessons.filter(l=>tiers.indexOf(l.tier)<index).every(l=>completedLessons.includes(l.id)))};
}
export function loadPractice(fallback:Progress):Progress{try{const data=JSON.parse(localStorage.getItem('gitcourse:practice-progress')??'null');if(data?.courseVersion===COURSE_VERSION&&Array.isArray(data.completedLessons)&&Array.isArray(data.results)&&Array.isArray(data.completions)&&Array.isArray(data.unlockedTiers)&&data.completedLessons.every((id:unknown)=>typeof id==='string'&&lessons.some(l=>l.id===id)))return data;}catch{}return fallback;}
