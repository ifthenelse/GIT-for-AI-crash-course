import { useEffect, useRef } from 'react';
export const IDLE_MS = 120_000;
export class PracticeClock {
  elapsedMs = 0;
  lastActivity = 0;
  sampledAt = 0;
  running = false;
  restore(elapsedMs = 0) { this.elapsedMs = Math.max(0, elapsedMs); this.running = false; }
  sample(now: number) {
    if (this.running) this.elapsedMs += Math.max(0, Math.min(now, this.lastActivity + IDLE_MS) - this.sampledAt);
    this.sampledAt = now;
    return Math.round(this.elapsedMs);
  }
  activity(now: number) { this.sample(now); this.lastActivity = now; this.sampledAt = now; this.running = true; }
  stop(now: number) { this.sample(now); this.running = false; }
}
/** Local active time is an estimate, never a replacement for server elapsed time. */
export function usePracticeTiming(enabled: boolean) {
  const clock = useRef(new PracticeClock());
  useEffect(() => {
    if (!enabled) return;
    const activity = () => clock.current.activity(performance.now());
    const visibility = () => { if (document.visibilityState === 'visible') activity(); };
    activity();
    const events = ['pointerdown', 'pointermove', 'keydown', 'input', 'scroll', 'focus'] as const;
    events.forEach(name => window.addEventListener(name, activity, { passive: true }));
    document.addEventListener('visibilitychange', visibility);
    return () => { clock.current.stop(performance.now()); events.forEach(name => window.removeEventListener(name, activity)); document.removeEventListener('visibilitychange', visibility); };
  }, [enabled]);
  return clock;
}
