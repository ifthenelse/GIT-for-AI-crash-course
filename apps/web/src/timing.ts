import { useEffect, useRef, useState } from 'react';
import type { VisibilityLedger, VisibilityEvent } from '@gitcourse/contracts';

export function useStudyTiming(attemptId: string | undefined, previous?: VisibilityLedger, onChange?: (ledger: VisibilityLedger) => void) {
  const ledgerRef = useRef<VisibilityLedger>({ version: 1, coverage: 'complete', droppedEvents: 0, segments: [] });
  const clock = useRef(0);
  const [revision, setRevision] = useState(0);
  const changeRef = useRef(onChange); changeRef.current = onChange;
  useEffect(() => {
    const ledger: VisibilityLedger = previous ? structuredClone(previous) : { version: 1, coverage: 'complete', droppedEvents: 0, segments: [] };
    if (ledger.segments.length && ledger.coverage !== 'truncated') ledger.coverage = 'partial';
    const segment = { documentId: crypto.randomUUID(), events: [] as VisibilityEvent[] };
    ledger.segments.push(segment); ledgerRef.current = ledger; clock.current = performance.now();
    let lastSample = performance.now();
    const sample = (cause: string, persisted?: boolean) => {
      const now = performance.now();
      if (now - lastSample > 5 * 60_000 && ledger.coverage !== 'truncated') ledger.coverage = 'partial';
      lastSample = now;
      const event: VisibilityEvent = { sequence: segment.events.length, offsetMs: Math.max(0, Math.round((now - clock.current) / 100) * 100), cause, visibility: document.visibilityState === 'hidden' ? 'hidden' : 'visible', focused: document.hasFocus(), ...(persisted === undefined ? {} : { persisted }) };
      const last = segment.events.at(-1);
      if (last && last.focused === event.focused && last.visibility === event.visibility && !['start', 'finish', 'pagehide', 'pageshow'].includes(cause)) return;
      if (ledger.segments.reduce((sum, item) => sum + item.events.length, 0) >= 512) { ledger.droppedEvents++; ledger.coverage = 'truncated'; }
      else segment.events.push(event);
      changeRef.current?.(structuredClone(ledger)); setRevision((value) => value + 1);
    };
    const visibility = () => sample('visibilitychange');
    const blur = () => sample('blur'); const focus = () => sample('focus');
    const hide = (event: PageTransitionEvent) => sample('pagehide', event.persisted);
    const show = (event: PageTransitionEvent) => sample('pageshow', event.persisted);
    sample('start');
    document.addEventListener('visibilitychange', visibility); window.addEventListener('blur', blur); window.addEventListener('focus', focus);
    window.addEventListener('pagehide', hide); window.addEventListener('pageshow', show);
    const tick = window.setInterval(() => setRevision((value) => value + 1), 1000);
    return () => { sample('finish'); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('blur', blur); window.removeEventListener('focus', focus); window.removeEventListener('pagehide', hide); window.removeEventListener('pageshow', show); clearInterval(tick); };
    // A ledger segment belongs to one attempt and one document lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);
  const ledger = ledgerRef.current;
  let focusedMs = 0;
  for (let s = 0; s < ledger.segments.length; s++) {
    const events = ledger.segments[s].events;
    for (let i = 0; i < events.length; i++) {
      const event = events[i]; const next = events[i + 1];
      const end = next?.offsetMs ?? (s === ledger.segments.length - 1 ? performance.now() - clock.current : event.offsetMs);
      if (event.visibility === 'visible' && event.focused) focusedMs += Math.max(0, end - event.offsetMs);
    }
  }
  void revision;
  return { ledger: () => {
    const snapshot=structuredClone(ledgerRef.current);const current=snapshot.segments.at(-1);
    if(current&&current.events.length<512)current.events.push({sequence:current.events.length,offsetMs:Math.max(0,Math.round((performance.now()-clock.current)/100)*100),cause:'finish',visibility:document.visibilityState==='hidden'?'hidden':'visible',focused:document.hasFocus()});
    return snapshot;
  }, focusedMs, paused: document.visibilityState === 'hidden' || !document.hasFocus(), coverage: ledger.coverage };
}

export function duration(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000)); const minutes = Math.floor(seconds / 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
