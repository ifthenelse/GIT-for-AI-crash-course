import { expect, test } from '@playwright/test';
import { openLesson } from './helpers';

test('paragraph illustrations adapt and desktop sidebar matches workspace height', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await openLesson(page, 'B01');
  const paragraphs = page.locator('.illustrated-concept>.lesson-prose');
  await expect(page.locator('.concept-illustration')).toHaveCount(await paragraphs.count());
  for (const width of [1440, 900, 761]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect.poll(async () => {
      const sidebar = await page.locator('.lesson-sidebar').boundingBox();
      const workspace = await page.locator('.lab-workspace').boundingBox();
      return Math.abs(sidebar!.height - workspace!.height);
    }).toBeLessThan(2);
  }
  await page.setViewportSize({ width: 320, height: 800 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
