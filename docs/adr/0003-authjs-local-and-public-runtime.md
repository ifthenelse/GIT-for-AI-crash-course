# 0003. Auth.js for GitHub and application SQL adapters

- Status: accepted
- Date: 2026-11-15

## Decision

Use `@auth/core` from the candidates included in the local approval.
Auth.js handles GitHub OAuth with state and PKCE. The backend maintains a
provider/subject application identity and a short-lived opaque bearer token;
the cross-origin exchange uses a challenge and a single-use code. The provider
token stays in the backend.

The course uses its own SQL adapters for progress, sessions, and handoffs,
with one Fetch interface for Node/SQLite and Worker/D1. The intermediate
Auth.js session uses an encrypted JWT; the candidate Auth.js D1 adapter is
unnecessary and is not retained as a dependency. No second authentication
stack is installed.

## Consequences

Local tests cover the explicitly simulated development provider, authorization
boundaries, and single-use exchange. They do not demonstrate real GitHub login.
Before launch, a registered OAuth app, callbacks, CORS, and deployed origins must
be verified, along with the free plan's CPU budget. Other providers remain later
phases within the zero-cost constraint. Apple remains disabled.
