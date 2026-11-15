import { useEffect, useRef, useState } from 'react';
/** Same-origin editing lease. No auth data is written; the server remains authoritative. */
export function useEditingLease(key: string) {
  const owner = useRef(crypto.randomUUID());
  const [owned, setOwned] = useState(true);
  const claimRef = useRef<() => void>(() => {});
  useEffect(() => {
    const storageKey = `gitcourse:editing:${key}`;
    let timer: number;
    let current = true;
    const read = () => {
      try {
        return JSON.parse(localStorage.getItem(storageKey) ?? 'null') as {
          owner: string;
          until: number;
        } | null;
      } catch {
        return null;
      }
    };
    const write = () => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          owner: owner.current,
          until: Date.now() + 15_000
        }));
      } catch {/* Unavailable preference storage does not disable practice. */}
    };
    const check = () => {
      const lease = read();
      current = !lease || lease.until < Date.now() || lease.owner === owner.current;
      setOwned(current);
      if (current) write();
    };
    const claim = () => {
      write();
      current = true;
      setOwned(true);
    };
    claimRef.current = claim;
    const changed = (event: StorageEvent) => {
      if (event.key === storageKey) check();
    };
    check();
    timer = window.setInterval(check, 5000);
    window.addEventListener('storage', changed);
    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', changed);
      try {
        if (read()?.owner === owner.current) localStorage.removeItem(storageKey);
      } catch {}
    };
  }, [key]);
  return {
    owned,
    takeover: () => claimRef.current()
  };
}
