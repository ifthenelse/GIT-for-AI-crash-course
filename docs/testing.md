# Local implementation verification

Environment: Node.js **24.22.1**, TypeScript 7, system Chromium **156**.
`.node-version` remains 26. GitHub Actions CI on Node 26 has also passed static
checks, tests, build/SEO, and all 16 browser scenarios:
[run 43713961150](https://github.com/ifthenelse/GIT-for-AI-crash-course/actions/runs/43713961150),
application commit `819cead`. The local measurements below still refer to Node 24.22.1.
No application test uses real credentials or creates cloud resources. CI defines
a browser job to repeat E2E/axe alongside static checks.

## Commands and scope

| Command | Checks |
| --- | --- |
| `scripts/verify` | Type checking and 63 unit/integration tests |
| `npm run build` | TypeScript, Vite, 10 static IT/EN pages |
| `npm run audit:seo` | Unique titles/descriptions, canonical links, hreflang, content, JSON-LD, images, and sitemap |
| `npm run test:e2e` | 20 scenarios: browser → local API → SQLite → response → UI; axe and keyboard checks |

Playwright starts the API on port 8788 and the frontend on 4173, uses the isolated
`.tmp/e2e.sqlite` database recreated by its setup, and detects `/usr/bin/chromium`.
In other environments, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` or install the
compatible Playwright browser. Browser CDN downloads were unavailable in this
session; the suite ran successfully with system Chromium. The development
database remains separate.

## Results and invariants

- Catalog: 36 modules, 12 per tier, complete IT/EN text, and an initially unmet
  objective. Every solution passes action by action and through replay without
  mutating its seed.
- Engine: selective staging, soft/mixed/hard reset, and merge/revert contents
  compared against real Git in temporary repositories. Conflicts, rebase,
  worktrees, undo/redo/reset, and hostile input checked; universal equivalence
  is not claimed.
- State: Zundo and the replay log agree; reset clears scenario history. In the
  browser, undo after a saved result does not revoke completion.
- API: resource ownership, tiers, versions, invented results, expiry/revocation,
  idempotency, concurrency, opt-in/opt-out, challenge, and single-use handoff.
- Real catalog through API/SQLite: all 36 final POSTs accepted, three 1,200-point
  tiers, progressive unlocking, and first durations preserved after repetition.
- Persistence: closing/reopening the store, signing in again, and refreshing
  recover results; an offline pending completion syncs on reconnection.
- UI: persistent language and theme, recoverable windows at 320 px, keyboard
  movement and resizing, overview, and consistent editor/staging/terminal/graph.
- Accessibility/SEO: [report with scope, evidence, and limitations](audits/README.md).

A build was also tested with base `/git-practice/` and the fixture canonical
`https://example.test/git-practice/`: ten pages without JS, the English course
and lab hydrated, with no asset 404s or page errors. This was not a public deployment.

Local engine-only microbenchmark: 720 solution replays (20×36), median about
0.13 ms, p95 about 0.86 ms, maximum about 2.29 ms. This excludes module startup,
authentication, API, database, and adversarial payloads: it **does not certify
the Worker Free budget** or justify activating public resources.

## Gates before launch

Real GitHub OAuth and navigation across origins with third-party cookies blocked;
D1/Worker runtime and CPU on worst supported cases; quotas and blocking without
charges; public backup/recovery, retention, and data deletion; a pilot with people
to check IT/EN comprehension and assistive technology. Google, Microsoft, and
LinkedIn are later phases; Apple remains disabled. Local tests do not cover
those services.

## Guided-course update — 16 November 2026

The curriculum now uses practical objectives instead of quiz answers. Sequential
lesson gates are verified at both attempt start and completion, including legacy
pending attempts. Browser coverage includes the skippable/restartable tour,
System appearance responding to OS changes, repeated course-card navigation and
scrolling, device-local guest progression, completion after reload, and a frozen
completion timer. The full 20-scenario browser suite includes six axe scans.

The native-dialog tour adds no dependency. Course labels are learner-facing copy;
existing tier IDs remain stable storage/API identifiers. Anonymous practice uses
a separate local record with no verified score and does not write API results.

Development and browser tests use separate Vite caches under `.tmp/vite-dev` and
`.tmp/vite-e2e`. This isolates dependency optimization when both servers run
concurrently. The tour's reload regression is included in the browser suite.

The calm-practice regression tests cover reading-only entry (no attempt POST),
explicit activation, an inert workspace, complete code-block clipboard payloads,
and the hidden practice clock's two-minute inactivity cap and interaction resume.
Clock unit tests cover restoration and stopped intervals. The existing server
elapsed-time and idempotent completion checks remain independent of local timing.
