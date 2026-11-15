# Confirmed decisions and remaining checkpoints

Updated with the user's answers from November 15, 2026. Interview method:
the local `/grill-me` wrapper and its upstream `grilling` dependency; sources
are listed in [skills.md](skills.md).

## First round: answers received

| Topic | Decision |
| --- | --- |
| Scope | independent public course only, open to everyone, with a public repository; this release has the highest priority |
| Engine | simulator entirely in the browser, with optional guides for the user's own computer |
| Duration | server start and elapsed time; visibility/focus events to estimate pauses and interruptions |
| Cost | strictly zero; social providers may be introduced in phases |
| Fourth view | GitHub/Azure DevOps portal with PRs, policies, forks and releases |
| Windows | on desktop and small viewports, windows must stack, reorder and be recoverable like a window manager |
| Languages | complete Italian and English at launch |
| GTM research | free public sources only; no invented traffic or paid services |
| Category | alternatives map and “visual Git collaboration lab” direction confirmed |
| Positioning | IT/EN promise and messaging confirmed; learning benefits still require validation |
| Post-launch maintenance | initial budget of 1–2 hours per week, separate from initial development and translation |
| Distribution | three free growth engines and their priorities confirmed; at most three initial channels |

Decisions outside the public scope are excluded from this repository's documents
and local files. These answers supersede the first draft's assumptions.

## Technical recommendations ready for review

- Keep official server time separate from estimated study time; no penalties for
  switching browser tabs/windows or moving between panels.
- Listen to `document.visibilitychange`; treat `window.blur/focus` as a separate
  signal; handle lifecycle events and unobserved gaps explicitly.
- Introduce GitHub as the first social login, followed by providers with free registrations.
- Use Pages + Workers/D1 Free only after benchmarking and checking quotas;
  no implicit paid upgrade.
- Keep local layout separate from Git/Zundo state and confirmed progress.

At the proposal stage, these were implementation details for review, not
already approved code.

## Next GTM checkpoint

The snapshot and [alternatives map](../../gtm-plan/02-market-map.md) are confirmed.
The chosen category is **visual Git collaboration lab**. Other tools also offer
simulation and graphs: those features alone do not establish uniqueness or
learning effectiveness. [Positioning](../../gtm-plan/03-positioning.md) is
confirmed, with its three unverified pillars explicitly retained. The
[demand plan](../../gtm-plan/04-demand-plan.md) is also confirmed.

The next checkpoint in the original sequence was approval of the
[roadmap](roadmap.md) and [consolidated GTM Plan](gtm-plan.md), proposed after QA.
The [implementation scope](implementation-proposal.md) sets out the result,
dependencies and leaderboard rules approved for local work on November 15, 2026.

## Subsequent decisions

- Public name and code/content licenses before publishing.
- Scoring, time aggregation and repeat attempts: a simple proposal is now included
  in the implementation scope; at this checkpoint, it awaited approval with local work.
- Owners for development, translation, learning-content review and maintenance;
  initial capacity is needed before committing to a date. The post-launch
  maintenance budget is already confirmed: 1–2 hours per week.
- Retention, account deletion and treatment of course versions.

These are product/governance decisions. Technical facts available from sources
remain the responsibility of the analysis and should not be asked of the user again.

## Approval of implementation

Request approval of the concrete scope before app work, dependencies, contracts,
CI/CD or service setup. Confirming a snapshot or GTM map does not authorize
implementation, spending, OAuth registrations, pushing or deployment.

## Implementation update

Local scope and dependencies were approved on November 15, 2026.
Implemented decisions are recorded in ADR 0002 and docs/architecture.md.
Checkpoints for real services and publishing remain separate.
