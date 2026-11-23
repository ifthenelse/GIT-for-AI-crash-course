# Delivery system

## Architecture and ownership

Owner: @ifthenelse. Retain GitHub Pages for the static bilingual frontend at
https://gitbydoing.com/ and Cloudflare Workers Free plus D1 Free for the progress
API. GitHub Actions is the release orchestrator; do not add a second automatic
Cloudflare build trigger that can publish before GitHub checks finish.

## Branching and enforcement

Use main as the single integration branch. Create short-lived feat/, fix/ or
chore/ branches, open a pull request, resolve review conversations, and pass
verify and browser checks on an up-to-date branch. Squash merge using a
Conventional Commit subject. No develop or permanent release branches.
The solo maintainer can merge their own PR after checks; no second reviewer is
required. CODEOWNERS identifies ownership without claiming independent review.

The active main-quality-gate ruleset blocks deletion and force pushes, requires
PRs, linear history and successful verify/browser checks. No bypass actors.
The canonical configuration is main-ruleset.json. Inspect existing rulesets
before applying changes; do not repeatedly POST duplicate rulesets.

## Build and production release

CI runs type checking, unit tests, build, static SEO audit and browser tests.
The frontend artifact is retained for seven days. Fork PRs never receive deploy
credentials. The Deploy frontend workflow is manually dispatched on main only;
it repeats all release checks before uploading and publishing the artifact.
Production deployment uses the production GitHub environment and protected
branches. No application data is modified by frontend deployment.

PUBLIC_BASE_PATH=/ and SITE_URL=https://gitbydoing.com/ are public build values.
VITE_API_URL must be the verified production API origin. Never put tokens in
VITE_ variables. Production OAuth and D1 readiness remain launch gates; do not
advertise verified progress while the API is unavailable.

## Cloudflare connection: blocked, not deployed

Wrangler 4.166.0 is globally available under fnm. Its stored authentication is
expired; whoami cannot refresh it in the non-interactive environment. Authenticate
in an interactive terminal using wrangler login, or configure an account-scoped
CI API token securely. Do not paste token values into chat or commit them.

After authentication, inspect accounts, zones, Workers, D1 and existing routes
before provisioning. Select the account owning gitbydoing.com. Verify the Free
plan and account quotas. Create isolated staging and production databases and
Worker bindings; neither environment may use the other's DB. Record real IDs,
not fabricated placeholders. The application requires DB, APP_ORIGIN,
ALLOW_ORIGINS, AUTH_SECRET and, for social login, GITHUB_CLIENT_ID and
GITHUB_CLIENT_SECRET. The runtime sets development=false and does not initialize
schema automatically: migrations are a separate explicitly verified operation.

Configure environment-scoped CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID for
API deployment only after the target resources and token scopes are known.
Add a pinned CLI and Worker deployment workflow then, with a staging smoke test
before production promotion. No secrets, database resources or Worker routes
were created during the unauthenticated setup.

## Domain, recovery and verification

Enable GitHub Pages Actions publishing, bind gitbydoing.com, configure the
Cloudflare DNS records for Pages and require HTTPS after certificate issuance.
Verify apex/www redirect behavior, all ten localized public URLs, canonical and
hreflang links, social images, robots and sitemap on the deployed site.

Recover frontend code by dispatching a release from a reviewed revert on main.
Worker rollback does not restore D1 data. Back up D1 and verify restoration
before enabling persistent progress. Do not automatically revert database
migrations on a failed application deployment.

## Implementation status

Remote rules and repository settings are independently verified after writes.
Workflow files must be reviewed and merged before they run on main. This document
is not evidence of deployment, live OAuth, D1 migration or domain connectivity.
Local verification: scripts/verify, production build and audit:seo. Cloudflare
smoke tests remain blocked by authentication. No performance SLA is invented.

References: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
and https://developers.cloudflare.com/d1/configuration/environments/.
