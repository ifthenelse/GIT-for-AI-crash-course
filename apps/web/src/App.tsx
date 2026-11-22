import { lazy, Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { lessons, tiers, getLesson } from '@gitcourse/content';
import { COURSE_VERSION, type Leaderboard, type Locale, type Progress, type PublicConfig, type Session, type Tier } from '@gitcourse/contracts';
import { ApiError, beginOAuth, exchangeOAuth, request } from './api';
import { duration } from './timing';
import { Icon } from './icons';
import {useTheme,type ThemePreference} from './useTheme';
import {requestTour} from './Tour';
import {canOpenLesson,loadPractice} from './courseProgress';
import { getPublicMetadata, publicKinds, publicOrigin, type PublicKind } from './publicMetadata';
const Lab = lazy(() => import('./Lab'));
const emptyProgress: Progress = {
  courseVersion: COURSE_VERSION,
  completedLessons: [],
  results: [],
  completions: [],
  unlockedTiers: ['base']
};
function navigatePublic(path:string){history.pushState(history.state,'',path);window.dispatchEvent(new PopStateEvent('popstate'));}
const publicPath=(locale:Locale,path='')=>`${import.meta.env.BASE_URL}${locale}/${path}`;
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const initialRoute = () => {
  if (location.hash) return location.hash.slice(1);
  const suffix = location.pathname.slice(import.meta.env.BASE_URL.length).replace(/^(it|en)\/?/, '');
  if (!publicKinds.includes(suffix as PublicKind)) return '/not-found';
  return suffix ? '/course' : '/';
};
function useRoute() {
  const [, setLocationKey] = useState(()=>location.href);
  useEffect(() => {
    const update = () => {
      setLocationKey(location.href);
      window.scrollTo({
        top: 0
      });
    };
    window.addEventListener('hashchange', update);window.addEventListener('popstate',update);
    return () => {window.removeEventListener('hashchange',update);window.removeEventListener('popstate',update);};
  }, []);
  return initialRoute();
}
export function App() {
  const {
    t,
    i18n
  } = useTranslation();
  const locale = i18n.language as Locale;
  const route = useRoute();
  const pagePath = location.pathname;
  const [session, setSession] = useState<Session | null>(null);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [config, setConfig] = useState<PublicConfig>();
  const [login, setLogin] = useState(false);
  const [profile, setProfile] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const {preference,setPreference,resolved:theme}=useTheme();
  useEffect(()=>{if(!session)setProgress(loadPractice(emptyProgress));},[session]);
  const updateProgress=useCallback((next:Progress)=>{setProgress(next);if(!session){try{localStorage.setItem('gitcourse:practice-progress',JSON.stringify(next));}catch{}}},[session]);
  const acceptSession = useCallback(async (s: Session) => {
    const verifiedProgress=await request<Progress>('/v1/me/progress',s.token);
    setProgress(verifiedProgress);
    setSession(s);
    setLogin(false);
  }, []);
  useEffect(() => {
    void request<PublicConfig>('/v1/config').then(setConfig).catch(() => setError(t('requestFailed')));
    void exchangeOAuth().then(s => s && acceptSession(s)).catch(() => setError(t('authFailed')));
  }, [acceptSession, t]);
  const signIn = async () => {
    setBusy(true);
    setError('');
    try {
      await acceptSession(await request<Session>('/auth/development', undefined, {}));
    } catch {
      setError(t('requestFailed'));
    } finally {
      setBusy(false);
    }
  };
  const logout = async () => {
    if (session) await request('/auth/logout', session.token, {}).catch(() => {});
    setSession(null);
    setProgress(emptyProgress);
    setProfile(false);
  };
  const lesson = route.startsWith('/lesson/') ? getLesson(route.split('/')[2]) : undefined;
  const locked = lesson && !canOpenLesson(lesson.id,progress);
  useEffect(() => {
    const suffix = location.pathname.replace(import.meta.env.BASE_URL, '').replace(/^(it|en)\/?/, '');
    const kind: PublicKind = publicKinds.includes(suffix as PublicKind) ? suffix as PublicKind : '';
    const metadata = getPublicMetadata(locale, kind);
    document.title = lesson ? `${lesson.title[locale]} · Git by doing` : route === '/not-found' ? '404 · Git by doing' : route === '/leaderboard' ? `${t('leaderboard')} · Git by doing` : metadata.title;
    const existing = document.querySelector<HTMLLinkElement>('link[rel=canonical]');
    const site = existing ? new URL(import.meta.env.BASE_URL, existing.href).href : publicOrigin;
    const url = new URL(`${locale}/${kind}`, site).href;
    const setMeta = (key: string, value: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element); }
      element.content = value;
    };
    const setLink = (rel: string, href: string, language?: string) => {
      let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]${language ? `[hreflang="${language}"]` : ''}`);
      if (!element) { element = document.createElement('link'); element.rel = rel; if (language) element.hreflang = language; document.head.append(element); }
      element.href = href;
    };
    setLink('canonical', url);
    for (const language of ['it', 'en', 'x-default']) setLink('alternate', new URL(`${language === 'x-default' ? 'it' : language}/${kind}`, site).href, language);
    setMeta('description', metadata.description);
    setMeta('og:title', document.title, true); setMeta('og:description', metadata.description, true);
    setMeta('og:url', url, true); setMeta('og:site_name', 'Git by doing', true);
    setMeta('og:locale', locale === 'it' ? 'it_IT' : 'en_US', true);
    setMeta('og:locale:alternate', locale === 'it' ? 'en_US' : 'it_IT', true);
    const image = new URL(locale === 'it' ? 'social-it.png' : 'social.png', site).href;
    setMeta('og:image', image, true); setMeta('twitter:image', image);
    setMeta('twitter:title', document.title); setMeta('twitter:description', metadata.description);
    setMeta('robots', lesson || route === '/not-found' || route === '/leaderboard' || ['localhost', '127.0.0.1'].includes(location.hostname) || location.pathname.endsWith('/404.html') ? 'noindex,follow' : 'index,follow');
    let schema = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
    if (!schema) { schema = document.createElement('script'); schema.type = 'application/ld+json'; document.head.append(schema); }
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Course', name: metadata.title, description: metadata.description, inLanguage: locale, url, provider: { '@type': 'Organization', name: 'Git by doing', url: site } });
  }, [lesson, locale, route, t, pagePath]);
  return <>
<a className="skip-link" href="#main" onClick={e => {
      e.preventDefault();
      document.getElementById('main')?.focus();
    }}>{locale === 'it' ? 'Vai al contenuto' : 'Skip to content'}</a>
<header className="site-header">
<a className="brand" href={publicPath(locale)} onClick={e=>{e.preventDefault();navigatePublic(publicPath(locale));}}>
<img src={asset(theme === 'dark' ? 'logo-dark.svg' : 'logo.svg')} width="34" height="34" alt="" />
<span>Git by <span className="brand-doing">doing</span></span>
</a>
<nav className="main-nav" aria-label={locale === 'it' ? 'Navigazione principale' : 'Main navigation'}>
<a href={publicPath(locale,'program/')} onClick={e=>{e.preventDefault();navigatePublic(publicPath(locale,'program/'));}} className={route === '/course' ? 'active' : ''}>{t('course')}</a>
<a href="#/leaderboard" data-testid="nav-leaderboard" className={route === '/leaderboard' ? 'active' : ''}>{t('leaderboard')}</a>
</nav>
<div className="header-actions">
<label className="language-control">
<Icon name="globe" size={16} />
<span className="sr-only">{t('language')}</span>
<select data-testid="language-select" value={locale} onChange={e => void i18n.changeLanguage(e.target.value)}>
<option value="it">IT</option>
<option value="en">EN</option>
</select>
</label>
<label className="theme-control"><span className="sr-only">{t('theme')}</span><select data-testid="theme-select" value={preference} onChange={e=>setPreference(e.target.value as ThemePreference)}><option value="light">{t('themeLight')}</option><option value="dark">{t('themeDark')}</option><option value="system">{t('themeSystem')}</option></select></label>
<button className="button button-subtle button-small" onClick={()=>{requestTour();if(!lesson)location.hash='/lesson/B01';}}>{t('tourRestart')}</button>{session ? <button className="button button-subtle button-small profile-button" onClick={() => setProfile(true)}>
<Icon name="user" size={16} />
<span>{session.user.displayName}</span>
</button> : <button className="button button-small" onClick={() => setLogin(true)}>{t('login')}</button>}</div>
</header>
{error && <div className="global-notice" role="alert">{error}<button aria-label={t('close')} onClick={() => setError('')}>×</button>
</div>}
<main id="main" tabIndex={-1}>
<Suspense fallback={<div className="loading page-width" role="status">{t('loading')}</div>}>{route === '/not-found' ? <div className="page-width"><h1>404</h1><p>{locale === 'it' ? 'Pagina non trovata.' : 'Page not found.'}</p><a href={publicPath(locale)}>{t('home')}</a></div> : lesson && !locked ? <Lab key={`${lesson.id}:${session?.user.id ?? 'guest'}`} lesson={lesson} session={session} progress={progress} onProgress={updateProgress} onLogin={() => setLogin(true)} /> : route === '/leaderboard' ? <LeaderboardPage session={session} onProfile={() => session ? setProfile(true) : setLogin(true)} /> : route.startsWith('/course') || locked ? <Course progress={progress} locale={locale} /> : <Home progress={progress} locale={locale} />}</Suspense>
</main>
{!lesson && <footer className="site-footer">
<div>
<strong>Git by <span className="brand-doing">doing</span></strong>
<p>{t('footer')}</p>
</div>
<p>{t('platformNote')}<br />© {new Date().getFullYear()} Git by doing · <a href="#/course">{t('course')}</a>
</p>
</footer>}
{login && <Modal title={t('loginTitle')} onClose={() => setLogin(false)}>
<p>{t('loginBody')}</p>
<div className="login-options">{config?.providers.map(p => p.id === 'development' ? <div key={p.id}>
<button className="button" data-testid="login-development" disabled={busy} onClick={() => void signIn()}>{t('devLogin')}</button>
<small>{t('devOnly')}</small>
</div> : <button key={p.id} className="button" onClick={() => void beginOAuth(p.authorizeUrl)}>{t('loginWith', {
            provider: p.name
          })}</button>)}</div>{!config?.providers.length && <p>{t('noProviders')}</p>}</Modal>}
{profile && session && <Modal title={t('profileTitle')} onClose={() => setProfile(false)}>
<Profile session={session} />
<button className="button button-subtle" onClick={() => void logout()}>{t('logout')}</button>
</Modal>}
</>;
}
function Modal({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const {
    t
  } = useTranslation();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return <dialog ref={ref} aria-labelledby={titleId} className="modal" onCancel={onClose}>
<div className="modal-heading">
<h2 id={titleId}>{title}</h2>
<button className="icon-button" aria-label={t('close')} onClick={onClose}>
<Icon name="close" />
</button>
</div>{children}</dialog>;
}
function CourseCards({
  progress
}: {
  progress: Progress;
}) {
  const {
    t,i18n
  } = useTranslation();
  return <div className="tier-grid">{tiers.map((tier, index) => {
      const done = progress.completedLessons.filter(id => getLesson(id)?.tier === tier).length;
      const unlocked = progress.unlockedTiers.includes(tier);
      return <article className={`tier-card tier-${tier}`} key={tier}>
<div className="tier-card-top">
<span className="tier-number">0{index + 1}</span>
<span className={`pill ${!unlocked ? 'locked' : ''}`}>
<Icon name={done === 12 ? 'check' : unlocked ? 'play' : 'lock'} size={12} />{t(done === 12 ? 'completed' : unlocked ? 'available' : 'locked')}</span>
</div>
<h3>{t(`tier_${tier}`)}</h3>
<strong>{t(['tierBaseTag', 'tierIntermediateTag', 'tierAdvancedTag'][index])}</strong>
<p>{t(['tierBaseBody', 'tierIntermediateBody', 'tierAdvancedBody'][index])}</p>
<div className="tier-meta">
<span>{t('lessonsCount', {
              count: 12
            })}</span>
<span>{t('pointsPerLesson')}</span>
</div>
<div className="progress-track">
<span style={{
            width: `${done / 12 * 100}%`
          }} />
</div>
<small>{t('completedCount', {
            done,
            total: 12
          })}</small>
<button className="tier-open" data-testid={`tier-${tier}`} disabled={!unlocked} onClick={() => {
          navigatePublic(publicPath(i18n.language as Locale,`tier/${tier}/`));requestAnimationFrame(()=>document.getElementById(`course-${tier}`)?.scrollIntoView({behavior:'smooth',block:'start'}));
        }}>{t('viewLessons')} · {t(`tier_${tier}`)}<Icon name={unlocked ? 'arrow' : 'lock'} size={18} />
</button>{!unlocked && <small>{t('completePrevious')}</small>}</article>;
    })}</div>;
}
function MiniWorkspace() {
  const {
    t
  } = useTranslation();
  return <div className="hero-workspace" aria-hidden="true" data-label={t('safePlace')}>
<div className="mock-chrome">
<i />
<i />
<i />
<span>catalog / feature / git-lab</span>
<b>↗</b>
</div>
<div className="mock-grid">
<div className="mock-terminal">
<small>⌘ &nbsp; TERMINAL</small>
<p>
<span>❯</span> git switch -c feature/catalog</p>
<p className="muted">Switched to a new branch</p>
<p>
<span>❯</span> git add catalog.json</p>
<p>
<span>❯</span> git commit -m "Add coffee"</p>
<p className="muted">[feature/catalog 8c6a2f1]</p>
<p>
<span>❯</span> <b className="cursor">▍</b>
</p>
</div>
<div className="mock-graph">
<small>⑂ &nbsp; HISTORY</small>
<div className="mini-node">
<b>feature/catalog</b>
<span>Add coffee</span>
<code>8c6a2f1</code>
</div>
<div className="mini-node">
<b>main</b>
<span>Initial catalog</span>
<code>a1b2c3d</code>
</div>
</div>
<div className="mock-editor">
<small>▤ &nbsp; catalog.json</small>
<pre>
<em>1</em> {'{'}<br />
<em>2</em>   "items": [<br />
<em>3</em>     "tea",<br />
<em>4</em> <span>+   "coffee"</span>
<br />
<em>5</em>   ]<br />
<em>6</em> {'}'}</pre>
</div>
<div className="mock-portal">
<small>◈ &nbsp; PULL REQUEST</small>
<div className="mini-pr">
<span>Open</span>
<strong>Add coffee to catalog</strong>
<small>feature/catalog → main</small>
<p>✓ Changes ready for review</p>
<div className="avatar-stack">A <i /> B <i /> C</div>
</div>
</div>
</div>
<div className="mock-footer">
<span className="live-dot" /> Four views. One repository. <span>↶ &nbsp; ↷</span>
</div>
</div>;
}
function Home({
  progress,
  locale
}: {
  progress: Progress;
  locale: Locale;
}) {
  const {
    t
  } = useTranslation();
  return <>
<section className="hero page-width">
<div className="hero-copy">
<span className="eyebrow">
<span className="live-dot" />{locale === 'it' ? 'IL TUO PROSSIMO COMMIT INIZIA QUI' : 'YOUR NEXT COMMIT STARTS HERE'}</span>
<h1>{t('heroLineOne')}<br />
<span>{t('heroLineTwo')}</span>
</h1>
<p className="hero-lead">{locale === 'it' ? 'Collabora con Git sapendo cosa cambia e come recuperare il lavoro.' : 'Collaborate with Git knowing what changes and how to recover your work.'}</p>
<p>{t('heroBody')}</p>
<div className="hero-actions">
<a className="button" href={`#/lesson/${lessons.find(item=>!progress.completedLessons.includes(item.id))?.id??'B01'}`}>{t('startCourse')}<Icon name="arrow" size={18} />
</a>
<a className="text-link" href={publicPath(locale,'program/')} onClick={e=>{e.preventDefault();navigatePublic(publicPath(locale,'program/'));}}>
<Icon name="book" size={18} />{t('browseCourses')}</a>
</div>
<div className="hero-facts">
<span>36 {locale === 'it' ? 'scenari' : 'scenarios'}</span>
<i /> <span>IT + EN</span>
<i />
<span>{locale === 'it' ? 'Gratuito, aperto a tutti' : 'Free, open to everyone'}</span>
</div>
</div>
<MiniWorkspace />
</section>
<div className="trust-strip">
<span>{t('madeFor')}</span>
<div>
<Icon name="branch" size={18} /> Git <span> / </span> GitHub <span> / </span> Azure DevOps</div>
</div>
<section className="page-width levels-section">
<div className="section-heading">
<div>
<span className="eyebrow">{t('chooseLevel')}</span>
<h2>{t('threeLevels')}</h2>
</div>
<p>{t('levelsBody')}</p>
</div>
<CourseCards progress={progress} />
</section>
<section className="feature-section page-width">{[1, 2, 3].map(n => <article key={n}>
<span className="feature-icon">
<Icon name={['graph', 'undo', 'external'][n - 1]} size={24} />
</span>
<h3>{t(`feature${n}Title`)}</h3>
<p>{t(`feature${n}Body`)}</p>
</article>)}</section>
<div className="simulation-banner page-width">
<Icon name="info" />
<p>{t('simulationNote')}</p>
</div>
</>;
}
function Course({
  progress,
  locale
}: {
  progress: Progress;
  locale: Locale;
}) {
  const {
    t
  } = useTranslation();
  const tier = new URLSearchParams(location.hash.split('?')[1] ?? '').get('tier') ?? location.pathname.match(/tier\/(base|intermediate|advanced)/)?.[1];
  return <div className="page-width course-page">
<span className="eyebrow">36 {locale === 'it' ? 'LEZIONI · 3 CORSI' : 'LESSONS · 3 COURSES'}</span>
<h1>{tier ? t(`tier_${tier}`) : locale === 'it' ? 'Programma del corso Git' : 'Git course curriculum'}</h1>
<p className="page-intro">{t('allLessonsBody')}</p>
<CourseCards progress={progress} />{tiers.filter(item => !tier || tier === item).map(item => <section className="lesson-section" id={`course-${item}`} key={item}>
<div className="section-heading">
<h2>{t(`tier_${item}`)}</h2>
<span>{t('lessonsCount', {
            count: 12
          })}</span>
</div>
<div className="lesson-grid">{lessons.filter(l => l.tier === item).map(l => <button data-testid={`lesson-${l.id}`} className="lesson-card" key={l.id} disabled={!canOpenLesson(l.id,progress)} onClick={() => {
          location.hash = `/lesson/${l.id}`;
        }}>
<span className="lesson-id">{l.id}</span>
<div>
<h3>{l.title[locale]}</h3>
<p>{l.summary[locale]}</p>
<small>{t('minutes', {
                count: l.estimatedMinutes
              })} · {progress.completedLessons.includes(l.id) ? t('completed') : t('openLesson')}</small>
</div>
<Icon name={progress.completedLessons.includes(l.id) ? 'check' : progress.unlockedTiers.includes(item) ? 'chevron' : 'lock'} />
</button>)}</div>
</section>)}</div>;
}
function Profile({
  session
}: {
  session: Session;
}) {
  const {
    t
  } = useTranslation();
  const [alias, setAlias] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(()=>{let live=true;void request<{alias:string|null;leaderboardOptIn:boolean}>('/v1/me',session.token).then(data=>{if(live){setAlias(data.alias??'');setOptIn(data.leaderboardOptIn);}}).catch(()=>setMessage(t('requestFailed')));return()=>{live=false;};},[session.token]);
  return <form className="profile-form" onSubmit={e => {
    e.preventDefault();
    void request('/v1/me', session.token, {
      alias,
      leaderboardOptIn: optIn
    }, 'PATCH').then(() => setMessage(t('profileSaved'))).catch(error => setMessage(t(error instanceof ApiError&&error.code==='INVALID_PROFILE'?'aliasFormat':'requestFailed')));
  }}>
<label>{t('alias')}<input value={alias} onChange={e => setAlias(e.target.value)} minLength={3} maxLength={30} pattern={"[\\p{L}\\p{N} _.\\-]{3,30}"} aria-describedby="alias-format" required />
</label>
<p>{t('aliasHelp')}</p><p id="alias-format">{t('aliasFormat')}</p>
<label className="checkbox-label">
<input type="checkbox" checked={optIn} onChange={e => setOptIn(e.target.checked)} />{t('optIn')}</label>
<button className="button">{t('saveProfile')}</button>
<p role="status">{message}</p>
</form>;
}
function LeaderboardPage({
  session,
  onProfile
}: {
  session: Session | null;
  onProfile: () => void;
}) {
  const {
    t,
    i18n
  } = useTranslation();
  const [tier, setTier] = useState<Tier>('base');
  const [board, setBoard] = useState<Leaderboard>();
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    setBoard(undefined);
    setError(false);
    void request<Leaderboard>(`/v1/leaderboard?tier=${tier}&courseVersion=${COURSE_VERSION}`).then(data => live && setBoard(data)).catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [tier]);
  return <div className="page-width leaderboard-page">
<span className="eyebrow">
<Icon name="trophy" size={16} /> {t('courseVersion', {
        version: COURSE_VERSION
      })}</span>
<h1>{t('leaderboard')}</h1>
<p className="page-intro">{t('leaderboardBody')}</p>
<div className="board-toolbar">
<label>{t('chooseLevel')}<select value={tier} onChange={e => setTier(e.target.value as Tier)}>{tiers.map(item => <option key={item} value={item}>{t(`tier_${item}`)}</option>)}</select>
</label>
<button className="button button-subtle" onClick={onProfile}>{t(session ? 'profileTitle' : 'loginTitle')}</button>
</div>
<div className="leaderboard-table">
<table>
<thead>
<tr>
<th>{t('rank')}</th>
<th>{t('learner')}</th>
<th>{t('score')}</th>
<th>{t('duration')}</th>
</tr>
</thead>
<tbody>{board?.entries.map(row => <tr key={`${row.rank}:${row.alias}`}>
<td>{String(row.rank).padStart(2, '0')}</td>
<td>{row.alias}</td>
<td>{row.score}</td>
<td>{duration(row.elapsedMs)}</td>
</tr>)}</tbody>
</table>{!board?.entries.length && <div className="empty-board">
<Icon name="trophy" size={42} />
<p>{t(error ? 'requestFailed' : board ? 'emptyLeaderboard' : 'loading')}</p>
</div>}</div>
<p className="help-text">{t('leaderboardPrivacy')}</p>
<p className="help-text">{i18n.language === 'it' ? '100 punti per esercizio verificato, 1.200 per livello. Ordinamento per punti e poi durata crescente. Durata: somma dei tempi delle prime conclusioni riuscite; include letture, pause e sincronizzazione.' : '100 points per verified exercise, 1,200 per level. Sorted by score, then increasing duration. Duration is the sum of first successful completion times, including reading, pauses, and sync delay.'}</p>
</div>;
}
