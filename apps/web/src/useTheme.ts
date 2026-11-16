import {useEffect,useState} from 'react';
export type ThemePreference='light'|'dark'|'system';
export function useTheme(){
 const [preference,setPreference]=useState<ThemePreference>(()=>{try{const saved=localStorage.getItem('gitcourse:theme');return saved==='light'||saved==='dark'?saved:'system';}catch{return 'system';}});
 const [systemDark,setSystemDark]=useState(()=>matchMedia('(prefers-color-scheme: dark)').matches);
 useEffect(()=>{const media=matchMedia('(prefers-color-scheme: dark)');const update=()=>setSystemDark(media.matches);media.addEventListener('change',update);update();return()=>media.removeEventListener('change',update);},[]);
 const resolved=preference==='system'?(systemDark?'dark':'light'):preference;
 useEffect(()=>{document.documentElement.dataset.theme=resolved;try{localStorage.setItem('gitcourse:theme',preference);}catch{}},[resolved,preference]);
 return {preference,setPreference,resolved};
}
