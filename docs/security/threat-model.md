# Trust boundaries and controls

Local status as of November 15, 2026. Automated checks cover the boundaries
listed below; public configuration and the real GitHub provider have not yet
been tested.

| Asset / boundary | Implemented control | Evidence | Remaining limitation |
| --- | --- | --- | --- |
| Results, browser → API | Replay with a server seed, objectives, attempt ownership, tier, and version | API unit/integration tests, real catalog, tampering E2E | Solutions and automation remain possible; the leaderboard is educational |
| Completions, API → DB | Atomic batches, idempotency, unique constraints, and preservation of the first successful result | Concurrency, identical/changed retries, repetition, and SQLite reopening | D1 runtime and public recovery remain untested |
| Identity, provider → API | Auth.js GitHub with state and PKCE; provider/subject identity, no email linking | Local handoff with challenge, state, expiry, and single use | Real GitHub OAuth requires credentials and integrated verification |
| Sessions | Short-lived opaque bearer, hash in the DB, frontend memory only, logout revocation | Expiry/revocation tests; no client bearer persistence | XSS can act as the user on the page; Pages headers need verification |
| User data | Ownership checked before operating on an attempt | Two-user fixture and non-disclosing response | New APIs will require the same checks |
| Breaks | Ledger limits, only aggregates retained, no effect on ranking | Malformed-ledger and server-timing tests | Estimates can be manipulated or incomplete |
| Resources | Action/file/commit/body limits and per-instance rate limiter | Rejected-payload and command tests | Global limiting and Worker Free CPU must be measured |
| Secrets | Backend env; VITE contains only a public URL; provider token excluded from the client | Code inspection and secret-free example env | Recheck real configuration and final bundle at deployment |
| Leaderboard | Alias and explicit consent; no public email or ledger | Opt-in/opt-out and real-course tests | Retention and account deletion required before launch |
| Computer | No subprocesses in the app; allowlisted fictional commands/hooks/SSH | Shell-injection, traversal, and immutable-object tests | Users can deliberately run OS guides on their own computers |

IndexedDB drafts and local layout remain on the device, separated by identity
and version. Logout revokes the session and does not present itself as deletion
of local data or the account. The local database is excluded from Git.

Before publishing, define and test retention, deletion requests, backup/recovery,
and free-service limits. State immutability does not promise unlimited retention
or certify protection against cheating.
