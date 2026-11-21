import { useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from './icons';

export type WindowId = 'terminal' | 'graph' | 'editor' | 'portal';
const ids: WindowId[] = ['terminal', 'graph', 'editor', 'portal'];
interface Rect { x: number; y: number; w: number; h: number; z: number; minimized: boolean; maximized: boolean; }
type Layout = Record<WindowId, Rect>;
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
function safeRect(rect: Rect): Rect {
  const w = clamp(Number.isFinite(rect.w) ? rect.w : .6, .24, 1);
  const h = clamp(Number.isFinite(rect.h) ? rect.h : .6, .25, 1);
  return { x: clamp(Number.isFinite(rect.x) ? rect.x : 0, 0, 1 - w), y: clamp(Number.isFinite(rect.y) ? rect.y : 0, 0, 1 - h), w, h, z: clamp(Number.isFinite(rect.z) ? rect.z : 1, 1, 10000), minimized: rect.minimized === true, maximized: rect.maximized === true };
}
function defaultLayout(width: number, preset = 'grid'): Layout {
  return Object.fromEntries(ids.map((id, index) => {
    const cascade = width < 720 || preset === 'cascade';
    const rect = cascade ? { x: index * .025, y: index * .045, w: .91, h: .79 }
      : preset === 'split' && width > 1200 ? { x: index * .25, y: 0, w: .24, h: 1 }
        : { x: index % 2 * .51, y: Math.floor(index / 2) * .51, w: .49, h: .49 };
    return [id, { ...rect, z: index + 1, minimized: false, maximized: false }];
  })) as Layout;
}
export function WindowManager({ userId, children }: { userId: string; children: Record<WindowId, ReactNode> }) {
  const { t } = useTranslation(); const area = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1200, height: 700 });
  const [layout, setLayout] = useState<Layout>(() => defaultLayout(window.innerWidth));
  const [menu, setMenu] = useState<WindowId | null>(null); const [mode, setMode] = useState<{ id: WindowId; type: 'move' | 'resize'; original: Rect } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [overview, setOverview] = useState(false); const [announcement, setAnnouncement] = useState('');
  const dialog = useRef<HTMLDialogElement>(null); const lastFocus = useRef<Partial<Record<WindowId, HTMLElement>>>({});
  const drag = useRef<{ id: WindowId; type: 'move' | 'resize'; x: number; y: number; rect: Rect } | null>(null);
  const breakpoint = size.width < 720 ? 'small' : size.width < 1100 ? 'medium' : 'large';
  const key = `gitcourse:layout:v1:${userId}:${breakpoint}`;
  const [loadedKey, setLoadedKey] = useState('');
  useEffect(() => {
    const element = area.current; if (!element) return;
    const observer = new ResizeObserver(([entry]) => { setSize({ width: entry.contentRect.width, height: entry.contentRect.height }); }); observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let next = defaultLayout(area.current?.clientWidth ?? window.innerWidth);
    try {
      const raw = localStorage.getItem(key);
      if (raw) { const saved = JSON.parse(raw) as { version?: number; windows?: Partial<Layout> }; if (saved.version === 1 && saved.windows && ids.every((id) => saved.windows?.[id])) next = Object.fromEntries(ids.map((id) => [id, safeRect(saved.windows![id]!)])) as Layout; }
    } catch { /* A corrupt or unavailable preference never hides a window. */ }
    setLayout(next); setLoadedKey(key);
  }, [key]);
  useEffect(() => { if (loadedKey === key) { try { localStorage.setItem(key, JSON.stringify({ version: 1, windows: layout })); } catch { /* Layout storage is optional. */ } } }, [key, layout, loadedKey]);
  useEffect(() => { if (overview) dialog.current?.showModal(); else if (dialog.current?.open) dialog.current.close(); }, [overview]);
  const update = (id: WindowId, patch: Partial<Rect>) => setLayout((current) => ({ ...current, [id]: safeRect({ ...current[id], ...patch }) }));
  const activate = (id: WindowId) => setLayout((current) => {
    const max = Math.max(...ids.map((item) => current[item].z));
    if (current[id].z === max && !current[id].minimized) return current;
    return Object.fromEntries(ids.map((item) => [item, { ...current[item], ...(item === id ? { z: Math.min(max + 1, 10000), minimized: false } : {}) }])) as Layout;
  });
  const restore = (id: WindowId) => {
    setLayout((current) => {
      const max = Math.max(...ids.map((item) => current[item].z));
      return Object.fromEntries(ids.map((item) => [item, { ...current[item], maximized: false, ...(item === id ? { z: max + 1, minimized: false } : {}) }])) as Layout;
    });
    setOverview(false); requestAnimationFrame(() => { const focused = lastFocus.current[id]; if (focused?.isConnected && focused.closest('section')?.hidden === false) focused.focus(); else document.getElementById(`titlebar-${id}`)?.focus(); });
  };
  const minimize = (id: WindowId) => { update(id, { minimized: true, maximized: false }); setMenu(null); requestAnimationFrame(() => document.getElementById(`dock-${id}`)?.focus()); };
  const maximize = (id: WindowId) => { update(id, { maximized: !layout[id].maximized, minimized: false }); activate(id); setMenu(null); };
  const preset = (name: string) => { setLayout(defaultLayout(size.width, name)); setMenu(null); setAnnouncement(t('moved')); };
  const startDrag = (event: ReactPointerEvent<HTMLElement>, id: WindowId, type: 'move' | 'resize') => {
    if (event.button !== 0 || layout[id].maximized || (type === 'move' && (event.target as HTMLElement).closest('button,input'))) return;
    setDragging(true); activate(id); drag.current = { id, type, x: event.clientX, y: event.clientY, rect: layout[id] }; event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const current = drag.current; if (!current) return;
    const dx = (event.clientX - current.x) / size.width; const dy = (event.clientY - current.y) / size.height;
    update(current.id, current.type === 'move' ? { x: clamp(current.rect.x + dx, 0, 1 - current.rect.w), y: clamp(current.rect.y + dy, 0, 1 - current.rect.h) }
      : { w: clamp(current.rect.w + dx, Math.min(280 / size.width, 1), 1 - current.rect.x), h: clamp(current.rect.h + dy, .28, 1 - current.rect.y) });
  };
  const moveKeys = (event: KeyboardEvent<HTMLElement>, id: WindowId) => {
    if (mode?.id !== id || mode.type !== 'move') return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault(); const step = event.shiftKey ? 32 : 8; const rect = layout[id];
      update(id, { x: clamp(rect.x + (event.key === 'ArrowLeft' ? -step / size.width : event.key === 'ArrowRight' ? step / size.width : 0), 0, 1 - rect.w), y: clamp(rect.y + (event.key === 'ArrowUp' ? -step / size.height : event.key === 'ArrowDown' ? step / size.height : 0), 0, 1 - rect.h) });
    } else if (event.key === 'Enter') { event.preventDefault(); setMode(null); setAnnouncement(t('moved')); }
    else if (event.key === 'Escape') { update(id, mode.original); setMode(null); }
  };
  const maximized = ids.find((id) => layout[id].maximized && !layout[id].minimized);
  const active = ids.filter(id => !layout[id].minimized).reduce<WindowId | undefined>((best, id) => !best || layout[id].z > layout[best].z ? id : best, undefined);
  return <div className={`window-manager ${dragging ? 'is-dragging' : ''}`}>
    <div className="workspace-controls">
      <span className="workspace-caption"><span className="live-dot" />{t('sharedView')}</span>
      <div className="layout-actions"><span className="small-label">{t('arrange')}</span>
        <button className="icon-button" title={t('grid')} aria-label={t('grid')} onClick={() => preset('grid')}><Icon name="grid" /></button>
        <button className="icon-button" title={t('cascade')} aria-label={t('cascade')} onClick={() => preset('cascade')}><Icon name="layers" /></button>
        <button className="icon-button" data-testid="layout-reset" title={t('resetLayout')} aria-label={t('resetLayout')} onClick={() => preset('grid')}><Icon name="reset" /></button>
        <button className="button button-subtle button-small" onClick={() => setOverview(true)}><Icon name="menu" size={16} />{t('overview')}</button>
      </div>
    </div>
    <div className="desktop-area" ref={area} aria-label={t('learningWorkspace')}>
      {ids.map((id) => {
        const rect = layout[id]; const hidden = rect.minimized || !!maximized && maximized !== id;
        return <section key={id} className={`sim-window ${id}-window ${active === id ? 'is-active' : 'is-background'} ${rect.maximized ? 'is-maximized' : ''} ${mode?.id === id ? 'is-moving' : ''}`} hidden={hidden}
          style={{ left: `${rect.maximized ? 0 : rect.x * 100}%`, top: `${rect.maximized ? 0 : rect.y * 100}%`, width: `${rect.maximized ? 100 : rect.w * 100}%`, height: `${rect.maximized ? 100 : rect.h * 100}%`, zIndex: rect.z }}
          aria-labelledby={`window-title-${id}`} data-testid={`${id}-window`} onPointerDown={() => activate(id)} onFocusCapture={(event) => { lastFocus.current[id] = event.target as HTMLElement; activate(id); }}>
          <header className="window-titlebar" id={`titlebar-${id}`} tabIndex={0} onKeyDown={(event) => moveKeys(event, id)}
            onPointerDown={(event) => startDrag(event, id, 'move')} onPointerMove={pointerMove} onPointerUp={() => { drag.current = null; setDragging(false); }} onPointerCancel={() => { drag.current = null; setDragging(false); }}>
            <span className={`window-app-icon ${id}`}><Icon name={id} size={15} /></span><h2 id={`window-title-${id}`}>{t(id)}</h2>
            {id === 'terminal' && <span className="window-subtitle">bash</span>}
            <div className="window-chrome">
              <button className="window-chrome-button" data-testid={`window-menu-${id}`} aria-label={t('windowMenu', { window: t(id) })} aria-expanded={menu === id} onClick={() => setMenu(menu === id ? null : id)}><Icon name="dots" size={16} /></button>
              <button className="window-chrome-button" data-testid={`minimize-${id}`} aria-label={t('minimize', { window: t(id) })} onClick={() => minimize(id)}><Icon name="minimize" size={15} /></button>
              <button className="window-chrome-button" data-testid={`maximize-${id}`} aria-label={t(rect.maximized ? 'restore' : 'maximize', { window: t(id) })} onClick={() => maximize(id)}><Icon name={rect.maximized ? 'restore' : 'maximize'} size={13} /></button>
            </div>
          </header>
          {menu === id && <div className="window-options" aria-label={t('windowMenu', { window: t(id) })}>
            <button onClick={() => { setMode({ id, type: 'move', original: rect }); setMenu(null); setAnnouncement(t('moveHelp')); requestAnimationFrame(() => document.getElementById(`titlebar-${id}`)?.focus()); }}>{t('move')}</button>
            <button onClick={() => { setMode({ id, type: 'resize', original: rect }); setMenu(null); requestAnimationFrame(()=>document.querySelector<HTMLInputElement>('.resize-controls input')?.focus()); }}>{t('resize')}</button>
            <button onClick={() => maximize(id)}>{t(rect.maximized ? 'restore' : 'maximize', { window: t(id) })}</button>
            <button onClick={() => minimize(id)}>{t('minimize', { window: t(id) })}</button>
          </div>}
          {mode?.id === id && mode.type === 'resize' && <div className="resize-controls"><p>{t('resizeHelp')}</p>
            <label>{t('width')}<input type="number" min={Math.min(240, size.width)} max={Math.floor(size.width)} value={Math.round(rect.w * size.width)} onChange={(event) => update(id, { w: clamp(Number(event.target.value) / size.width, Math.min(240 / size.width, 1), 1 - rect.x) })} /></label>
            <label>{t('height')}<input type="number" min={180} max={Math.floor(size.height)} value={Math.round(rect.h * size.height)} onChange={(event) => update(id, { h: clamp(Number(event.target.value) / size.height, .25, 1 - rect.y) })} /></label>
            <button className="button button-small" onClick={() => setMode(null)}>{t('apply')}</button><button className="button button-subtle button-small" onClick={() => { update(id, mode.original); setMode(null); }}>{t('cancel')}</button>
          </div>}
          <div className="window-content">{children[id]}</div>
          {!rect.maximized && <button className="resize-handle" tabIndex={-1} aria-label={t('resize')} onPointerDown={(event) => startDrag(event, id, 'resize')} onPointerMove={pointerMove} onPointerUp={() => { drag.current = null; setDragging(false); }} onPointerCancel={() => { drag.current = null; setDragging(false); }} />}
        </section>;
      })}
    </div>
    <nav className="window-dock" aria-label={t('arrange')}>
      {ids.map((id) => <button key={id} id={`dock-${id}`} data-testid={`dock-${id}`} className={`dock-item ${!layout[id].minimized ? 'is-open' : ''}`} onClick={() => restore(id)} aria-label={`${t('restore', { window: t(id) })}${layout[id].minimized ? ` · ${t('minimized')}` : ''}`}><Icon name={id} size={18} /><span>{t(id)}</span><i /></button>)}
    </nav>
    <span className="sr-only" aria-live="polite">{announcement}</span>
    <dialog aria-labelledby="overview-title" ref={dialog} onCancel={() => setOverview(false)} className="modal overview-modal"><div className="modal-heading"><h2 id="overview-title">{t('overview')}</h2><button className="icon-button" aria-label={t('close')} onClick={() => setOverview(false)}><Icon name="close" /></button></div>
      <div className="overview-grid">{ids.map((id) => <button key={id} onClick={() => restore(id)}><Icon name={id} size={30} /><strong>{t(id)}</strong><span>{t(layout[id].minimized ? 'minimized' : 'activeWindow')}</span></button>)}</div>
      <p className="help-text">{t('layoutSaved')}</p><button className="button button-subtle" onClick={() => { preset('grid'); setOverview(false); }}>{t('resetLayout')}</button>
    </dialog>
  </div>;
}
