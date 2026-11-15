# Proposed implementation scope

Status: scope approved on November 15, 2026, for local implementation.
The text below retains the concrete scope approved for review; current status
and verification evidence are in README.md and docs/testing.md.

## Local implementation outcome

Independent public course with three levels and 36 modules, all complete in
Italian and English. Four synchronized, accessible windows: simulated Bash
terminal, Git DAG, lightweight editor and GitHub/Azure DevOps portal. A window
manager supports stacking, reordering and recovery through a dock/overview,
including on small viewports.

Immutable state with Zustand, Zundo history limited to the scenario, persistent
drafts and pending submissions. API with server-side start, replay, idempotent
completion POST, completions unaffected by undo/reset and an educational
leaderboard. Official timer separate from visibility/focus and estimated pauses.
Proposed first provider: GitHub.

Visual identity with light/dark themes, an original transparent SVG logo for both
themes, icons and social card; reviewed copy, prerendered IT/EN public pages,
SEO/accessibility checks on the implemented product and fixes for identified issues.

## Candidate dependencies included in scope

| Area | Proposed packages | Purpose |
| --- | --- | --- |
| Frontend | `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`, `@types/node` | static application, types and build |
| State | `zustand`, `zundo` | store and selective history |
| Languages | `i18next`, `react-i18next` | IT/EN interface and content |
| Local verification | `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@playwright/test`, `@axe-core/playwright` | invariants, interactions and browser/accessibility flows |
| Test API runtime | `@cloudflare/vitest-pool-workers`, `@cloudflare/workers-types`, if compatible with the free toolchain | service tests without production resources |
| SSO | candidate `better-auth` with `drizzle-orm`, or `@auth/core` with `@auth/d1-adapter` | compare during the spike; maintain only one stack and justify the choice in an ADR |

If a candidate needs another adapter, state its name and rationale before adding
it. No paid authentication platforms. Use compatible stable versions verified
during setup and a package-manager-generated lockfile; no manual lockfile updates.
The terminal, graph and editor may start with custom accessible components,
without mandatory heavy dependencies.

Sources for SSO candidates: [Better Auth](https://better-auth.com/docs/installation),
[Auth.js](https://authjs.dev/), [D1 adapter](https://authjs.dev/getting-started/adapters/d1).
Documentation alone does not prove cross-site flow compatibility or CPU budget:
both need a spike. Do not install two SSO stacks in production.

## Initial technical verification and conditions for continuing

1. Establish the versioned action schema and a first representative scenario.
2. Verify login/handoff across origins, in-memory tokens, PKCE challenges and
   blocked third-party cookies, using a local test provider first.
3. Run replay and service tests in the candidate runtime, measuring the most
   expensive supported cases. Local testing does not certify production usage:
   measurements on the configured free service are required before publishing.
4. If feasibility or compatibility fails, fix or revise the implementation within
   zero cost and record the blocker. Do not substitute local-only storage or a
   paid upgrade without an explicit decision.

Only the test provider belongs in local automated tests. Real login requires a
configured OAuth registration and a subsequent integration check; do not claim
it was verified by a mock alone.

## Initial leaderboard rules: a simple proposal

- 100 points for each completed, verified exercise; 0 for an incomplete exercise.
  A tier of 12 modules has a maximum of 1,200 points. These are proposed rules,
  not benchmarks or measured results.
- All correct equivalent paths receive the same points; no penalties for extra
  commands, hints, accessibility or switching windows.
- The leaderboard for completed tiers sorts by points descending, then duration
  ascending. Full completion yields the same points by design: time distinguishes
  results, without any promise of anti-cheat certification.
- Tier duration is the sum of official times from the first successful completion
  of each exercise. Each time runs from server start to the first valid completion;
  it excludes other attempts. Show this definition in the interface.
- Repeats support practice and may have separate personal results; they do not
  rewrite the completion or result of the first successful finish.
- Separate leaderboards by course/rule version; public alias requires explicit
  opt-in. Pause and focus estimates are not public leaderboard data.

This choice prioritizes verifiability and simplicity. It is included as a proposal
ready for review; the final contract must match the approved rules.

## Data: rules before schema

Identity uses a stable provider/subject, without automatic linking by email.
Authorize each attempt and progress record on the server. Completion is append-only
per user/tier/version; a new version does not erase historical results. No migration
to future versions or equivalence of unlocks is invented now.

Retain pause aggregates and coverage; discard the raw ledger after computation,
without keeping it for diagnostics in the initial release. Define limits and
deletion for replay and drafts with the schema. Account deletion removes identity
and personal progress, must not be described as a simple exercise reset and
requires explicit confirmation in the product.
Document retention, backup and effective deletion before release.

## Organization and verification

Candidate structure: `apps/web` for the interface, `packages/git-engine` for the
shared engine, `packages/course-content` for scenarios and translations,
`services/progress-api` for the service. At this proposal stage, this was a
scaffold proposal, not a structure already created in the repository.

Subagents use separate worktrees: engine/replay, window manager and views,
API/SSO, IT/EN content, identity and verification. The coordinator integrates
contracts, tests and documentation. Do not automatically assign unconfirmed human roles.

`scripts/verify` must become a real check of types, code and tests.
Required checks: engine comparison with real Git; undo/completions;
idempotency/offline/reopening; authorization; all windows by keyboard;
themes and IT/EN; SEO/accessibility audits of the rendered product; and data recovery.

## Publishing as a separate step

Approval of local implementation permits building and verifying the result.
Real OAuth registrations, cloud resources, secrets, deployment CI, pushing/PRs
and publishing require their specific scope before execution. They are not
implicitly authorized by confirming a GTM document.
Public launch remains subject to zero cost and the readiness criteria.
