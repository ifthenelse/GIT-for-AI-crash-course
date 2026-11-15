# Candidate technical roadmap

Development sequence for the public course only, updated November 15, 2026.
This is part of software design: it does not replace the consolidated GTM Plan,
which requires the skill's subsequent checkpoints. No committed date is possible
without assigned capacity and owners.

For maintenance after launch only, the user confirmed an initial budget of
1–2 hours per week. This is not an estimate of the work needed to build the
simulator or translate the full course before launch.

## Milestones and exit conditions

| Phase | Result ready for review | Condition for proceeding |
| --- | --- | --- |
| 0. Approval and spike | candidate dependencies, login proof across free domains, validator benchmark | minimum flow without third-party cookies and a load compatible with Free; no paid services |
| 1. Git core | pure state, subset parser, fixtures, Base commands and shared replay | comparison with real Git for supported cases; correct equivalent actions accepted |
| 2. Lab | synchronized terminal, DAG, editor and portal; adaptive window manager | keyboard/touch support, window stacking and recovery, undo/redo without changing layout or completions |
| 3. Progress and session | first social provider, server start/completion, idempotency and offline queue | reopening restores progress; the client alone cannot unlock tiers; official time remains distinct from estimates |
| 4. Course coverage | three levels, conflicts, PRs/policies, rollback, rebase, worktrees and final scenarios | every matrix topic has an explanation, action, success criterion and feedback |
| 5. IT/EN parity | complete lessons, exercises, hints, OS guides, errors, UI and accessible alternatives | no missing strings or lessons in either language; changing language preserves the scenario |
| 6. Identity and verification | transparent SVG in both themes, icons/social card, leaderboard, SEO and accessibility | audits of the rendered product, blocker fixes and data-recovery tests |
| 7. Public release | static artifact on Pages and verified free API | complete end-to-end flow, compatible quotas, approved publishing and tested rollback |

## Parallel work after approval

Subagents use separate worktrees: engine/replay; window manager and views;
API/session; bilingual content; visual identity and verification. The coordinator
integrates approved contracts and reviews. Two agents must never write to the
same working copy. API and engine first share a versioned action schema to
prevent divergence.

Content and translation can progress alongside the lab; publishing remains
blocked until all three levels have complete IT/EN parity. A review preview may
contain a declared subset, but must not be presented as the requested full launch.

## Proposed first-launch scope

Three levels and four windows; deterministic scenarios; IT/EN lessons and guides;
persistent progress, progressive tiers, educational leaderboard and server timer;
estimated pauses, local practice and recovery after errors; themes and SVG;
GitHub as the proposed first provider. No arbitrary Bash, paid broker, purchased
domain or inactive provider displayed as available.

Google, Microsoft and LinkedIn follow once prerequisites and free setup have been
verified. Apple remains excluded while adding it conflicts with zero cost.
Provider order is a recommendation for review, not a registration already performed.

## Dependencies and limits to resolve

- Measure authentication and the most expensive supported replays on the free
  runtime before relying on it. If they exceed the CPU budget, optimize or block
  the persistent launch; no automatic upgrade.
- Define scoring, attempts and time aggregation per tier before the final schema.
  Client pause estimates do not alter server duration.
- Test recovery and establish retention/account deletion.
- Confirm public name, licenses and feedback channel before publishing.
- Define a small pilot with people from the target audiences to validate
  understanding and transfer to a real repository, without inventing results.

## Readiness criterion

A user signs in with an enabled provider, completes a scenario, receives server
verification, closes the browser, returns and finds the completion retained;
repeating and undoing actions does not remove the acquired result. The same
flow works in both languages, across viewports and using the keyboard.
No step requires a purchase.

This document makes the work concrete for subsequent implementation approval;
it does not authorize dependencies, final schema, CI/CD, OAuth registrations,
pushing or deployment.
