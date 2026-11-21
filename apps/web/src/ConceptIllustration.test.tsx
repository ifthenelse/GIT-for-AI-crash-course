import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { lessons } from '@gitcourse/content';
import { ConceptIllustration, illustrationKind } from './ConceptIllustration';
it('covers every lesson concept with a decorative theme-aware diagram', () => {
  expect(lessons).toHaveLength(36);
  const kinds = new Set<string>();
  for (const lesson of lessons) for (const concept of lesson.concepts) {
    const topic = `${concept.title.en} ${concept.body.en}`;
    kinds.add(illustrationKind(topic));
    const html = renderToStaticMarkup(<ConceptIllustration topic={topic} />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('viewBox="0 0 240 160"');
    expect(html).toContain('var(--accent-text)');
  }
  expect(kinds.size).toBe(7);
});
