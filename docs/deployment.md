# Public hosting at zero cost

Status: analysis updated on November 15, 2026. This repository contains only the
independent public course. Local implementation is approved and available.
No public service, OAuth registration, or deployment pipeline has been configured.

## Cost constraint

**Service cost must remain strictly zero.** Do not introduce paid plans, expiring
trials, mandatory domain purchases, or resources that could incur charges.
Free quotas limit the service: once exhausted, online availability and features
are reduced, without automatic upgrades. Local practice and pending submissions
must not be presented as server-confirmed saves.

The repository is public and the connected account has administrator access.
The reported Pro plan is not visible through the connector and is not required
by this proposal: Pages for public repositories is also available on GitHub Free.

## Technical proposal

Static frontend on GitHub Pages; Cloudflare Workers Free for the API and OAuth
callbacks; D1 Free for application identities, attempts, and progress. No
commercial identity broker is required. The code includes a Worker entrypoint
and a D1 adapter. This choice remains subject to benchmarks and verification
of current terms and account quotas during authorized setup.

| Component | Verified free limit | Release condition |
| --- | --- | --- |
| GitHub Pages | Static site; 1 GB published and a soft bandwidth limit of 100 GB/month | Build, base path, direct navigation, and callbacks verified |
| Workers Free | 100,000 requests/day, 10 ms CPU per request | Measured replay and authentication stay within the limits |
| D1 Free | 5 million rows read/day, 100,000 written/day, 5 GB total per account | Also verify the single-database limit, indexes, and other account usage |
| Identity | Providers introduced in phases | Free registrations and consent verified; buttons shown only when functional |
| Domain | Free default domains | No domain purchase required |

The current Cloudflare skill specifies `cf` for a new project; no Wrangler
configuration has been created. Confirm the toolchain during setup using
current documentation, without installing a CLI for this analysis.

## Phased social providers

This sequence is approved for local preparation; real configuration is separate:

1. **GitHub at launch:** OAuth app, public profile, and stable ID. Login alone
   must not request repository scopes or private email; provider tokens and
   secrets stay in the backend.
2. **Google:** Expand access after configuring a client and consent for identity
   only, without paid cloud services.
3. **Microsoft and LinkedIn:** After verifying accounts, registrations, consent,
   and availability of the free login product. Microsoft social login does not
   require deploying cloud compute.
4. **Apple:** Disabled and excluded from launch. The developer program can have
   a cost and web login has specific prerequisites; do not activate subscriptions.
   Introduce it only if a future path meets the zero-cost constraint.

There is no registration through passwords, email links, or local credentials.
Each social identity creates or retrieves its user; linking providers requires
an explicit authenticated flow. Environment variables enable providers that
have already been configured; they do not create OAuth apps or approvals.

## Sessions across free domains

`github.io` and `workers.dev` are cross-site: CORS does not remove third-party
cookie restrictions. A spike is required before release: backend callback,
single-use application code bound to a PKCE challenge, a short-lived application
token in memory, and renewal through top-level navigation, using a maintained
library compatible with the runtime. The GitHub token is never returned to the
frontend. Do not store bearer tokens in localStorage or send them in URLs.
A paid domain must not be the mandatory solution.

Frontend configuration contains the API URL and public identifiers; backend
configuration contains secrets and credentials for enabled providers only.
`VITE_*` variables are public. Confirm privacy, exact redirect URIs, and allowed
origins in each environment; do not use wildcards for authenticated data.

## Publishing and data

After approval: build with Vite using the repository base path; prerender the
home, curriculum, and tier pages in IT/EN; use Pages-compatible routing for the
lab. Verify refreshes, deep links, language switching, and login on the deployed
site. Pages does not automatically apply another provider's headers: verify
which protections are actually available. Keep secrets out of bundles and workflows.

Start and completion each generate requests; break observations travel only in
the final POST, without continuous heartbeats. Caching the aggregated leaderboard,
indexed queries, payload and replay limits, and rate limits avoid wasted resources.
Before release, verify quotas and actual behavior when limits are reached;
do not infer them from the Free label alone.

New exercises do not erase permanent completions. Storage capacity remains
finite: backup/export and recovery must be tested without introducing paid
storage. Do not use a public repository or Issues as a backup for personal data.
Maintenance exports must remain outside Git.

## Gates and recovery

Do not launch persistent services until login → exercise → verification → save
→ reopening passes on the free services. If load exceeds the budget, optimize
or restrict usage and delay launch; do not introduce an implicit charge.

After approved checks, promotion requires a known artifact and smoke tests.
Frontend/API rollback must use compatible engine and data versions; database
recovery is a separate procedure. This document does not authorize a push or deploy.

## Sources

- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Workers Free](https://developers.cloudflare.com/workers/platform/limits/) and [pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [D1](https://developers.cloudflare.com/d1/platform/pricing/)
- [GitHub OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) and [scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
- [Google Identity](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
- [Microsoft app registrations](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
- [LinkedIn OIDC](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)
- [Apple Developer Program](https://developer.apple.com/programs/whats-included/) and [web login](https://developer.apple.com/help/account/capabilities/configure-sign-in-with-apple-for-the-web/)

## Available local configuration

`.env.example` lists the actual names: `APP_ORIGIN`, `ALLOW_ORIGINS`, `PORT`,
`DATABASE_PATH`, `VITE_API_URL`, `AUTH_SECRET`, `GITHUB_CLIENT_ID`, and
`GITHUB_CLIENT_SECRET`. The API process reads `.env`; Vite exposes only `VITE_*`.
The simulated local provider is disabled with `NODE_ENV=production`; the Worker
entrypoint always disables it. Register this GitHub callback with the provider:
`https://<api-origin>/auth/callback/github`.

Prepare a Pages build without publishing it:

```bash
PUBLIC_BASE_PATH=/repository-name/ SITE_URL=https://account.github.io/repository-name/ npm run build
```

Set `VITE_API_URL` to the origin of the configured API. The URLs above are
documentation placeholders. `dist/` contains 10 IT/EN pages, assets, a sitemap,
and robots.txt. Lab navigation uses hashes compatible with static hosting.
A build without `SITE_URL` uses localhost and is intentionally excluded from crawlers.

The `services/progress-api/src/worker.ts` entrypoint requires the `DB` binding,
`APP_ORIGIN`, allowed origins, and secrets for active providers. Apply the schema
exported by `database.ts` before starting it. This implementation has not
configured a CLI, public binding, secret, or deployment workflow.

Local storage: `.tmp/progress.sqlite`, plus WAL and SHM files when present.
Stop the server before copying these files to obtain a consistent development
backup. Tests use temporary databases and verify closing and reopening them.
Production D1 recovery will need a dedicated procedure and test.

## GitHub variables and secrets: repository configuration

Repository: `ifthenelse/GIT-for-AI-crash-course`. Under **Settings → Secrets and
variables → Actions → Variables**, prepare:

| Name | Value |
| --- | --- |
| `PUBLIC_BASE_PATH` | `/` |
| `SITE_URL` | `https://gitbydoing.com/` |
| `VITE_API_URL` | Actual HTTPS Worker origin, without a trailing `/v1` or `/auth` |

The CI workflow reads these variables for the build only. If they are unset,
it produces the local preview excluded from indexing. Adding them only to a
`.env` file does not necessarily set `PUBLIC_BASE_PATH` for vite.config.ts or
`SITE_URL` for the Node prerender process: use process environment variables,
as in the workflow or the inline command above.

**The current CI does not require GitHub Actions secrets.** GitHub provides
`GITHUB_TOKEN` automatically; do not create a PAT or a secret with that name.
The workflow also runs E2E/axe with Chromium, but does not deploy Pages or
Cloudflare. Creating the three variables neither publishes the site nor
configures the backend.

The following settings belong in the **Cloudflare Worker runtime** once the
public environment has been authorized and prepared:

| Type | Name | Value |
| --- | --- | --- |
| Variable | `APP_ORIGIN` | `https://gitbydoing.com/` |
| Variable | `ALLOW_ORIGINS` | `https://gitbydoing.com` |
| Variable | `GITHUB_CLIENT_ID` | Client ID of the registered GitHub OAuth app |
| Secret | `GITHUB_CLIENT_SECRET` | OAuth app client secret |
| Secret | `AUTH_SECRET` | Strong random value, for example 32 random bytes encoded as base64 |
| D1 binding | `DB` | Database with the schema applied |

`APP_ORIGIN` includes the repository path and trailing slash: it is the OAuth
return destination. `ALLOW_ORIGINS` contains the origin without a path: it
authorizes browser requests. OAuth secrets must never become `VITE_*` variables
or appear in the Pages build. Generate `AUTH_SECRET` locally with
`openssl rand -base64 32` and save it directly in the Worker's secret store,
without pasting it into chat or Git.

In the GitHub OAuth App, set Homepage URL to `SITE_URL` above and Authorization
callback URL to `https://<api-origin>/auth/callback/github`. The callback belongs
to the backend; the client ID is neither a personal GitHub token nor the numeric
account ID. Google, Microsoft, and LinkedIn have no operational environment
variables in this version; Apple remains disabled. Do not create secrets for
providers that have not been implemented.

Current workflows do not consume `CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_ACCOUNT_ID`.
They will be needed only if automated deployment is introduced; permissions
and names will be defined with that workflow. A future Pages deployment using
official actions can use the automatically provided token with specific
permissions; there is no need to prepare a general-purpose PAT in advance.

## Purchased public domain

The product is Git by doing and the purchased domain is `gitbydoing.com`.
Use `PUBLIC_BASE_PATH=/ SITE_URL=https://gitbydoing.com/ npm run build` for
the public artifact. Domain ownership does not establish a working deployment.
Cloudflare Registrar manages registration; Cloudflare One is an access and
network security product. DNS, Pages custom-domain setup, HTTPS, and redirects
from www to the apex must be verified in the live account before launch.
Public course pages must remain accessible to unauthenticated visitors and crawlers.
