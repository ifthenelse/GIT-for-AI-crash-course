# Inventario delle skill e pulizia

Verifica aggiornata al 15 novembre 2026, base del pull `c723660`.
Inventario iniziale: 94 directory top-level e 101 SKILL.md con i moduli annidati.
La cancellazione delle skill inutilizzate è autorizzata dall'utente.

## Skill locali conservate

| Skill | Uso o dipendenza necessaria |
| --- | --- |
| [cloudflare](../../.agents/skills/cloudflare/SKILL.md) | scelta dei servizi gratuiti per API e archivio |
| [copy-editing](../../.agents/skills/copy-editing/SKILL.md) | revisione dei testi e dei messaggi IT/EN |
| [copywriting](../../.agents/skills/copywriting/SKILL.md) | riferimento ai-tells richiesto da Copy Editing |
| [find-skills](../../.agents/skills/find-skills/SKILL.md) | ricerca delle skill mancanti |
| [grill-me](../../.agents/skills/grill-me/SKILL.md) | wrapper dell’intervista tecnica richiesta |
| [seo-audit](../../.agents/skills/seo-audit/SKILL.md) | metodo e piano della verifica sul prodotto |

Sono conservati tutti i riferimenti delle sei skill rimaste. I Related e i workflow
alternativi non sono dipendenze obbligatorie. Skill e sessioni di workflow non
pertinenti al corso pubblico sono state rimosse con l'aggiornamento del perimetro.

## Skill upstream consultate

Le skill seguenti sono state lette presso le fonti pubbliche. Nessun installer o
script upstream è stato eseguito. Le copie temporanee sono in
`/tmp/git-course-skills/`, non installate nella repository. Alla ripresa usare le
fonti oppure valutare separatamente la distribuzione locale delle sole dipendenze
necessarie; non ripristinare il catalogo eliminato.

| Invocazione | Fonte |
| --- | --- |
| `/system-design` | [Anthropic](https://github.com/anthropics/knowledge-work-plugins/blob/main/engineering/skills/system-design/SKILL.md) |
| `/gtm-planner:plan` e intake | [RevOps Studio](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/blob/main/skills/plan/SKILL.md) |
| market-map e market-researcher | [pacchetto GTM](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin) |
| positioning e test dei pilastri | [posizionamento GTM](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/tree/main/skills/positioning) |
| demand-plan e benchmark-researcher | [piano di diffusione GTM](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/tree/main/skills/demand-plan) |
| roadmap e plan-qa | [roadmap GTM](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/tree/main/skills/roadmap) |
| deliverables e blueprint snapshot | [artefatti documentali GTM](https://github.com/RevOps-Studio/claude-cowork-gtm-planner-plugin/tree/main/skills/deliverables) |
| `grilling`, dipendenza del wrapper | [Matt Pocock](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) |
| `/design`, brand e design-system | [upstream design](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills) |
| `/accessibility-audit` e checklist | [Humbleteam](https://github.com/humbleteam/accessibility-audit) |

Il sottoagente di design ha letto ui-styling come riferimento, senza introdurre
Tailwind/shadcn o dipendenze applicative. Per l'accessibilità è stato usato il
metodo Humbleteam; nessuno strumento AccessLint è stato installato. Il documento
HTML GTM segue il design della skill; non sostituisce l'identità visiva dell'app.

Impronte SHA-256 dei documenti principali consultati:

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

## Checkpoint

GTM Plan prescrive «Never chain two steps without a checkpoint.» Snapshot, fonti
e mappa sono confermati dall'utente, come promessa, messaggi e piano di diffusione.
Roadmap, consolidato e perimetro locale sono approvati dopo plan-qa. Le fonti
gratuite già autorizzate rimangono valide senza nuove richieste di strumenti a pagamento.
Stato in [.claude/gtm-planner.local.md](../../.claude/gtm-planner.local.md).

Grilling: «Do not act on it until the user confirms you have reached a shared understanding.»
Le risposte del primo round sono registrate; l'approvazione operativa resta distinta.
Accessibility Audit vieta di inventare un'interfaccia assente: gli audit saranno
eseguiti sul prodotto renderizzato, senza dichiarare conformità da una specifica.

## Rimozioni

Rimosse **88 directory**, con 1371 file al loro interno.
Rimossi i due symlink Wrangler e il template SKILL.md alla radice. Nessun
collegamento a skill locale eliminata è conservato nella documentazione corrente.

Directory rimosse:

`ab-testing`; `ad-creative`; `ads`; `agents-sdk`; `ai-seo`; `airunway-aks-setup`; `analytics`; `appinsights-instrumentation`; `aso`; `attribution`; `azure-ai`; `azure-aigateway`; `azure-app-onboard`; `azure-app-onboard-prereq`; `azure-cloud-migrate`; `azure-compliance`; `azure-compute`; `azure-deploy`; `azure-diagnostics`; `azure-enterprise-infra-planner`; `azure-kubernetes`; `azure-kusto`; `azure-messaging`; `azure-prepare`; `azure-quotas`; `azure-reliability`; `azure-resource-lookup`; `azure-resource-visualizer`; `azure-storage`; `azure-upgrade`; `azure-validate`; `churn-prevention`; `cloudflare-email-service`; `cloudflare-one`; `cloudflare-one-migrations`; `co-marketing`; `cold-email`; `community-marketing`; `competitor-profiling`; `competitors`; `content-strategy`; `cro`; `customer-research`; `directory-submissions`; `discover-azure-skills`; `domain-modeling`; `durable-objects`; `emails`; `entra-agent-id`; `entra-app-registration`; `events`; `free-tools`; `git-guardrails-claude-code`; `image`; `influencer-marketing`; `launch`; `lead-magnets`; `marketing-council`; `marketing-ideas`; `marketing-loops`; `marketing-plan`; `marketing-psychology`; `microsoft-foundry`; `offers`; `onboarding`; `paywalls`; `popups`; `pricing`; `product-marketing`; `programmatic-seo`; `prospecting`; `public-relations`; `python-appservice-deploy`; `referrals`; `revops`; `sales-enablement`; `schema`; `signup`; `site-architecture`; `sms`; `social`; `tdd`; `turnstile-spin`; `video`; `web-perf`; `wizard`; `workers-best-practices`; `wrangler`.

Gli originali delle skill restano nella storia Git al commit c723660. Rimozioni
e documentazione sono modifiche locali non committate; nessun push o PR.
La pulizia non ha modificato skill globali o plugin collegati.

## Implementazione locale

Roadmap e consolidato sono stati approvati il 15 novembre 2026, insieme al
perimetro locale. Durante l'integrazione sono state applicate anche le skill
cloud `vercel:react-best-practices` (componenti, caricamento differito e listener)
e `vercel:verification` (UI → API → SQLite → risposta → UI). Non sono state
installate ulteriori skill nella repository.
