import { expect, test } from '@playwright/test';
import { authorized, loginDevelopment, origin, progress } from './helpers';

test('API refuses anonymous writes, locked tiers and a fabricated completion', async ({ page }) => {
  await page.goto('/');
  const anonymous = await page.request.post('/v1/attempts/start', {
    headers: { Origin: origin }, data: { lessonId: 'B01', courseVersion: '1.0.0' },
  });
  expect(anonymous.status()).toBe(401);
  const token = await loginDevelopment(page);
  const headers = authorized(token);
  const locked = await page.request.post('/v1/attempts/start', {
    headers, data: { lessonId: 'M01', courseVersion: '1.0.0' },
  });
  expect(locked.status()).toBe(403);

  const started = await page.request.post('/v1/attempts/start', {
    headers, data: { lessonId: 'B12', courseVersion: '1.0.0' },
  });
  expect(started.ok()).toBeTruthy();
  const attempt = await started.json();
  const rejected = await page.request.post(`/v1/attempts/${attempt.id}/complete`, {
    headers,
    data: { courseVersion: '1.0.0', actions: [], idempotencyKey: 'fabricated-browser-attempt', score: 1200, elapsedMs: 1 },
  });
  expect(rejected.status()).toBeGreaterThanOrEqual(400);
  expect(rejected.status()).toBeLessThan(500);
  expect((await progress(page.request, token)).completedLessons).not.toContain('B12');
  const leaderboard = await page.request.get('/v1/leaderboard?tier=base&courseVersion=1.0.0');
  expect(leaderboard.ok()).toBeTruthy();
  expect((await leaderboard.json()).entries).toEqual([]);
});
