import { expect, type APIRequestContext, type Page } from '@playwright/test';
import { lessons } from '../../packages/course-content/src/index';
import { COURSE_VERSION } from '../../packages/contracts/src/index';

export const origin = 'http://127.0.0.1:4173';

export async function setLanguage(page: Page, language: 'it' | 'en') {
  await page.getByTestId('language-select').selectOption(language);
  await expect(page.locator('html')).toHaveAttribute('lang', language);
}

export async function loginDevelopment(page: Page): Promise<string> {
  if (!await page.getByTestId('login-development').isVisible()) {
    await page.getByRole('button', { name: /^(Accedi|Sign in)$/ }).click();
  }
  const response = page.waitForResponse((item) => item.url().endsWith('/auth/development')
    && item.request().method() === 'POST');
  await page.getByTestId('login-development').click();
  const result = await response;
  expect(result.ok(), 'development login must use the real local API').toBeTruthy();
  const session = await result.json() as { token: string };
  expect(session.token).toBeTruthy();
  return session.token;
}

export async function openLesson(page: Page, lessonId: string, options: { start?: boolean } = {}) {
  await page.getByTestId('tier-base').click();
  await page.getByTestId(`lesson-${lessonId}`).click();
  await expect(page.getByTestId('terminal-input')).toBeVisible();
  if (lessonId === 'B01') await skipTour(page);
  if (options.start !== false) await startPractice(page);
}

export async function startPractice(page: Page) {
  await page.getByTestId('start-exercise').click();
  await expect(page.locator('.practice-overlay')).toBeHidden();
}

export async function skipTour(page: Page) {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /^(Skip tour|Salta il tour)$/ }).click();
  await expect(dialog).toBeHidden();
}

export async function setTheme(page: Page, preference: 'light' | 'dark' | 'system') {
  await page.getByTestId('theme-select').selectOption(preference);
  await expect(page.getByTestId('theme-select')).toHaveValue(preference);
  if (preference !== 'system') await expect(page.locator('html')).toHaveAttribute('data-theme', preference);
}

export async function completePrerequisites(request: APIRequestContext, token: string, lessonId: string) {
  const target = lessons.findIndex((lesson) => lesson.id === lessonId);
  expect(target).toBeGreaterThanOrEqual(0);
  const existing = await progress(request, token);
  for (const lesson of lessons.slice(0, target)) {
    if (existing.completedLessons.includes(lesson.id)) continue;
    const started = await request.post('/v1/attempts/start', {
      headers: authorized(token), data: { lessonId: lesson.id, courseVersion: COURSE_VERSION },
    });
    expect(started.ok(), `start prerequisite ${lesson.id}`).toBeTruthy();
    const attempt = await started.json();
    const completed = await request.post(`/v1/attempts/${attempt.id}/complete`, {
      headers: authorized(token),
      data: { courseVersion: COURSE_VERSION, actions: lesson.solution, idempotencyKey: crypto.randomUUID() },
    });
    expect(completed.ok(), `verify prerequisite ${lesson.id} through the real API`).toBeTruthy();
  }
}

export async function editFile(page: Page, path: string, content: string) {
  await page.getByTestId('dock-editor').click();
  const editor = page.getByTestId('editor-window');
  await editor.getByRole('button', { name: new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }).click();
  await editor.getByTestId('editor-content').fill(content);
  await editor.getByTestId('editor-content').press('Tab');
}

export async function solveFirstLesson(page: Page) {
  await editFile(page, 'catalog.json', '{"items":["tea","coffee"]}\n');
  await command(page, 'git add catalog.json');
  await command(page, 'git commit -m "Record first catalog snapshot"');
  await page.getByTestId('dock-graph').click();
  await expect(page.getByTestId('graph-window')).toContainText('Record first catalog snapshot');
  await editFile(page, 'catalog.json', '{"items":["tea","coffee","draft"]}\n');
}

export async function command(page: Page, text: string) {
  await page.getByTestId('dock-terminal').click();
  const input = page.getByTestId('terminal-input');
  await input.fill(text);
  await input.press('Enter');
  await expect(input).toHaveValue('');
}

export function authorized(token: string) {
  return { Authorization: `Bearer ${token}`, Origin: origin };
}

export async function progress(request: APIRequestContext, token: string) {
  const response = await request.get('/v1/me/progress', { headers: authorized(token) });
  expect(response.ok()).toBeTruthy();
  return response.json() as Promise<{
    completedLessons: string[];
    completions: { tier: string; score: number }[];
    results: { lessonId: string; score: number; elapsedMs: number }[];
  }>;
}
