import { expect, test } from '@playwright/test';

test('brand and metadata follow navigation, locale and theme', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('.brand')).toHaveText('Git by doing');
  await expect(page).toHaveTitle('Learn Git with interactive exercises · Git by doing');
  await page.locator('.main-nav a').first().click();
  await expect(page).toHaveTitle('Git course curriculum · Git by doing');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/program\/$/);
  await page.getByTestId('tier-base').click();
  await expect(page).toHaveTitle('Git foundations · Git by doing');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/tier\/base\/$/);
  await page.locator('.main-nav a').first().click();
  await page.getByTestId('language-select').selectOption('it');
  await expect(page).toHaveTitle('Programma del corso Git · Git by doing');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Esplora il programma/);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'it_IT');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-it.png$/);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en\/program\/$/);
  const schema = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(schema!).inLanguage).toBe('it');
  expect(JSON.parse(schema!).provider.name).toBe('Git by doing');
  await page.getByTestId('theme-select').selectOption('dark');
  await expect(page.locator('.brand img')).toHaveAttribute('src', /logo-dark.svg$/);
  await page.setViewportSize({ width: 320, height: 720 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
