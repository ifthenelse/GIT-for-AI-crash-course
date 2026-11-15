import { expect, test } from '@playwright/test';
import { command, loginDevelopment, openLesson, progress, setLanguage } from './helpers';

test('a quiz is verified by the server and survives browser reload and a new login', async ({ page }) => {
  await page.goto('/');
  const token = await loginDevelopment(page);
  await openLesson(page, 'B01');
  await setLanguage(page, 'en');
  await page.getByRole('radio', { name: 'A recorded snapshot with metadata and links to parents.' }).check();
  const saved = page.waitForResponse((response) => response.url().includes('/complete')
    && response.request().method() === 'POST');
  await page.getByTestId('exercise-submit').click();
  const response = await saved;
  expect(response.ok()).toBeTruthy();
  const completion = await response.json();
  expect(completion.result.score).toBe(100);
  expect(completion.progress.completedLessons).toContain('B01');
  await expect(page.getByTestId('completed-badge')).toBeVisible();
  const first = (await progress(page.request, token)).results.find((item) => item.lessonId === 'B01');
  expect(first).toBeTruthy();

  await page.reload();
  const nextToken = await loginDevelopment(page);
  const restored = await progress(page.request, nextToken);
  expect(restored.completedLessons).toContain('B01');
  expect(restored.results.find((item) => item.lessonId === 'B01')).toEqual(first);
});

test('editor, staging, terminal and graph agree; undo cannot revoke a saved completion', async ({ page }) => {
  await page.goto('/');
  const token = await loginDevelopment(page);
  await openLesson(page, 'B07');
  const editor = page.getByTestId('editor-content');
  await expect(editor).toHaveValue(/Catalog introduction corrected\./);
  await editor.fill('# Git Practice Lab\nCatalog introduction corrected.\nEdited in the laboratory.\n');
  await command(page, 'git diff');
  await expect(page.getByTestId('terminal-output')).toContainText('Edited in the laboratory.');
  await command(page, 'git add README.md');
  await command(page, 'git diff --staged');
  await expect(page.getByTestId('terminal-output')).toContainText('Edited in the laboratory.');
  await command(page, 'git commit -m "Fix catalog introduction"');
  await expect(page.getByTestId('graph-window')).toContainText('Fix catalog introduction');

  const saved = page.waitForResponse((response) => response.url().includes('/complete')
    && response.request().method() === 'POST');
  await page.getByTestId('exercise-submit').click();
  expect((await saved).ok()).toBeTruthy();
  await expect(page.getByTestId('completed-badge')).toBeVisible();
  const before = await progress(page.request, token);
  expect(before.completedLessons).toContain('B07');

  await page.getByTestId('undo').click();
  await expect(page.getByTestId('graph-window')).not.toContainText('Fix catalog introduction');
  await expect(page.getByTestId('completed-badge')).toBeVisible();
  await page.getByTestId('redo').click();
  await expect(page.getByTestId('graph-window')).toContainText('Fix catalog introduction');
  expect(await progress(page.request, token)).toEqual(before);
  await command(page, 'git status');
  await expect(page.getByTestId('terminal-output')).toContainText('notes.txt');
});

test('windows are recoverable from the keyboard on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');
  await openLesson(page, 'B01');
  for (const name of ['terminal', 'graph', 'editor', 'portal']) {
    const dock = page.getByTestId(`dock-${name}`);
    await dock.focus();
    await page.keyboard.press('Enter');
    const panel = page.getByTestId(`${name}-window`);
    await expect(panel).toBeVisible();
    const minimize = page.getByTestId(`minimize-${name}`);
    await minimize.focus();
    await page.keyboard.press('Enter');
    await expect(panel).toBeHidden();
    await expect(dock).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(panel).toBeVisible();
  }
  await page.getByTestId('layout-reset').click();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByTestId('dock-terminal').click();
  await page.getByTestId('maximize-terminal').click();
  await expect(page.getByTestId('terminal-input')).toBeVisible();
  await page.getByTestId('terminal-input').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('terminal-input')).not.toBeFocused();
});
