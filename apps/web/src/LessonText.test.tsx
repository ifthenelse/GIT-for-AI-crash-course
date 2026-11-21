import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
void i18next.use(initReactI18next).init({ lng: 'en', resources: {} });
import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LessonText } from './LessonText';
it('renders technical fragments as code and escapes markup', () => {
  const html = renderToStaticMarkup(<LessonText>{'Open catalog.json, run `git status` and inspect `git add catalog.json`. <script>'}</LessonText>);
  expect(html).toContain('<code>catalog.json</code>');
  expect(html).toContain('<code>git status</code>');
  expect(html).toContain('<code>git add catalog.json</code>');
  expect(html).toContain('&lt;script&gt;');
});

it('renders boxed code blocks and keyboard chords without interpreting HTML', () => {
  const html = renderToStaticMarkup(<LessonText>{'Press Ctrl+Enter. Variable `userName`.\n```bash\ngit add catalog.json\ngit status\n```'}</LessonText>);
  expect(html).toContain('<kbd>Ctrl+Enter</kbd>');
  expect(html).toContain('<code>userName</code>');
  expect(html).toContain('lesson-code-block');
  expect(html).toContain('git add catalog.json\ngit status');
  expect(html).toContain('<button');
});
