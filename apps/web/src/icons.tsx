import type { CSSProperties } from 'react';

const paths: Record<string, string> = {
  arrow: 'M5 12h14m-6-6 6 6-6 6', chevron: 'm9 5 7 7-7 7', check: 'm5 12 4 4L19 6',
  branch: 'M7 3v12a4 4 0 0 0 4 4h3M7 8h6a4 4 0 0 0 4-4', code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16',
  terminal: 'm5 6 6 6-6 6m8 0h6', graph: 'M6 5v14m0-9h8a4 4 0 0 0 4-4',
  editor: 'M5 3h10l4 4v14H5zm9 0v5h5M8 12h8m-8 4h5', portal: 'M3 4h18v16H3zm0 5h18M7 6.5h.01M10 6.5h.01',
  lock: 'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5zm7 4v3', sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M20 15a8 8 0 0 1-11-11 9 9 0 1 0 11 11', globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18',
  book: 'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3zm9 2v16', trophy: 'M7 3h10v5a5 5 0 0 1-10 0zm0 2H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4m-5 1v7m-5 1h10',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0m-9-5v5l3 2', play: 'm8 4 12 8-12 8z',
  undo: 'M8 4 3 9l5 5M3 9h10a7 7 0 0 1 7 7', redo: 'm16 4 5 5-5 5m5-5H11a7 7 0 0 0-7 7',
  reset: 'M3 11a9 9 0 1 1 2 7M3 4v7h7', minimize: 'M5 17h14', maximize: 'M4 4h16v16H4z',
  restore: 'M8 8h12v12H8zM4 16V4h12', menu: 'M5 6h14M5 12h14M5 18h14', dots: 'M5 12h.01M12 12h.01M19 12h.01', close: 'm6 6 12 12M18 6 6 18',
  grid: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z', layers: 'm12 3 10 6-10 6L2 9zm-9 11 9 6 9-6m-18 5 9 5 9-5',
  hint: 'M9 18h6m-6 3h6M9 15c0-3-4-3-4-7a7 7 0 0 1 14 0c0 4-4 4-4 7', info: 'M12 11v6m0-10v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-3a8 8 0 0 1 16 0v3', external: 'M14 3h7v7m0-7L10 14M9 3H3v18h18v-6',
  sync: 'M3 11a9 9 0 0 1 15-7l3 3M21 1v6h-6m6 6A9 9 0 0 1 6 20l-3-3m0 6v-6h6', folder: 'M3 5h6l2 3h10v12H3z',
};
export function Icon({ name, size = 20, className = '', style }: { name: string; size?: number; className?: string; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className} style={style}><path d={paths[name] ?? paths.code} /></svg>;
}
