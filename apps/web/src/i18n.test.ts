// @vitest-environment jsdom
import { expect, it } from 'vitest';
import { uiTranslations } from './i18n';
it('defines the same complete nonempty UI vocabulary in Italian and English', () => {
  expect(Object.keys(uiTranslations.it).sort()).toEqual(Object.keys(uiTranslations.en).sort());
  for (const locale of ['it', 'en'] as const) for (const [key, value] of Object.entries(uiTranslations[locale])) {
    expect(value.trim(), `${locale}:${key}`).not.toBe('');
    const placeholders = [...value.matchAll(/{{(\w+)}}/g)].map(x => x[1]).sort();
    const other = uiTranslations[locale === 'it' ? 'en' : 'it'][key];
    expect(placeholders).toEqual([...other.matchAll(/{{(\w+)}}/g)].map(x => x[1]).sort());
  }
});
