import { expect, it } from 'vitest';
import { lessons } from '../../../packages/course-content/src/index.ts';
import { createApp } from './app.ts';
import { createSqliteDatabase } from './sqlite.ts';
it('verifies all36real scenarios, unlocks tiers and preserves first completions across opt-in', async () => {
  const db = createSqliteDatabase();
  let time = Date.UTC(2026, 10, 15);
  const app = createApp({
    db,
    development: true,
    appOrigin: 'http://localhost:5173',
    now: () => time
  });
  let token = '';
  const call = async (path: string, body?: unknown, method = body ? 'POST' : 'GET') => {
    const response = await app.fetch(new Request('http://localhost:8787' + path, {
      method,
      headers: {
        Origin: 'http://localhost:5173',
        ...(token ? {
          Authorization: `Bearer ${token}`
        } : {}),
        ...(body ? {
          'Content-Type': 'application/json'
        } : {})
      },
      ...(body ? {
        body: JSON.stringify(body)
      } : {})
    }));
    const data = await response.json();
    expect(response.status, JSON.stringify(data)).toBeLessThan(300);
    return data;
  };
  try {
    token = (await call('/auth/development', {})).token;
    for (const lesson of lessons) {
      time += 1000;
      const a = await call('/v1/attempts/start', {
        lessonId: lesson.id,
        courseVersion: '1.0.0'
      });
      time += 2000;
      const result = await call(`/v1/attempts/${a.id}/complete`, {
        courseVersion: '1.0.0',
        actions: lesson.solution,
        idempotencyKey: `solution-${lesson.id}`
      });
      expect(result.result.score).toBe(100);
      expect(result.result.elapsedMs).toBe(2000);
    }
    const p = await call('/v1/me/progress');
    expect(p.completedLessons).toHaveLength(36);
    expect(p.completions).toHaveLength(3);
    expect(p.unlockedTiers).toEqual(['base', 'intermediate', 'advanced']);
    for (const c of p.completions) {
      expect(c.score).toBe(1200);
      expect(c.elapsedMs).toBe(24000);
    }
    expect((await call('/v1/leaderboard?tier=advanced&courseVersion=1.0.0')).entries).toHaveLength(0);
    await call('/v1/me', {
      alias: 'Git learner',
      leaderboardOptIn: true
    }, 'PATCH');
    expect((await call('/v1/leaderboard?tier=advanced&courseVersion=1.0.0')).entries[0].alias).toBe('Git learner');
    const before = await call('/v1/me/progress');
    const a = await call('/v1/attempts/start', {
      lessonId: 'A12',
      courseVersion: '1.0.0'
    });
    time += 100;
    await call(`/v1/attempts/${a.id}/complete`, {
      courseVersion: '1.0.0',
      actions: lessons.at(-1)!.solution,
      idempotencyKey: 'repeat-final-scenario'
    });
    expect(await call('/v1/me/progress')).toEqual(before);
  } finally {
    db.close();
  }
});
