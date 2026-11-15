import { expect, type APIRequestContext, type Page } from '@playwright/test';

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

export async function openLesson(page: Page, lessonId: string) {
  await page.getByTestId('tier-base').click();
  await page.getByTestId(`lesson-${lessonId}`).click();
  await expect(page.getByTestId('terminal-input')).toBeVisible();
}

export async function command(page: Page, text: string) {
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
