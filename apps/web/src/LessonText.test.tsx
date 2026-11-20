import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LessonText } from './LessonText';
it('renders technical fragments as code and escapes markup', () => {
  const html = renderToStaticMarkup(<LessonText>{'Open catalog.json, run git status and inspect `git add catalog.json`. <script>'}</LessonText>);
  expect(html).toContain('<code>catalog.json</code>');
  expect(html).toContain('<code>git status</code>');
  expect(html).toContain('<code>git add catalog.json</code>');
  expect(html).toContain('&lt;script&gt;');
});
