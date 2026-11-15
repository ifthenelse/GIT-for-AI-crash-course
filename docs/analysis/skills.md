# Skill inventory and cleanup

Updated on 15 November 2026, based on the pull at `c723660`.
Initial inventory: 94 top-level directories and 101 SKILL.md files, including nested modules.
The user authorized removing unused skills.

## Retained local skills

| Skill | Use or required dependency |
| --- | --- |
| [cloudflare](../../.agents/skills/cloudflare/SKILL.md) | Free-service options for the API and storage |
| [copy-editing](../../.agents/skills/copy-editing/SKILL.md) | Review of Italian/English copy and messages |
| [copywriting](../../.agents/skills/copywriting/SKILL.md) | AI-tells reference required by Copy Editing |
| [find-skills](../../.agents/skills/find-skills/SKILL.md) | Discovery of missing skills |
| [grill-me](../../.agents/skills/grill-me/SKILL.md) | Wrapper for the requested technical interview |
| [seo-audit](../../.agents/skills/seo-audit/SKILL.md) | Method and plan for reviewing the product |

All required references of the six retained skills are preserved. Related skills
and alternative workflows are not mandatory dependencies. Skills and workflow
sessions unrelated to the independent public course were removed as its scope
was updated.

## Upstream skills consulted

The following skills were read from public sources. No upstream installer or
script was executed. Temporary copies are under `/tmp/git-course-skills/`, rather
than installed in this repository. On resuming, use the sources or separately
consider distributing only the necessary dependencies locally; do not restore
the removed catalog.

| Invocation | Source |
| --- | --- |
| `/system-design` | [Anthropic](https://github.com/anthropics/knowledge-work-plugins/blob/main/engineering/skills/system-design/SKILL.md) |
| `/gtm-planner:plan` and intake | [RevOps Studio](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/blob/main/skills/plan/SKILL.md) |
| market-map and market-researcher | [GTM package](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin) |
| positioning and pillar checks | [GTM positioning](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/tree/main/skills/positioning) |
| demand-plan and benchmark-researcher | [Demand plan](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/tree/main/skills/demand-plan) |
| roadmap and plan-qa | [GTM roadmap](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/tree/main/skills/roadmap) |
| deliverables and blueprint snapshot | [GTM document artifacts](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/tree/main/skills/deliverables) |
| `grilling`, a wrapper dependency | [Matt Pocock](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) |
| `/design`, brand and design-system | [Upstream design](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills) |
| `/accessibility-audit` and checklist | [Humbleteam](https://github.com/humbleteam/accessibility-audit) |

The design agent read ui-styling as a reference without introducing Tailwind/shadcn
or application dependencies. Accessibility review followed the Humbleteam method;
no AccessLint tool was installed. The GTM HTML documents follow the skill's design
and do not replace the application's visual identity.

SHA-256 fingerprints of the main consulted documents:

- `system-design/SKILL.md`: `8f28eca99f2208872fc2483fcc93326b628f4f73116e91309a95e05da86a0ab5`.
- `grilling/SKILL.md`: `a146842ed93ca43d833550fa9adf02e58cb63c83fea9d4b4522995b82242d4e2`.
- `gtm-planner/skills/plan/SKILL.md`: `a31e21211669e412009c7f67a926dc22925db89b6b64360ec1874daa1fed9533`.
- `gtm-planner/skills/intake/SKILL.md`: `c7ae028d11d54a722c26e056975c045456dfcee1e264dacb1e31e64cee030a01`.
- `gtm-planner/skills/market-map/SKILL.md`: `003157af202d4fd9a5ec377582e01c3c1f65960a13ef51fcbbef1930339a6ea7`.
- `gtm-planner/skills/deliverables/SKILL.md`: `58c6a01ffe1caa17a40355a06b9c52c9e244b2b13f70caa76df88c87fb362624`.
- `design/SKILL.md`: `e93fe3683b7fa18a9bfcd00c0dc6e12c6859be07b7bfe20145f96ea49b72da13`.
- `accessibility-audit/SKILL.md`: `8b9ec8e409e172d584ad0a34409c014e861658ca0eeaa54eb0b7a7ee20ed5205`.
- `gtm-planner/skills/positioning/SKILL.md`: `67a103f646a6d5b0cc4821ac96a1ecfbf52fbde3dbda76e093799792d43e1aa3`.

- `gtm-planner/skills/demand-plan/SKILL.md`: `3ac7e6c3e44cae1e1c8885168f78c17c5d6517daaf731dbe8038c6d87c268c11`.

- `gtm-planner/skills/roadmap/SKILL.md`: `9d04a92d6c26164ba198ebd5dcdd42c2dc167f03615472b6f2b2fdf76bfc48bf`.

## Checkpoints

GTM Plan requires: “Never chain two steps without a checkpoint.” The user confirmed
the snapshot, sources, market map, promise, messages and demand plan. The roadmap,
consolidated plan and local implementation scope were approved after plan QA.
Previously authorized free sources remain valid without requesting paid tools.
State is recorded in [.claude/gtm-planner.local.md](../../.claude/gtm-planner.local.md).

Grilling requires: “Do not act on it until the user confirms you have reached a shared understanding.”
The first-round answers are recorded; operational approval was a separate step.
Accessibility Audit forbids inventing an interface that does not exist. The
implemented product was reviewed after rendering; specifications alone were not
presented as evidence of conformance. See [the audit reports](../audits/README.md).

## Removals

Removed **88 directories** containing 1371 files, the two Wrangler symlinks, and
the root SKILL.md template. Current documentation retains no links to removed
local skills.

Removed directories:

`ab-testing`; `ad-creative`; `ads`; `agents-sdk`; `ai-seo`; `airunway-aks-setup`; `analytics`; `appinsights-instrumentation`; `aso`; `attribution`; `azure-ai`; `azure-aigateway`; `azure-app-onboard`; `azure-app-onboard-prereq`; `azure-cloud-migrate`; `azure-compliance`; `azure-compute`; `azure-deploy`; `azure-diagnostics`; `azure-enterprise-infra-planner`; `azure-kubernetes`; `azure-kusto`; `azure-messaging`; `azure-prepare`; `azure-quotas`; `azure-reliability`; `azure-resource-lookup`; `azure-resource-visualizer`; `azure-storage`; `azure-upgrade`; `azure-validate`; `churn-prevention`; `cloudflare-email-service`; `cloudflare-one`; `cloudflare-one-migrations`; `co-marketing`; `cold-email`; `community-marketing`; `competitor-profiling`; `competitors`; `content-strategy`; `cro`; `customer-research`; `directory-submissions`; `discover-azure-skills`; `domain-modeling`; `durable-objects`; `emails`; `entra-agent-id`; `entra-app-registration`; `events`; `free-tools`; `git-guardrails-claude-code`; `image`; `influencer-marketing`; `launch`; `lead-magnets`; `marketing-council`; `marketing-ideas`; `marketing-loops`; `marketing-plan`; `marketing-psychology`; `microsoft-foundry`; `offers`; `onboarding`; `paywalls`; `popups`; `pricing`; `product-marketing`; `programmatic-seo`; `prospecting`; `public-relations`; `python-appservice-deploy`; `referrals`; `revops`; `sales-enablement`; `schema`; `signup`; `site-architecture`; `sms`; `social`; `tdd`; `turnstile-spin`; `video`; `web-perf`; `wizard`; `workers-best-practices`; `wrangler`.

Original skills remain in Git history at `c723660`. The cleanup is committed in
[PR #2](https://github.com/ifthenelse/GIT-for-AI-crash-course/pull/2); the application
and its documentation are in [PR #3](https://github.com/ifthenelse/GIT-for-AI-crash-course/pull/3).
The cleanup did not change global skills or connected plugins.

## Local implementation

The roadmap, consolidated plan and local scope were approved on 15 November 2026.
Integration also applied the cloud skills `vercel:react-best-practices` (components,
deferred loading and listeners) and `vercel:verification`
(UI → API → SQLite → response → UI). No additional skills were installed locally.
