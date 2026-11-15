# Operational procedures

The local implementation is available; no deployed services or validated public
release commands exist. Setup status and prerequisites are documented in
[deployment.md](../deployment.md).

Before release, document and test:

- Frontend/API deployment and rollback with version compatibility.
- Backup and recovery of progress and completions.
- Failed saves, retries, and offline-queue reconciliation.
- Exhausted quotas or validator CPU budget.
- Login failures, provider-credential rotation, and session revocation.
- User isolation and account deletion under approved rules.

Each procedure must identify its owner, prerequisites, steps, verification,
and recovery. Credentials belong in authorized services, not documentation.

## Local use and recovery

Start the API and Vite as described in README.md. The development database is
`.tmp/progress.sqlite`; the browser suite uses a different file and recreates it.
For a consistent local backup, stop the API, copy the database and any WAL/SHM
files, then restart and sign in again. The browser does not retain tokens;
a new sign-in retrieves the same user.

If a submission remains pending, keep the draft and restore connectivity or
API availability; use Retry sync. After session expiry, sign in again with
the same identity. Official duration includes the wait until valid receipt.
A result rejected for incomplete objectives requires finishing the scenario;
reset and undo do not erase results already confirmed.

Recover a window using the dock, overview, or Reset window layout. If local
layout data is corrupted, the component applies a preset within the viewport.
Git state remains separate from layout preferences.

Verification CI selects Node from `.node-version`, installs from the lockfile,
and checks types, tests, build, and static SEO; a separate job runs E2E and axe.
It does not deploy the site. The configuration has also been verified on
GitHub Actions with Node 26; details and the run link are in docs/testing.md.
