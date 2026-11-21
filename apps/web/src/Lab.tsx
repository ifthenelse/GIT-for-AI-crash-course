import { ConceptIllustration } from './ConceptIllustration';
import { CodeBlock, LessonText } from './LessonText';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COURSE_VERSION, type Action, type Attempt, type CompleteRequest, type CompleteResponse, type Lesson, type Locale, type Objective, type Progress, type Session, type VisibilityLedger } from '@gitcourse/contracts';
import {lessons,referenceLabel} from '@gitcourse/content';
import { evaluateObjectives } from '@gitcourse/engine';
import { ApiError, request } from './api';
import { readRecord, writeRecord } from './persistence';
import { useLab } from './store';
import { usePracticeTiming } from './practiceTiming';
import { useStudyTiming } from './timing';
import { WindowManager } from './WindowManager';
import { Editor, Graph, Portal, Terminal } from './Panels';
import { Icon } from './icons';
import {completePractice,canOpenLesson} from './courseProgress';
import {Tour} from './Tour';
import { useEditingLease } from './ownership';
interface Draft {
  confirmedElapsedMs?: number;
  practiceStarted?: boolean;
  activePracticeMs?: number;
  actions: Action[];
  attempt?: Attempt;
  visibility?: VisibilityLedger;
  pending?: CompleteRequest;
}
function objectiveLabel(o: Objective, t: ReturnType<typeof useTranslation>['t']) {
  const types: Record<string, string> = {
    'operation-complete': 'operation',
    'no-conflicts': 'conflicts',
    answer: 'quiz'
  };
  return t(`objective_${types[o.type] ?? o.type}`, o as unknown as Record<string, string>);
}
export default function Lab({
  lesson,
  session,
  progress,
  onProgress,
  onLogin
}: {
  lesson: Lesson;
  session: Session | null;
  progress: Progress;
  onProgress: (p: Progress) => void;
  onLogin: () => void;
}) {
  const {
    t,
    i18n
  } = useTranslation();
  const locale = i18n.language as Locale;
  const {
    repo,
    actions,
    hydrate,
    act
  } = useLab();
  const [practiceStarted, setPracticeStarted] = useState(false);
  const practiceStartedRef = useRef(false);
  const [attempt, setAttempt] = useState<Attempt>();
  const [,setAcceptedElapsed]=useState<number>();
  const acceptedElapsedRef=useRef<number|undefined>(undefined);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState<CompleteRequest>();
  const [hint, setHint] = useState(0);
  const [storageError, setStorageError] = useState(false);
  const [previousLedger, setPreviousLedger] = useState<VisibilityLedger>();
  const ledgerRef = useRef<VisibilityLedger | undefined>(undefined);
  const attemptRef = useRef<Attempt | undefined>(undefined);
  const pendingRef = useRef<CompleteRequest | undefined>(undefined);
  const key = `draft:${session?.user.id ?? 'guest'}:${COURSE_VERSION}:${lesson.id}`;
  const lease = useEditingLease(key);
  const panels = useMemo(() => ({
    terminal: <Terminal />,
    graph: <Graph />,
    editor: <Editor />,
    portal: <Portal />
  }), []);
  const retryCount = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(retryTimer.current), []);
  const onLedger = useCallback((ledger: VisibilityLedger) => {
    ledgerRef.current = ledger;
  }, []);
  const timing = useStudyTiming(attempt?.id, previousLedger, onLedger, practiceStarted);
  const objectives = evaluateObjectives(repo, lesson.objectives);
  const ready = objectives.every(o => o.passed);
  const completed = progress.completedLessons.includes(lesson.id);
  const activeClock = usePracticeTiming(practiceStarted && !completed && lease.owned);
  const previousPassed = useRef<boolean[]>([]);
  const previousReady = useRef(false);
  const [newlyCompleted, setNewlyCompleted] = useState<number[]>([]);
  const [celebrateReady, setCelebrateReady] = useState(false);
  useEffect(() => {
    const passed = objectives.map(o => o.passed);
    if (loaded && practiceStarted && previousPassed.current.length) {
      setNewlyCompleted(passed.flatMap((value, i) => value && !previousPassed.current[i] ? [i] : []));
      setCelebrateReady(ready && !previousReady.current);
    }
    previousPassed.current = passed; previousReady.current = ready;
  }, [actions, loaded, practiceStarted, ready]);
  const readingMinutes = Math.max(1, Math.ceil(lesson.concepts.map(c => c.body[locale]).join(" ").split(/\s+/).length / 200));
  useEffect(() => {
    let live = true;
    void (async () => {
      let draft: Draft | undefined;
      try {
        draft = await readRecord<Draft>(key);
      } catch {
        setStorageError(true);
      }
      if (!live) return;
      try {
        hydrate(lesson, draft?.actions ?? []);
      } catch {
        hydrate(lesson);
        draft = undefined;
      }
      setPreviousLedger(draft?.visibility);
      setAcceptedElapsed(draft?.confirmedElapsedMs);acceptedElapsedRef.current=draft?.confirmedElapsedMs;
      setPending(draft?.pending);
      pendingRef.current = draft?.pending;
      if (draft?.attempt) {
        setAttempt(draft.attempt);
        attemptRef.current = draft.attempt;
      }
      const started = !!draft?.practiceStarted || !!draft?.attempt || !!draft?.actions?.length;
      practiceStartedRef.current = started;
      activeClock.current.restore(draft?.activePracticeMs);
      setPracticeStarted(started);
      if (live) setLoaded(true);
    })();
    return () => {
      live = false;
    };
  }, [key, lesson, session, hydrate]);
  useEffect(() => {
    if (!loaded || !lease.owned) return;
    const save = () => void writeRecord(key, {
      actions: useLab.getState().actions,
      practiceStarted: practiceStartedRef.current,
      activePracticeMs: activeClock.current.sample(performance.now()),
      confirmedElapsedMs:acceptedElapsedRef.current,
      attempt: attemptRef.current,
      visibility: ledgerRef.current,
      pending: pendingRef.current
    } satisfies Draft).catch(() => setStorageError(true));
    const timeout = setTimeout(save, 150);
    window.addEventListener('pagehide', save);
    return () => {
      clearTimeout(timeout);
      save();
      window.removeEventListener('pagehide', save);
    };
  }, [actions, key, loaded, pending, lease.owned]);
  const startPractice = async () => {
    if (!lease.owned || busy) return;
    setBusy(true);
    try {
      if (session && !attemptRef.current) {
        const a = await request<Attempt>('/v1/attempts/start', session.token, { lessonId: lesson.id, courseVersion: COURSE_VERSION });
        attemptRef.current = a; setAttempt(a);
      }
      practiceStartedRef.current = true; setPracticeStarted(true);
      await writeRecord(key, { actions: useLab.getState().actions, attempt: attemptRef.current, practiceStarted: true, activePracticeMs: activeClock.current.sample(performance.now()) } satisfies Draft);
      setMessage('');
    } catch { setMessage(t('requestFailed')); }
    finally { setBusy(false); }
  };
  const submit = useCallback(async (body?: CompleteRequest) => {
    if (!lease.owned || !practiceStartedRef.current) return;
    if (!session) {
      if(ready){const elapsed=activeClock.current.sample(performance.now());acceptedElapsedRef.current=elapsed;setAcceptedElapsed(elapsed);onProgress(completePractice(progress,lesson.id,elapsed));setMessage(t('practiceCompleted'));}else setMessage(t('notReady'));
      return;
    }
    if(!attempt){setMessage(t('attemptUnavailable'));return;}
    const payload = body ?? pendingRef.current ?? {
      courseVersion: COURSE_VERSION,
      actions: useLab.getState().actions,
      idempotencyKey: crypto.randomUUID(),
      visibility: timing.ledger()
    };
    setBusy(true);
    pendingRef.current = payload;
    setPending(payload);
    try {
      await writeRecord(key, {
        actions: payload.actions,
        practiceStarted: true,
        activePracticeMs: activeClock.current.sample(performance.now()),
        attempt,
        visibility: payload.visibility,
        pending: payload
      } satisfies Draft);
      const result = await request<CompleteResponse>(`/v1/attempts/${attempt.id}/complete`, session.token, payload);
      acceptedElapsedRef.current=result.result.elapsedMs;setAcceptedElapsed(result.result.elapsedMs);
      onProgress(result.progress);
      retryCount.current = 0;
      clearTimeout(retryTimer.current);
      pendingRef.current = undefined;
      setPending(undefined);
      await writeRecord(key, {
        actions: useLab.getState().actions,
        practiceStarted: true,
        activePracticeMs: activeClock.current.sample(performance.now()),
        confirmedElapsedMs:acceptedElapsedRef.current,
        attempt,
        visibility: payload.visibility
      } satisfies Draft);
      setMessage(t('resultSaved'));
    } catch (error) {
      if (error instanceof ApiError && error.status < 500 && error.status !== 429) {
        pendingRef.current = undefined;
        setPending(undefined);
        if (error.status === 401) onLogin();
        setMessage(error.status === 401 ? t('sessionExpired') : error.status === 422 ? t('notReady') : t('requestFailed'));
      } else {
        setMessage(t('pendingHelp'));
        if (retryCount.current < 3 && navigator.onLine) {
          const wait = Math.max(error instanceof ApiError ? error.retryAfterMs : 0, 1000 * 2 ** retryCount.current++);
          retryTimer.current = setTimeout(() => void submitRef.current(payload), wait);
        }
      }
      if (!pendingRef.current) await writeRecord(key, {
        actions: useLab.getState().actions,
        practiceStarted: true,
        activePracticeMs: activeClock.current.sample(performance.now()),
        confirmedElapsedMs:acceptedElapsedRef.current,
        attempt,
        visibility: payload.visibility
      }).catch(() => setStorageError(true));
    } finally {
      setBusy(false);
    }
  }, [session, attempt, key, onProgress, onLogin, ready, t, timing, lease.owned,progress,lesson.id]);
  const submitRef = useRef(submit);
  submitRef.current = submit;
  useEffect(() => {
    const online = () => {
      if (pendingRef.current) void submitRef.current(pendingRef.current);
    };
    window.addEventListener('online', online);
    return () => window.removeEventListener('online', online);
  }, []);
  useEffect(() => {
    if (loaded && pendingRef.current && session) void submitRef.current(pendingRef.current);
  }, [loaded, session]);
  if (!loaded) return <div className="page-width loading" role="status">{t('loading')}</div>;
  return <div className="lab-page">
<div className="lab-topbar">
<a href="#/course" className="text-link">
<Icon name="chevron" size={16} />{t('lessonList')}</a>
<span className="tier-hud">{t(`tier_${lesson.tier}`)} <span> / </span> {lesson.id} · {lesson.order}/12</span>
<span className="lab-sync">
<span className="live-dot" />{pending ? t('pending') : completed && session ? t('synced') : t('localSaved')}</span>
</div>
<div className="lab-heading">
<div>
<span className="eyebrow">{lesson.id} · {t('minutes', {
            count: lesson.estimatedMinutes
          })}</span>
<h1>{lesson.title[locale]}</h1>
<div className="lesson-prose"><LessonText>{lesson.summary[locale]}</LessonText></div>
</div>

</div>{!lease.owned && <div className="global-notice" role="status">{t('otherTab')}<button onClick={lease.takeover}>{t('takeover')}</button>
</div>}<section className="lesson-reading-time"><strong>{t("readingTime")}</strong><p>{t("readingMinutes", { count: readingMinutes })}</p></section><section className="lesson-introduction" aria-labelledby="lesson-concepts"><h2 id="lesson-concepts">{t('concepts')}</h2>{lesson.concepts.map((concept,index)=><article key={index}><h3>{concept.title[locale]}</h3>{concept.body[locale].split(/\n\s*\n/).map((paragraph, paragraphIndex) => <div className="illustrated-concept" key={paragraphIndex}><ConceptIllustration topic={`${concept.title.en} ${concept.body.en}`} /><div className="lesson-prose"><LessonText>{paragraph}</LessonText></div></div>)}</article>)}</section><div className="practice-start"><p>{t("practiceStartHelp")}</p><button className="button" data-testid="start-practice" disabled={busy || practiceStarted || !lease.owned} onClick={() => void startPractice()}>{t(practiceStarted ? "practiceStarted" : "startExercise")}</button></div><div className="lab-layout" inert={!lease.owned}>
<aside className="lesson-sidebar">
<div className="task-card">
<span className="eyebrow">{t('objectives')}</span>
<div className="lesson-prose"><LessonText>{lesson.task[locale]}</LessonText></div>
<ul className="objectives">{objectives.map((r, i) => <li key={i} className={`${r.passed ? 'is-passed' : ''} ${newlyCompleted.includes(i) ? 'just-completed' : ''}`}>
<span className="objective-checkbox" role="checkbox" aria-checked={r.passed} aria-readonly="true" aria-label={objectiveLabel(r.objective, t)}>{r.passed && <Icon name="check" size={15} />}</span>{objectiveLabel(r.objective, t)}</li>)}</ul>{completed && <p className="completion-badge" data-testid="completed-badge">
<Icon name="check" size={17} />{t('completed')}</p>}<button className={`button submit-button ${celebrateReady && practiceStarted && !completed ? "is-ready" : ""}`} data-testid="exercise-submit" disabled={busy || !practiceStarted || !ready} onClick={() => void submit()}>
<Icon name="check" size={17} />{t(busy ? 'checking' : session && attempt ? 'check' : 'checkLocal')}</button>{completed && session && <button className="text-link" onClick={() => {
            void request<Attempt>('/v1/attempts/start', session.token, {
              lessonId: lesson.id,
              courseVersion: COURSE_VERSION
            }).then(a => {
              activeClock.current.restore(); activeClock.current.activity(performance.now());
              attemptRef.current = a;
              acceptedElapsedRef.current=undefined;setAcceptedElapsed(undefined);
              setAttempt(a);
              pendingRef.current = undefined;
              setPending(undefined);
              act({
                type: 'reset'
              });
              setMessage('');
            }).catch(() => setMessage(t('requestFailed')));
          }}>{t('newAttempt')}</button>}{!session && <button className="text-link" onClick={onLogin}>{t('loginTitle')}</button>}{pending && <button className="button button-subtle" disabled={busy} onClick={() => void submit(pending)}>{t('retry')}</button>}<p className="attempt-note">{t(attempt ? 'startedNote' : 'practiceNote')}</p>{message && <p className="result-message" role="status">{message}</p>}{storageError && <p role="alert">{t('localSaveFailed')}</p>}</div>
<div className="lesson-learning">
<details>
<summary>{t('hints')}</summary>{lesson.hints.slice(0, hint).map((h, i) => <div className="lesson-prose" key={i}><LessonText>{h[locale]}</LessonText></div>)}<button onClick={() => setHint(v => v + 1)} disabled={hint >= lesson.hints.length}>{t('showHint')}</button>
</details>
<details>
<summary>{t('solution')}</summary>
<p>{t('solutionHelp')}</p>
<ol className="solution-list">{lesson.solution.map((a, i) => <li key={i}>
<CodeBlock>{a.type === 'command' ? a.command : a.type === 'edit' ? `${a.path}\n${a.content}` : a.type === 'answer' ? `${a.questionId}: ${a.value}` : a.type === 'platform' ? `${a.operation} ${JSON.stringify(a.payload ?? {})}` : a.type}</CodeBlock>
</li>)}</ol>
</details>
<details>
<summary>{t('references')}</summary>
<ul>{lesson.reference.map(ref => <li key={ref.url}>
<a href={ref.url} target="_blank" rel="noreferrer">{referenceLabel(ref.label,locale)}<Icon name="external" size={12} />
</a>
</li>)}</ul>
</details>

</div>
</aside>
<section className="lab-workspace" aria-label={t('learningWorkspace')}>
<div className="workspace-interactions" inert={!practiceStarted}><div className="lab-toolbar">
<span>
<Icon name="folder" size={16} /> git-lab <span className="pill">sandbox</span>
</span>
<div>
<button data-testid="undo" onClick={() => act({
              type: 'undo'
            })}>
<Icon name="undo" size={16} />{t('undo')}</button>
<button data-testid="redo" onClick={() => act({
              type: 'redo'
            })}>
<Icon name="redo" size={16} />{t('redo')}</button>
<button onClick={() => {
              if (window.confirm(t('resetConfirm'))) {
                act({
                  type: 'reset'
                });
                setMessage('');
              }
            }} aria-label={t('resetExercise')}>
<Icon name="reset" size={16} />
</button>
</div>
</div>
<WindowManager userId={session?.user.id ?? 'guest'}>{panels}</WindowManager></div>{!practiceStarted && <div className="workspace-reading-overlay practice-overlay"><p>{t("workspaceLocked")}</p><button className="button" disabled={busy || !lease.owned} onClick={() => void startPractice()}>{t("startExercise")}</button></div>}
<p className="simulation-footnote">
<Icon name="info" size={14} />{t('simulationNote')}</p>
</section>
</div>
<nav className="lesson-navigation" aria-label={t('lessonNavigation')}><a className="button button-subtle" href="#/course">{t('lessonList')}</a>{lessons.findIndex(item=>item.id===lesson.id)>0&&<a className="button button-subtle" href={`#/lesson/${lessons[lessons.findIndex(item=>item.id===lesson.id)-1].id}`}>{t('previous')}</a>}{lessons[lessons.findIndex(item=>item.id===lesson.id)+1]&&<button className="button" disabled={!completed||!canOpenLesson(lessons[lessons.findIndex(item=>item.id===lesson.id)+1].id,progress)} onClick={()=>{location.hash=`/lesson/${lessons[lessons.findIndex(item=>item.id===lesson.id)+1].id}`;}}>{t('next')}</button>}</nav><Tour autoStart={lesson.id==='B01'}/></div>;
}
