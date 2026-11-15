import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Action, Lesson, RepositoryState, Tier } from '../../../packages/contracts/src/index.ts';
import { createApp, type CourseRuntime } from './app.ts';
import { createSqliteDatabase } from './sqlite.ts';
import { hash } from './security.ts';
import { aggregateVisibility } from './visibility.ts';

const APP = 'http://127.0.0.1:5173';
const API = 'http://127.0.0.1:8787';
const solutions: Action[] = [{ type: 'answer', questionId: 'check', value: 'yes' }];
const lessons = (['base', 'intermediate', 'advanced'] as Tier[]).flatMap(tier => Array.from({ length: 12 }, (_, index) => ({
  id: `${tier}-${index + 1}`, tier, order: index + 1, seed: {}, objectives: [{ type: 'answer', questionId: 'check', value: 'yes' }],
} as Lesson)));
const runtime: CourseRuntime = {
  lessons,
  replayActions(_seed, actions) { return { answers: Object.fromEntries(actions.filter(action => action.type === 'answer').map(action => [action.questionId, action.value])) } as RepositoryState; },
  evaluateObjectives(state, objectives) { return objectives.map(objective => ({ objective, passed: objective.type === 'answer' && state.answers[objective.questionId] === objective.value })); },
};
const cleanups: (() => void)[] = [];
afterEach(() => { for (const cleanup of cleanups.splice(0)) cleanup(); });
function fixture(path = ':memory:', development = true) {
  const db = createSqliteDatabase(path);
  cleanups.push(() => { try { db.close(); } catch { /* closed by persistence test */ } });
  let clock = Date.UTC(2026, 10, 15, 10);
  const app = createApp({ db, development, appOrigin: APP, runtime, now: () => clock });
  const call = async (path: string, method = 'GET', body?: unknown, token?: string, origin = APP) => {
    const response = await app.fetch(new Request(API + path, { method, headers: { Origin: origin, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) }));
    return { response, status: response.status, body: await response.json() };
  };
  const signIn = async () => (await call('/auth/development', 'POST', {})).body as { token: string; user: { id: string } };
  const start = async (token: string, lessonId = 'base-1') => (await call('/v1/attempts/start', 'POST', { lessonId, courseVersion: '1.0.0' }, token)).body as { id: string };
  const complete = (token: string, id: string, key = 'idempotent-key', actions: Action[] = solutions, extra = {}) => call(`/v1/attempts/${id}/complete`, 'POST', { courseVersion: '1.0.0', actions, idempotencyKey: key, ...extra }, token);
  return { db, app, call, signIn, start, complete, advance(ms: number) { clock += ms; } };
}

describe('progress API trust boundaries', () => {
  it('exposes a clearly named development provider only in development', async () => {
    const local = fixture();
    expect((await local.call('/v1/config')).body.providers).toEqual([{ id: 'development', name: 'Local development only', authorizeUrl: '/auth/development' }]);
    const production = fixture(':memory:', false);
    expect((await production.call('/v1/config')).body.providers).toEqual([]);
    expect((await production.call('/auth/development', 'POST', {})).status).toBe(404);
    expect((await production.call('/auth/github')).status).toBe(404);
  });

  it('requires authentication and rejects mutation origins without reflecting them', async () => {
    const f = fixture();
    expect((await f.call('/v1/me/progress')).status).toBe(401);
    const rejected = await f.call('/auth/development', 'POST', {}, undefined, 'https://attacker.example');
    expect(rejected.status).toBe(403);
    expect(rejected.response.headers.get('Access-Control-Allow-Origin')).toBeNull();
    expect(rejected.response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('uses opaque hashed sessions, revokes logout and recovers the same user on social sign-in', async () => {
    const f = fixture();
    const first = await f.signIn();
    const row = await f.db.get<{ token_hash: string }>('SELECT token_hash FROM sessions');
    expect(row?.token_hash).not.toBe(first.token);
    expect(row?.token_hash).toBe(await hash(first.token));
    expect((await f.call('/auth/logout', 'POST', undefined, first.token)).status).toBe(200);
    expect((await f.call('/v1/me', 'GET', undefined, first.token)).status).toBe(401);
    const second = await f.signIn();
    expect(second.user.id).toBe(first.user.id);
    expect(second.token).not.toBe(first.token);
    f.advance(31 * 60_000);
    expect((await f.call('/v1/me', 'GET', undefined, second.token)).status).toBe(401);
  });

  it('does not reveal attempts or progress belonging to another user', async () => {
    const f = fixture();
    const first = await f.signIn();
    const attempt = await f.start(first.token);
    await f.db.run('INSERT INTO users(id, provider, subject, display_name) VALUES (?, ?, ?, ?)', ['other-user', 'github', 'other-subject', 'Other']);
    await f.db.run('INSERT INTO sessions(token_hash, user_id, expires_ms) VALUES (?, ?, ?)', [await hash('other-token'), 'other-user', Date.UTC(2027, 0, 1)]);
    expect((await f.complete('other-token', attempt.id)).status).toBe(404);
    expect((await f.call('/v1/me/progress', 'GET', undefined, 'other-token')).body.completedLessons).toEqual([]);
  });

  it('replays actions and ignores client claims about score, completion and elapsed time', async () => {
    const f = fixture();
    const { token } = await f.signIn();
    const attempt = await f.start(token);
    f.advance(2500);
    expect((await f.complete(token, attempt.id, 'failed-key', [], { score: 999, elapsedMs: 0, completed: true })).status).toBe(422);
    const result = await f.complete(token, attempt.id, 'success-key', solutions, { score: 999, elapsedMs: 0, completed: true, visibility: { malformed: true } });
    expect(result.status).toBe(200);
    expect(result.body.result.score).toBe(100);
    expect(result.body.result.elapsedMs).toBe(2500);
    expect(result.body.visibility).toBeUndefined();
    expect((await f.complete(token, attempt.id, 'extra-action-key', [{ type: 'command', command: 'git status', flags: { complete: true } } as unknown as Action])).status).toBe(400);
  });

  it('returns the first result for idempotent retries and rejects changed payloads or keys', async () => {
    const f = fixture();
    const { token } = await f.signIn();
    const attempt = await f.start(token);
    f.advance(1000);
    const first = await f.complete(token, attempt.id);
    f.advance(5000);
    const retry = await f.complete(token, attempt.id);
    expect(retry.body.result).toEqual(first.body.result);
    expect((await f.complete(token, attempt.id, 'idempotent-key', [{ type: 'answer', questionId: 'check', value: 'no' }])).status).toBe(409);
    expect((await f.complete(token, attempt.id, 'different-key')).status).toBe(409);
    expect((await f.complete(token, attempt.id, 'idempotent-key', solutions, { visibility: {} })).status).toBe(409);
    const count = await f.db.get<{ count: number }>('SELECT COUNT(*) AS count FROM lesson_results');
    expect(count?.count).toBe(1);
  });

  it('handles concurrent starts and completion retries without duplicate progress', async () => {
    const f = fixture();
    const { token } = await f.signIn();
    const starts = await Promise.all([f.start(token), f.start(token)]);
    expect(starts[0].id).toBe(starts[1].id);
    const submissions = await Promise.all([f.complete(token, starts[0].id), f.complete(token, starts[0].id)]);
    expect(submissions.map(result => result.status)).toEqual([200, 200]);
    expect(submissions[0].body.result).toEqual(submissions[1].body.result);
    expect((await f.call('/v1/me/progress', 'GET', undefined, token)).body.completedLessons).toEqual(['base-1']);
  });

  it('unlocks tiers only after all twelve prior modules, preserves first results and hides leaderboard until opt-in', async () => {
    const f = fixture();
    const { token } = await f.signIn();
    expect((await f.call('/v1/attempts/start', 'POST', { lessonId: 'intermediate-1', courseVersion: '1.0.0' }, token)).status).toBe(403);
    for (let index = 1; index <= 12; index++) {
      const attempt = await f.start(token, `base-${index}`);
      f.advance(1000);
      expect((await f.complete(token, attempt.id, `completion-${index}`)).status).toBe(200);
    }
    const before = (await f.call('/v1/me/progress', 'GET', undefined, token)).body;
    expect(before.completions).toHaveLength(1);
    expect(before.completions[0]).toMatchObject({ tier: 'base', score: 1200, elapsedMs: 12_000 });
    expect(before.unlockedTiers).toEqual(['base', 'intermediate']);
    expect((await f.call('/v1/leaderboard?tier=base')).body.entries).toEqual([]);
    await f.call('/v1/me', 'PATCH', { alias: 'Learner 1', leaderboardOptIn: true }, token);
    expect((await f.call('/v1/leaderboard?tier=base')).body.entries[0]).toMatchObject({ rank: 1, alias: 'Learner 1', score: 1200, elapsedMs: 12000 });
    const repeated = await f.start(token);
    f.advance(2000);
    await f.complete(token, repeated.id, 'practice-repeat-key');
    const after = (await f.call('/v1/me/progress', 'GET', undefined, token)).body;
    expect(after.completions).toEqual(before.completions);
    expect(after.results).toEqual(before.results);
  });

  it('survives a service restart using SQLite rather than process memory', async () => {
    const folder = mkdtempSync(join(tmpdir(), 'git-course-api-'));
    cleanups.push(() => rmSync(folder, { recursive: true, force: true }));
    const path = join(folder, 'progress.sqlite');
    const first = fixture(path);
    const { token } = await first.signIn();
    const attempt = await first.start(token);
    await first.complete(token, attempt.id);
    first.db.close();
    const second = fixture(path);
    expect((await second.call('/v1/me/progress', 'GET', undefined, token)).body.completedLessons).toEqual(['base-1']);
  });

  it('consumes PKCE-bound handoff codes once and rejects incorrect verifiers', async () => {
    const f = fixture();
    const { user } = await f.signIn();
    const code = 'a'.repeat(43), verifier = 'b'.repeat(43), state = 'state-for-test';
    await f.db.run('INSERT INTO handoffs(code_hash, user_id, challenge, app_state, expires_ms) VALUES (?, ?, ?, ?, ?)', [await hash(code), user.id, await hash(verifier), state, Date.UTC(2027, 0, 1)]);
    expect((await f.call('/auth/exchange', 'POST', { code, codeVerifier: 'c'.repeat(43), state })).status).toBe(401);
    const exchanged = await f.call('/auth/exchange', 'POST', { code, codeVerifier: verifier, state });
    expect(exchanged.status).toBe(200);
    expect(exchanged.body.user.id).toBe(user.id);
    expect((await f.call('/auth/exchange', 'POST', { code, codeVerifier: verifier, state })).status).toBe(401);
  });
});

describe('optional visibility estimates', () => {
  it('aggregates disjoint states without changing official elapsed time or retaining the ledger', () => {
    expect(aggregateVisibility({ version: 1, coverage: 'complete', droppedEvents: 0, segments: [{ documentId: 'document-1', events: [
      { sequence: 1, offsetMs: 0, cause: 'start', visibility: 'visible', focused: true },
      { sequence: 2, offsetMs: 1000, cause: 'blur', visibility: 'visible', focused: false },
      { sequence: 3, offsetMs: 2000, cause: 'visibilitychange', visibility: 'hidden', focused: false },
      { sequence: 4, offsetMs: 5000, cause: 'complete', visibility: 'visible', focused: true },
    ] }] }, 5000)).toEqual({ focusedMs: 1000, hiddenMs: 3000, unfocusedMs: 1000, changes: 3, coverage: 'complete' });
  });
  it('ignores malformed, oversized, unordered or overlapping observation payloads', () => {
    expect(aggregateVisibility({ version: 1, coverage: 'complete', droppedEvents: 0, segments: [{ documentId: 'x', events: [{ sequence: 0, offsetMs: 2, cause: 'x', visibility: 'visible', focused: true }, { sequence: 1, offsetMs: 1, cause: 'x', visibility: 'visible', focused: true }] }] }, 10)).toBeUndefined();
    expect(aggregateVisibility({ version: 1, coverage: 'complete', droppedEvents: 0, segments: [{ documentId: 'x', events: Array.from({ length: 513 }, (_, sequence) => ({ sequence, offsetMs: sequence, cause: 'x', visibility: 'visible', focused: true })) }] }, 1000)).toBeUndefined();
  });
});
