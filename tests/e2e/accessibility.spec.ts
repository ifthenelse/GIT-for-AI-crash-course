import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { openLesson, setLanguage } from './helpers';

for (const theme of ['light', 'dark'] as const) {
  for (const screen of ['home', 'laboratory', 'leaderboard'] as const) {
    test(`${screen} has no automated WCAG A/AA violations in ${theme} theme`, async ({ page }, testInfo) => {
      await page.goto('/');
      await setLanguage(page, 'en');
      if (theme === 'dark') await page.getByTestId('theme-toggle').click();
      if (screen === 'laboratory') await openLesson(page, 'B01');
      if (screen === 'leaderboard') await page.getByTestId('nav-leaderboard').click();
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      await testInfo.attach('axe-results', {
        body: JSON.stringify({ url: page.url(), theme, violations: result.violations, incomplete: result.incomplete }, null, 2),
        contentType: 'application/json',
      });
      expect(result.violations, 'Automated checks complement the separate keyboard flow; they do not certify WCAG conformity.').toEqual([]);
    });
  }
}
