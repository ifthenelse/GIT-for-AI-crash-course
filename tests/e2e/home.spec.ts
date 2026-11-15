import { expect, test } from '@playwright/test';
import { setLanguage } from './helpers';

test('home changes language and theme while unavailable tiers stay locked', async ({ page }) => {
  await page.goto('/');
  await setLanguage(page, 'it');
  await expect(page.getByTestId('tier-base')).toBeEnabled();
  await expect(page.getByTestId('tier-intermediate')).toBeDisabled();
  await expect(page.getByTestId('tier-advanced')).toBeDisabled();

  const background = await page.locator('body').evaluate((node) => getComputedStyle(node).backgroundColor);
  await page.getByTestId('theme-toggle').click();
  await expect.poll(() => page.locator('body').evaluate((node) => getComputedStyle(node).backgroundColor))
    .not.toBe(background);

  await setLanguage(page, 'en');
  await expect(page.getByTestId('tier-intermediate')).toContainText('Intermediate');
  await expect(page.getByTestId('tier-advanced')).toContainText('Advanced');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('body')).not.toHaveCSS('background-color', background);
});

test('home remains usable at 320 CSS pixels and through keyboard navigation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(320);
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toBeVisible();
  await expect(focused).not.toHaveJSProperty('tagName', 'BODY');
  await page.getByTestId('tier-base').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('lesson-B01')).toBeVisible();
});
