# Local product verification

Performed on 15 November 2026 using Node.js 24.22.1 and system Chromium 156.
The verification and browser CI jobs also passed on GitHub Actions using Node 26
([run](https://github.com/ifthenelse/GIT-for-AI-crash-course/actions/runs/43713961150)).
The evidence covers the code, build and test API, rather than a public service.

- [Visual identity](visual-identity.md): implemented palette, fonts and vector assets.
- [SEO](seo.md): ten prerendered pages, navigation and the Pages base path.
- [Accessibility](accessibility.md): review of markup, CSS and rendered states;
  axe scans and keyboard flows in both themes.
- [Copy editing](copy-editing.md): IT/EN review, terminology and status messages.
- [Technical results](../testing.md): catalog, engine, API, data, E2E tests and limitations.

Full Playwright reports are generated locally in `playwright-report/`, with axe
attachments and failure traces where applicable. Working screenshots are in
`.tmp/screenshots/`. These artifacts are not published automatically.
