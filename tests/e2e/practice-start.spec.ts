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
