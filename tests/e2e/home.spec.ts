import { expect, test } from '@playwright/test';
import { setLanguage, setTheme } from './helpers';

test('home changes language and theme while unavailable tiers stay locked', async ({ page }) => {
  await page.goto('/');
  await setLanguage(page, 'it');
  await setTheme(page, 'light');
  await expect(page.getByTestId('tier-base')).toBeEnabled();
  await expect(page.getByTestId('tier-intermediate')).toBeDisabled();
  await expect(page.getByTestId('tier-advanced')).toBeDisabled();

  const background = await page.locator('body').evaluate((node) => getComputedStyle(node).backgroundColor);
  await setTheme(page, 'dark');
  await expect.poll(() => page.locator('body').evaluate((node) => getComputedStyle(node).backgroundColor))
    .not.toBe(background);

  await setLanguage(page, 'en');
  await expect(page.getByTestId('tier-intermediate')).toContainText('Git collaboration');
  await expect(page.getByTestId('tier-advanced')).toContainText('Advanced Git and recovery');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('body')).not.toHaveCSS('background-color', background);
});

test('system theme follows operating system changes and explicit preferences override them', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await setTheme(page, 'system');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByTestId('theme-select')).toHaveValue('system');
  await setTheme(page, 'light');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.getByTestId('theme-select')).toHaveValue('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('secondary course action opens the curriculum and a course card scrolls to its lessons', async ({ page }) => {
  await page.goto('/');
  await setLanguage(page, 'en');
  await page.getByRole('link', { name: 'Browse the three courses', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/program\//);
  await expect(page.getByTestId('lesson-B01')).toBeEnabled();
  await expect(page.getByTestId('lesson-B02')).toBeDisabled();
  await page.getByTestId('tier-base').click();
  await expect(page).toHaveURL(/\/en\/tier\/base\//);
  const heading = page.locator('#course-base').getByRole('heading', { name: 'Git foundations', exact: true });
  await expect(heading).toBeInViewport();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await page.getByTestId('tier-base').click();
  await expect(page).toHaveURL(/\/en\/tier\/base\//);
  await expect(heading).toBeInViewport();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
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
