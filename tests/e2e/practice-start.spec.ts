import { expect, test } from '@playwright/test';
import { loginDevelopment, openLesson, startPractice } from './helpers';

test('reading does not start an attempt and the workspace stays inert until practice starts', async ({ page }) => {
  await page.goto('/');
  await loginDevelopment(page);
  const starts: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && request.url().endsWith('/v1/attempts/start')) starts.push(request.url());
  });
  await openLesson(page, 'B01', { start: false });
  await expect(page.getByTestId('start-exercise')).toBeVisible();
  await expect(page.locator('.lab-time')).toHaveCount(0);
  expect(starts).toHaveLength(0);
  const editor = page.getByTestId('editor-content');
  await expect.poll(() => editor.evaluate(element => !!element.closest('[inert]'))).toBe(true);
  const started = page.waitForResponse(response => response.url().endsWith('/v1/attempts/start') && response.request().method() === 'POST');
  await startPractice(page);
  expect((await started).ok()).toBe(true);
  expect(starts).toHaveLength(1);
  await expect.poll(() => editor.evaluate(element => !!element.closest('[inert]'))).toBe(false);
  await expect(page.locator('.lab-time')).toHaveCount(0);
});

test('exercise code blocks copy their full content', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (value: string) => { (window as unknown as { copiedCode: string }).copiedCode = value; },
    } });
  });
  await page.goto('/');
  await openLesson(page, 'B01', { start: false });
  const block = page.locator('.task-card .lesson-code-block').first();
  const expected = await block.locator('pre code').textContent();
  expect(expected).toBeTruthy();
  await block.getByRole('button').click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { copiedCode: string }).copiedCode)).toBe(expected);
  await expect(block.locator('pre code')).toHaveCSS('font-family', /JetBrains/);
});

test('hidden practice timing caps inactivity and resumes on interaction', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await openLesson(page, 'B01');
  const storedTime = () => page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('gitcourse-drafts');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    return await new Promise<number>((resolve, reject) => {
      const request = db.transaction('records', 'readonly').objectStore('records').getAll();
      request.onsuccess = () => resolve(request.result.find((record: { key: string }) => record.key.startsWith('draft:guest:'))?.value.activePracticeMs ?? 0);
      request.onerror = () => reject(request.error);
    });
  });
  await page.clock.fastForward(180_000);
  await page.getByTestId('dock-terminal').click();
  await page.getByTestId('terminal-input').fill('git status');
  await page.getByTestId('terminal-input').press('Enter');
  await page.clock.runFor(200);
  await expect.poll(storedTime).toBeGreaterThanOrEqual(120_000);
  expect(await storedTime()).toBeLessThan(121_000);
  await page.clock.runFor(5_000);
  await page.getByTestId('terminal-input').fill('git status');
  await page.getByTestId('terminal-input').press('Enter');
  await page.clock.runFor(200);
  await expect.poll(storedTime).toBeGreaterThan(124_000);
  expect(await storedTime()).toBeLessThan(127_000);
  await expect(page.locator('.lab-time')).toHaveCount(0);
});
