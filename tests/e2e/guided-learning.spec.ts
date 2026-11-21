import { expect, test } from '@playwright/test';
import { setLanguage, solveFirstLesson, startPractice } from './helpers';

test('the first lesson starts a skippable tour that can be restarted and completed', async ({ page }) => {
  await page.goto('/');
  await setLanguage(page, 'en');
  await page.getByRole('link', { name: 'Start learning', exact: true }).click();
  const tour = page.getByRole('dialog', { name: 'Read, then practise', exact: true });
  await expect(tour).toBeVisible();
  await tour.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Your practical task', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Skip tour', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByTestId('start-practice')).toBeVisible();
  await expect(page.getByRole('radio')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => {
    const explanation = document.querySelector('.lesson-introduction')!.getBoundingClientRect();
    const laboratory = document.querySelector('.lab-layout')!.getBoundingClientRect();
    return explanation.bottom <= laboratory.top;
  })).toBe(true);

  await page.getByRole('button', { name: 'Interface tour', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(tour).toBeVisible();
  for (let step = 0; step < 6; step++) {
    await page.getByRole('dialog').getByRole('button', { name: 'Next', exact: true }).click();
  }
  await expect(page.getByRole('dialog', { name: 'Keep moving', exact: true })).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Start the lesson', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.reload();
  await expect(page.getByTestId('terminal-input')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('guest practice unlocks only the next lesson and survives reload without a server completion', async ({ page }) => {
  await page.clock.install();
  const progressWrites: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('/v1/attempts/')) progressWrites.push(request.url());
  });
  await page.goto('/');
  await setLanguage(page, 'en');
  await page.getByRole('link', { name: 'Start learning', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Skip tour', exact: true }).click();
  const next = page.getByRole('button', { name: 'Next lesson', exact: true });
  await expect(next).toBeDisabled();
  await startPractice(page);
  await expect(page.locator('.objective-checkbox[aria-checked="false"]')).not.toHaveCount(0);
  await solveFirstLesson(page);
  await expect(page.locator('.objective-checkbox[aria-checked="false"]')).toHaveCount(0);
  await expect(page.getByTestId('exercise-submit')).toHaveClass(/is-ready/);
  await page.getByTestId('exercise-submit').click();
  await expect(page.getByTestId('completed-badge')).toBeVisible();
  await expect(page.getByText('Lesson completed on this device. Continue to the next lesson.', { exact: true })).toBeVisible();
  await page.clock.fastForward(5000);
  await expect(page.locator('.lab-time')).toHaveCount(0);
  await expect(next).toBeEnabled();
  await next.click();
  await expect(page).toHaveURL(/#\/lesson\/B02$/);
  await page.reload();
  await expect(page.getByTestId('exercise-submit')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next lesson', exact: true })).toBeDisabled();
  await page.getByRole('link', { name: 'Lesson list', exact: true }).first().click();
  await expect(page.getByTestId('lesson-B01')).toBeEnabled();
  await expect(page.getByTestId('lesson-B02')).toBeEnabled();
  await expect(page.getByTestId('lesson-B03')).toBeDisabled();
  expect(progressWrites).toEqual([]);
});
