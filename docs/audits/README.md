# Verifiche del prodotto locale

Eseguite il 15 novembre 2026 su Node.js 24.22.1 e Chromium di sistema 156.
Anche i job CI di verifica e browser sono passati su GitHub Actions con Node 26
([run](https://github.com/ifthenelse/GIT-for-AI-crash-course/actions/runs/43713961150)).
Le evidenze riguardano codice, build e API di prova; non un servizio pubblico.

- [Identità visiva](visual-identity.md): palette effettiva, font e asset vettoriali.
- [SEO](seo.md): dieci pagine prerenderizzate, navigazione e base path Pages.
- [Accessibilità](accessibility.md): revisione di markup, CSS e stati renderizzati;
  axe e percorsi da tastiera nei due temi.
- [Testi](copy-editing.md): revisione IT/EN, terminologia e comunicazione dello stato.
- [Risultati tecnici](../testing.md): catalogo, motore, API, dati, E2E e limiti.

I report Playwright completi sono generati localmente in `playwright-report/`,
con allegati axe e trace degli errori quando presenti. Screenshot di lavoro in
`.tmp/screenshots/`. Questi artefatti non vengono pubblicati automaticamente.
