# 0002. Public Git lab with server verification

- Status: accepted
- Date: 2026-11-15

## Context

The course must run primarily in the frontend, with three IT/EN tiers,
persistent progress, and an educational leaderboard. Zero service cost,
a public repository, and approval before publishing are binding constraints.

## Decision

The user approved local implementation of the scope in
`docs/analysis/implementation-proposal.md`: React/Vite/TypeScript,
Zustand/Zundo, i18next, a deterministic Git engine shared between UI and server,
stackable windows, and a verified final POST after a server-recorded start.
Completions are excluded from undoable history.

The frontend targets Pages; the service supports a free runtime and SQLite/D1.
Development and tests use an explicitly local simulated social provider;
real OAuth remains separately configurable, without local passwords.

## Alternatives considered

- Arbitrary Git and shell execution on the server: isolation and costs exceed scope.
- Browser-declared completions: insufficient for unlocking and server duration.
- Local-only state: does not provide authoritative persistence between sign-ins.

## Consequences

The supported subset requires differential checks against real Git, tests of
teaching solutions and replay, and browser/API/data checks. Publishing depends
on a free runtime, real configuration, three IT/EN tiers, and completed audits.
The test provider does not prove that real OAuth works correctly.
