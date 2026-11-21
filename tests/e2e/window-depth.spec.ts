import { expect, test } from '@playwright/test';
import { openLesson } from './helpers';

test('window activation updates depth and reduced motion disables layout animation', async ({ page }) => {
  await page.goto('/');
  await openLesson(page, 'B01');
  await page.getByTestId('dock-terminal').click();
  await expect(page.getByTestId('terminal-window')).toHaveClass(/is-active/);
  await expect(page.getByTestId('editor-window')).toHaveClass(/is-background/);
  await expect(page.getByTestId('terminal-window')).not.toHaveCSS('box-shadow', 'none');
  await page.getByTestId('dock-editor').click();
  await expect(page.getByTestId('editor-window')).toHaveClass(/is-active/);
  await expect(page.getByTestId('terminal-window')).toHaveClass(/is-background/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByTestId('editor-window')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('.lesson-introduction code').first()).toBeVisible();
});
