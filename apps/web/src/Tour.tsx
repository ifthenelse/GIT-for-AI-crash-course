import {useEffect,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
let requested=false;
export function requestTour(){requested=true;window.dispatchEvent(new Event('gitcourse:tour'));}
function hasSeenTour(){try{return !!localStorage.getItem('gitcourse:tour-seen');}catch{return false;}}
const targets=['.lesson-introduction','.task-card','[data-testid="dock-terminal"]','[data-testid="dock-graph"]','[data-testid="dock-editor"]','[data-testid="dock-portal"]','.lesson-navigation'];
export function Tour({autoStart}:{autoStart:boolean}){
 const {t}=useTranslation();const [step,setStep]=useState<number|null>(null);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const start=()=>{requested=false;setStep(0);};if(requested||autoStart&&!hasSeenTour())start();window.addEventListener('gitcourse:tour',start);return()=>window.removeEventListener('gitcourse:tour',start);},[autoStart]);
 useEffect(()=>{if(step===null)return;const element=document.querySelector<HTMLElement>(targets[step]);element?.classList.add('tour-target');element?.scrollIntoView({behavior:'smooth',block:'center'});dialog.current?.showModal();return()=>element?.classList.remove('tour-target');},[step]);
 const close=()=>{try{localStorage.setItem('gitcourse:tour-seen','1');}catch{}dialog.current?.close();setStep(null);requestAnimationFrame(()=>document.getElementById('dock-terminal')?.focus());};
 if(step===null)return null;
 return <dialog ref={dialog} className="modal tour-dialog" aria-labelledby="tour-title" aria-describedby="tour-description" onCancel={e=>{e.preventDefault();close();}}><small>{step+1} / {targets.length}</small><h2 id="tour-title">{t(`tourTitle${step}`)}</h2><p id="tour-description">{t(`tourBody${step}`)}</p><div className="tour-actions"><button onClick={close}>{t('tourSkip')}</button>{step>0&&<button onClick={()=>setStep(step-1)}>{t('back')}</button>}<button className="button" onClick={()=>step===targets.length-1?close():setStep(step+1)}>{t(step===targets.length-1?'tourFinish':'tourNext')}</button></div></dialog>;
}
