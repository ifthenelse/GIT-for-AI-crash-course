import { COURSE_VERSION, type Action, type Attempt, type CompleteResponse, type Lesson, type LessonResult, type Objective, type ObjectiveResult, type Progress, type RepoSeed, type RepositoryState, type Session, type Tier, type User } from '../../../packages/contracts/src/index.ts';
import { initializeDatabase, type SqlDatabase, type Statement } from './database.ts';
import { ApiError, canonicalJSON, createRateLimiter, hash, jsonBody, object, randomToken } from './security.ts';
import { aggregateVisibility } from './visibility.ts';
import { createGithubAuth } from './github-auth.ts';

export interface CourseRuntime {
  lessons: Lesson[];
  replayActions(seed: RepoSeed, actions: Action[]): RepositoryState;
  evaluateObjectives(state: RepositoryState, objectives: Objective[]): ObjectiveResult[];
}
export interface AppConfig {
  db: SqlDatabase;
  development?: boolean;
  appOrigin: string;
  allowOrigins?: string[];
  now?: () => number;
  runtime?: CourseRuntime;
  loadRuntime?: () => Promise<CourseRuntime>;
  initializeSchema?: boolean;
  sessionLifetimeMs?: number;
  authSecret?: string;
  githubClientId?: string;
  githubClientSecret?: string;
}
interface UserRow { id: string; provider: string; subject: string; display_name: string; alias: string | null; leaderboard_opt_in: number; }
interface AttemptRow { id: string; user_id: string; lesson_id: string; course_version: string; started_ms: number; completed_ms: number | null; }
interface Submission { user_id: string; idempotency_key: string; attempt_id: string; payload_hash: string; result_json: string; visibility_json: string | null; }
const tiers: Tier[] = ['base', 'intermediate', 'advanced'];
const toUser = (row: UserRow): User => ({ id: row.id, displayName: row.display_name, provider: row.provider });
const resultSelect = 'SELECT lesson_id AS lessonId, score, elapsed_ms AS elapsedMs, completed_at AS completedAt FROM lesson_results WHERE user_id = ? AND course_version = ? ORDER BY completed_at, lesson_id';

function validateActions(input: unknown): asserts input is Action[] {
  if (!Array.isArray(input) || input.length > 500) throw new ApiError(400, 'INVALID_ACTIONS', 'Use at most 500 exercise actions.');
  const operations = ['open-pr', 'approve-pr', 'merge-pr', 'enable-policy', 'create-release', 'fork', 'agent-change', 'switch-provider'];
  for (const action of input) {
    if (!object(action) || typeof action.type !== 'string') throw new ApiError(400, 'INVALID_ACTIONS', 'Invalid exercise action.');
    let fields: string[];
    switch (action.type) {
      case 'command': fields = ['type', 'command']; if (typeof action.command !== 'string' || action.command.length > 2048 || action.command.includes('\0')) throw new ApiError(400, 'INVALID_ACTIONS', 'Invalid command.'); break;
      case 'edit': fields = ['type', 'path', 'content']; if (typeof action.path !== 'string' || !action.path || action.path.length > 256 || action.path.startsWith('/') || action.path.split(/[\\/]/).includes('..') || action.path.includes('\0') || typeof action.content !== 'string' || action.content.length > 32_000) throw new ApiError(400, 'INVALID_ACTIONS', 'Invalid file edit.'); break;
      case 'answer': fields = ['type', 'questionId', 'value']; if (typeof action.questionId !== 'string' || action.questionId.length > 128 || typeof action.value !== 'string' || action.value.length > 2048) throw new ApiError(400, 'INVALID_ACTIONS', 'Invalid answer.'); break;
      case 'platform': fields = ['type', 'operation', 'payload']; if (!operations.includes(String(action.operation)) || (action.payload !== undefined && (!object(action.payload) || Object.keys(action.payload).length > 12 || Object.entries(action.payload).some(([key, value]) => key.length > 64 || typeof value !== 'string' || value.length > 4096)))) throw new ApiError(400, 'INVALID_ACTIONS', 'Invalid portal action.'); break;
      case 'undo': case 'redo': case 'reset': fields = ['type']; break;
      default: throw new ApiError(400, 'INVALID_ACTIONS', 'Unsupported exercise action.');
    }
    if (Object.keys(action).some(key => !fields.includes(key))) throw new ApiError(400, 'INVALID_ACTIONS', 'Unexpected action field.');
  }
}

function assertLessonUnlocked(course: CourseRuntime, lesson: Lesson, current: Progress) {
  if (!current.unlockedTiers.includes(lesson.tier)) throw new ApiError(403, 'TIER_LOCKED', 'Complete the previous tier first.');
  if (current.completedLessons.includes(lesson.id)) return;
  const orderedLessons = [...course.lessons].sort((left, right) => tiers.indexOf(left.tier) - tiers.indexOf(right.tier) || left.order - right.order);
  const lessonIndex = orderedLessons.findIndex(item => item.id === lesson.id);
  // Check the full prefix so legacy out-of-order results cannot unlock new skips.
  if (orderedLessons.slice(0, lessonIndex).some(item => !current.completedLessons.includes(item.id))) throw new ApiError(403, 'LESSON_LOCKED', 'Complete the previous lesson first.');
}

export function createApp(config: AppConfig) {
  const db = config.db;
  const now = config.now ?? Date.now;
  const allowed = new Set(config.allowOrigins ?? [new URL(config.appOrigin).origin]);
  const ready = config.initializeSchema === false ? Promise.resolve() : initializeDatabase(db);
  let runtimePromise: Promise<CourseRuntime> | undefined;
  const runtime = (): Promise<CourseRuntime> => runtimePromise ??= config.runtime ? Promise.resolve(config.runtime) : (config.loadRuntime ?? (() => import('./runtime.ts').then(module => module.runtime)))();
  const limit = createRateLimiter();
  const authLimit = createRateLimiter(20);

  async function userForRequest(request: Request) {
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ') || authorization.length > 256) throw new ApiError(401, 'UNAUTHENTICATED', 'Please sign in.');
    const tokenHash = await hash(authorization.slice(7));
    const row = await db.get<UserRow>('SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_ms > ?', [tokenHash, now()]);
    if (!row) throw new ApiError(401, 'UNAUTHENTICATED', 'Your session has ended. Please sign in again.');
    return { row, tokenHash };
  }
  async function createUser(provider: string, subject: string, name: string) {
    const id = randomToken();
    await db.run('INSERT OR IGNORE INTO users(id, provider, subject, display_name) VALUES (?, ?, ?, ?)', [id, provider, subject, name.slice(0, 100)]);
    return (await db.get<UserRow>('SELECT * FROM users WHERE provider = ? AND subject = ?', [provider, subject]))!;
  }
  async function issueSession(userId: string): Promise<Session> {
    const token = randomToken();
    await db.run('DELETE FROM sessions WHERE expires_ms <= ?', [now()]);
    await db.run('INSERT INTO sessions(token_hash, user_id, expires_ms) VALUES (?, ?, ?)', [await hash(token), userId, now() + (config.sessionLifetimeMs ?? 30 * 60_000)]);
    const user = await db.get<UserRow>('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) throw new ApiError(401, 'UNAUTHENTICATED', 'Please sign in again.');
    return { token, user: toUser(user) };
  }
  const github = createGithubAuth({ ...config, db, now, createUser: async (subject, name) => toUser(await createUser('github', subject, name)), issueSession });

  async function progress(userId: string): Promise<Progress> {
    const results = await db.all<LessonResult>(resultSelect, [userId, COURSE_VERSION]);
    const completions = await db.all<Progress['completions'][number]>('SELECT tier, score, elapsed_ms AS elapsedMs, completed_at AS completedAt FROM tier_completions WHERE user_id = ? AND course_version = ? ORDER BY completed_at, tier', [userId, COURSE_VERSION]);
    const unlockedTiers: Tier[] = ['base'];
    if (completions.some(item => item.tier === 'base')) unlockedTiers.push('intermediate');
    if (completions.some(item => item.tier === 'intermediate')) unlockedTiers.push('advanced');
    return { courseVersion: COURSE_VERSION, completedLessons: results.map(result => result.lessonId), results, completions, unlockedTiers };
  }
  async function complete(request: Request, id: string, userId: string, receivedMs: number): Promise<CompleteResponse> {
    const body = await jsonBody(request);
    if (body.courseVersion !== COURSE_VERSION) throw new ApiError(409, 'COURSE_VERSION_MISMATCH', 'Reload the course before submitting.');
    if (typeof body.idempotencyKey !== 'string' || !/^[A-Za-z0-9_-]{8,128}$/.test(body.idempotencyKey)) throw new ApiError(400, 'INVALID_IDEMPOTENCY_KEY', 'An idempotency key is required.');
    validateActions(body.actions);
    const payloadHash = await hash(canonicalJSON({ attemptId: id, body }));
    const previous = await db.get<Submission>('SELECT * FROM submissions WHERE user_id = ? AND idempotency_key = ?', [userId, body.idempotencyKey]);
    const fromSubmission = async (submission: Submission) => {
      if (submission.attempt_id !== id || submission.payload_hash !== payloadHash) throw new ApiError(409, 'IDEMPOTENCY_CONFLICT', 'This key was already used for another request.');
      return { result: JSON.parse(submission.result_json) as LessonResult, progress: await progress(userId), ...(submission.visibility_json ? { visibility: JSON.parse(submission.visibility_json) as CompleteResponse['visibility'] } : {}) };
    };
    if (previous) return fromSubmission(previous);
    const attempt = await db.get<AttemptRow>('SELECT * FROM attempts WHERE id = ? AND user_id = ?', [id, userId]);
    if (!attempt) throw new ApiError(404, 'ATTEMPT_NOT_FOUND', 'Attempt not found.');
    if (attempt.completed_ms !== null) throw new ApiError(409, 'ATTEMPT_COMPLETED', 'This attempt is already complete.');
    const course = await runtime();
    const lesson = course.lessons.find(item => item.id === attempt.lesson_id);
    if (!lesson || attempt.course_version !== COURSE_VERSION) throw new ApiError(409, 'COURSE_VERSION_MISMATCH', 'Reload the course.');
    assertLessonUnlocked(course, lesson, await progress(userId));
    let passed = false;
    try {
      const state = course.replayActions(lesson.seed, body.actions);
      const objectives = course.evaluateObjectives(state, lesson.objectives);
      passed = objectives.length > 0 && objectives.length === lesson.objectives.length && objectives.every(result => result.passed);
    } catch { throw new ApiError(422, 'INVALID_REPLAY', 'These actions cannot be replayed.'); }
    if (!passed) throw new ApiError(422, 'OBJECTIVES_NOT_MET', 'Complete every exercise objective before submitting.');
    const completedMs = receivedMs;
    const result: LessonResult = { lessonId: lesson.id, score: 100, elapsedMs: Math.max(0, completedMs - attempt.started_ms), completedAt: new Date(completedMs).toISOString() };
    const visibility = aggregateVisibility(body.visibility, result.elapsedMs);
    const tierIds = course.lessons.filter(item => item.tier === lesson.tier).map(item => item.id);
    const placeholders = tierIds.map(() => '?').join(',');
    const statements: Statement[] = [
      { sql: 'INSERT INTO submissions(user_id, idempotency_key, attempt_id, payload_hash, result_json, visibility_json) VALUES (?, ?, ?, ?, ?, ?)', values: [userId, body.idempotencyKey, id, payloadHash, JSON.stringify(result), visibility ? JSON.stringify(visibility) : null] },
      { sql: 'INSERT OR IGNORE INTO lesson_results(user_id, course_version, lesson_id, tier, score, elapsed_ms, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)', values: [userId, COURSE_VERSION, lesson.id, lesson.tier, result.score, result.elapsedMs, result.completedAt] },
      { sql: 'UPDATE attempts SET completed_ms = ? WHERE id = ? AND user_id = ? AND completed_ms IS NULL', values: [completedMs, id, userId] },
      { sql: `INSERT OR IGNORE INTO tier_completions(user_id, course_version, tier, score, elapsed_ms, completed_at) SELECT ?, ?, ?, SUM(score), SUM(elapsed_ms), ? FROM lesson_results WHERE user_id = ? AND course_version = ? AND lesson_id IN (${placeholders}) HAVING COUNT(*) = ?`, values: [userId, COURSE_VERSION, lesson.tier, result.completedAt, userId, COURSE_VERSION, ...tierIds, tierIds.length] },
    ];
    try { await db.batch(statements); } catch (error) {
      const winner = await db.get<Submission>('SELECT * FROM submissions WHERE user_id = ? AND idempotency_key = ?', [userId, body.idempotencyKey]);
      if (winner) return fromSubmission(winner);
      if (await db.get<Submission>('SELECT * FROM submissions WHERE attempt_id = ?', [id])) throw new ApiError(409, 'ATTEMPT_COMPLETED', 'This attempt is already complete.');
      throw error;
    }
    return { result, progress: await progress(userId), ...(visibility ? { visibility } : {}) };
  }

  async function route(request: Request): Promise<Response> {
    const receivedMs = now();
    await ready;
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
    const ip = request.headers.get('cf-connecting-ip') ?? 'local';
    limit(ip, now());
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method) && path !== '/auth/callback/github') {
      const origin = request.headers.get('origin');
      if (!origin || !allowed.has(origin)) throw new ApiError(403, 'ORIGIN_NOT_ALLOWED', 'This request origin is not allowed.');
    }
    if (path.startsWith('/auth/')) {
      authLimit(ip, now());
      if (path === '/auth/development' && request.method === 'POST') {
        if (!config.development) throw new ApiError(404, 'NOT_FOUND', 'Not found.');
        await jsonBody(request, 4096);
        const user = await createUser('development', 'github-test', 'Local practice learner');
        return Response.json(await issueSession(user.id));
      }
      if (path === '/auth/logout' && request.method === 'POST') {
        const { tokenHash } = await userForRequest(request);
        await db.run('DELETE FROM sessions WHERE token_hash = ?', [tokenHash]);
        return Response.json({ signedOut: true });
      }
      const response = await github.handle(request);
      if (response) return response;
      throw new ApiError(404, 'NOT_FOUND', 'Not found.');
    }
    if (path === '/v1/config' && request.method === 'GET') return Response.json({ courseVersion: COURSE_VERSION, development: config.development === true, providers: [ ...(config.development ? [{ id: 'development', name: 'Local development only', authorizeUrl: '/auth/development' }] : []), ...(github.enabled ? [{ id: 'github', name: 'GitHub', authorizeUrl: '/auth/github' }] : []) ] });
    if (path === '/v1/leaderboard' && request.method === 'GET') {
      const tier = url.searchParams.get('tier') ?? 'base';
      const version = url.searchParams.get('courseVersion') ?? COURSE_VERSION;
      if (!tiers.includes(tier as Tier) || version !== COURSE_VERSION) throw new ApiError(400, 'INVALID_FILTER', 'Unknown tier or course version.');
      const rows = await db.all<{ alias: string; tier: Tier; score: number; elapsedMs: number; completedAt: string }>('SELECT users.alias AS alias, tier_completions.tier AS tier, score, elapsed_ms AS elapsedMs, completed_at AS completedAt FROM tier_completions JOIN users ON users.id = tier_completions.user_id WHERE users.leaderboard_opt_in = 1 AND users.alias IS NOT NULL AND tier_completions.tier = ? AND course_version = ? ORDER BY score DESC, elapsed_ms ASC, completed_at ASC, users.id ASC LIMIT 100', [tier, version]);
      return Response.json({ entries: rows.map((row, index) => ({ rank: index + 1, ...row })) });
    }
    const { row: user } = await userForRequest(request);
    if (path === '/v1/me' && request.method === 'GET') return Response.json({ user: toUser(user), alias:user.alias, leaderboardOptIn:user.leaderboard_opt_in===1 });
    if (path === '/v1/me' && request.method === 'PATCH') {
      const body = await jsonBody(request, 4096);
      if (typeof body.alias !== 'string' || !/^[\p{L}\p{N} _.-]{3,30}$/u.test(body.alias.trim()) || typeof body.leaderboardOptIn !== 'boolean' || Object.keys(body).some(key => !['alias', 'leaderboardOptIn'].includes(key))) throw new ApiError(400, 'INVALID_PROFILE', 'Use an alias of 3–30 letters, digits, spaces, dots, hyphens or underscores.');
      await db.run('UPDATE users SET alias = ?, leaderboard_opt_in = ? WHERE id = ?', [body.alias.trim(), body.leaderboardOptIn ? 1 : 0, user.id]);
      return Response.json({ user: toUser(user), alias: body.alias.trim(), leaderboardOptIn: body.leaderboardOptIn });
    }
    if (path === '/v1/me/progress' && request.method === 'GET') return Response.json(await progress(user.id));
    if (path === '/v1/attempts/start' && request.method === 'POST') {
      const body = await jsonBody(request, 4096);
      if (body.courseVersion !== COURSE_VERSION) throw new ApiError(409, 'COURSE_VERSION_MISMATCH', 'Reload the course.');
      const course = await runtime();
      const lesson = course.lessons.find(item => item.id === body.lessonId);
      if (!lesson) throw new ApiError(404, 'LESSON_NOT_FOUND', 'Lesson not found.');
      assertLessonUnlocked(course, lesson, await progress(user.id));
      const id = randomToken();
      await db.run('INSERT OR IGNORE INTO attempts(id, user_id, lesson_id, course_version, started_ms) VALUES (?, ?, ?, ?, ?)', [id, user.id, lesson.id, COURSE_VERSION, now()]);
      const attempt = (await db.get<AttemptRow>('SELECT * FROM attempts WHERE user_id = ? AND lesson_id = ? AND course_version = ? AND completed_ms IS NULL', [user.id, lesson.id, COURSE_VERSION]))!;
      const result: Attempt = { id: attempt.id, lessonId: attempt.lesson_id, courseVersion: attempt.course_version, startedAt: new Date(attempt.started_ms).toISOString() };
      return Response.json(result);
    }
    const completion = path.match(/^\/v1\/attempts\/([A-Za-z0-9_-]{1,128})\/complete$/);
    if (completion && request.method === 'POST') return Response.json(await complete(request, completion[1], user.id, receivedMs));
    throw new ApiError(404, 'NOT_FOUND', 'Not found.');
  }

  return { async fetch(request: Request): Promise<Response> {
    let response: Response;
    try { response = await route(request); }
    catch (error) {
      const failure = error instanceof ApiError ? error : new ApiError(500, 'INTERNAL_ERROR', 'The service could not complete this request.');
      response = Response.json({ error: { code: failure.code, message: failure.message } }, { status: failure.status });
      if (failure.status === 429) response.headers.set('Retry-After', '60');
    }
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-store');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'no-referrer');
    headers.set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
    const origin = request.headers.get('origin');
    if (origin && allowed.has(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
      headers.append('Vary', 'Origin');
    }
    return new Response(response.body, { status: response.status, headers });
  } };
}
