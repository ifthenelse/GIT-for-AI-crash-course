import { describe, expect, it } from 'vitest';
import { getPublicMetadata, publicKinds, publicOrigin } from './publicMetadata';

describe('public page metadata', () => {
  it('gives every bilingual page a distinct title and description under the purchased brand', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    expect(publicOrigin).toBe('https://gitbydoing.com/');
    for (const locale of ['it', 'en'] as const) for (const kind of publicKinds) {
      const page = getPublicMetadata(locale, kind);
      expect(page.title).toContain('Git by doing');
      expect(titles.has(page.title)).toBe(false);
      expect(descriptions.has(page.description)).toBe(false);
      expect(page.description.length).toBeGreaterThan(100);
      expect(page.selected).toHaveLength(kind.startsWith('tier/') ? 12 : 36);
      titles.add(page.title); descriptions.add(page.description);
    }
    expect(titles.size).toBe(10);
    expect(descriptions.size).toBe(10);
  });
});
