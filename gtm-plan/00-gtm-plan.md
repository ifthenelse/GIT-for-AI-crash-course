# GTM Plan — GIT-for-AI-crash-course
*Go2Rev methodology · 15 November 2026 · Approved by the user*

All five steps are confirmed; the roadmap and consolidation were approved after
the cross-document [plan-qa](../docs/analysis/plan-qa.md) check. This document does not
claim completed implementation or authorize publication, outreach, or services.

## 1. Executive summary

The independent public course is positioned as a **visual Git collaboration lab**.
Confirmed promise, IT: «Collabora con Git sapendo cosa cambia e come recuperare
il lavoro.» EN: “Collaborate with Git knowing what changes and how to recover
your work.” The path connects changes, commits, review, policies, and recovery
through three complete tiers in Italian and English.

Confirmed distribution uses three engines: useful scenarios for discovery,
a worked example for choosing/starting the course, and voluntary feedback for
correcting the path. Zero-cost services, at most three initial channels, and
post-launch maintenance of 1–2 hours/week are constraints, not effectiveness
forecasts.

The first 90 days organize six initiatives dependent on capacity and evidence:
feasibility, representative case, private review, complete release candidate,
authorized release, and first maintenance cycle. The schedule is indicative;
if time or evidence is insufficient, release moves. Do not reduce tiers or
languages or buy a plan to bypass blockers.

## 2. Business snapshot

Public project at the analysis stage, from a public repository. Participants:
Engineers, Architects, and business professionals with practical technical
experience; no stated geographic restriction. Access without a sales process
or required payment. No baseline for traffic, starts, or learning is available.

Frontend planned on Pages; React/Vite, TypeScript, Zustand/Zundo, and i18next;
free external API for identity, validation, and progress. Social SSO in phases,
with GitHub proposed first. Complete Italian and English content is a launch
requirement.

Andrea Collet owns the repository; this does not automatically assign operational
roles. Initial capacity and owners remain undefined; 1–2 hours/week is confirmed
only after launch. Full text: [snapshot](01-business-snapshot.md).

## 3. Market map

Three layers of alternatives: interactive simulators; real-platform practice and
technical references; mentoring or research when a problem occurs. Choice
frequencies and market shares are unknown.

- [LearnGitBranching](https://github.com/pcottle/learnGitBranching): graph, sandbox,
  levels, and commands in the browser. Visualizing Git alone does not demonstrate
  how the course differs.
- [Oh My Git!](https://ohmygit.org/): game with visualized structures and real Git;
  advertised desktop path and stated limited maintenance. These do not prove
  inferior quality.
- [GitHub Skills](https://github.com/skills): exercises in the participant's
  repository and platform feedback, an alternative based on real practice.
- [Microsoft Learn](https://learn.microsoft.com/en-us/training/modules/intro-to-git/)
  and [Azure Repos](https://learn.microsoft.com/en-us/azure/devops/repos/git/?view=azure-devops):
  training and documentation on concepts, PRs, and policies, with distinct
  prerequisites and resources.
- [Pro Git](https://git-scm.com/book/en/v2): progressive reference on basics,
  workflows, and internals; the Italian edition shows uneven translation
  according to the page consulted.

Qualitative axes: simulation/real practice; mental model/collaboration;
exercise/reference. The course's position is designed, not measured.
**GAP HYPOTHESIS:** follow an incident from file to policy; explain recovery
through visible consequences. Relevance, an unclaimed position, and feasibility
are unproven. [Complete map and sources](02-market-map.md).

## 4. Positioning

Excerpt from confirmed positioning; `unverified-claim` labels remain.

### 2. Category decision

Qualitative comparison of directions from the [confirmed map](02-market-map.md).
Market size and demand are unmeasured; no numerical scores are invented.

| Candidate category | Observable space and competition | Fit and appeal |
| --- | --- | --- |
| Visual Git collaboration lab, confirmed choice | Connects commands and shared work; overlaps with simulators and real practice. | Consistent with designed scenarios; audience appeal needs validation. |
| Git recovery practice lab | Narrower need; alternatives already cover recovery and conflicts. | Covers part of the curriculum; risks appearing useful only during an incident. |
| Practical IT/EN path | Size unknown; languages and progression do not demonstrate exclusivity. | Fits requirements; relevance needs testing in both languages. |

The choice requires explaining collaboration and consequences beyond syntax,
distinguishing simulation from real operations, and evaluating learning.
Existing resources remain useful alternatives and possible further reading.

### 3. Core promise

**IT:** «Collabora con Git sapendo cosa cambia e come recuperare il lavoro.»

**EN:** “Collaborate with Git knowing what changes and how to recover your work.”

**Fallback IT:** «Scegli come collaborare e recuperare con Git, vedendo cosa cambia nella repository.»

**Fallback EN:** “Choose how to collaborate and recover with Git, seeing what changes in the repository.”

The promise concerns independence and understanding and matches the specified
scenarios. It becomes a demonstrated capability only after unguided tests on new
problems. A project page must clearly state that the course is being designed,
without describing the outcome as already available.

### 4. Pillars

#### P1 — From file to review

- Candidate claim: connect a change to its effects on history and shared review.
- Relevant: plausible for the stated audiences; no direct evidence is available yet.
- Differentiated: hypothesis against LearnGitBranching's graph emphasis and GitHub Skills' real-work emphasis; no exclusivity demonstrated.
- Defensible: not yet passed; synchronized views are specified, without observable implementation.
- Evidence needed: working scenario and a participant who can explain files, index, commits, and PRs. Status: `unverified-claim P1`.

#### P2 — The same problem, two contexts

- Candidate claim: recognize common Git principles and operational differences between GitHub and Azure DevOps.
- Relevant: consistent with the audience; frequency of the need is unknown.
- Differentiated: hypothesis against paths emphasizing one platform; uniqueness unestablished.
- Defensible: not yet passed; coverage is a requirement, not an implemented capability.
- Evidence needed: corresponding scenarios verified against sources and independent transfer between contexts. Status: `unverified-claim P2`.

#### P3 — Reasoned recovery

- Candidate claim: choose a recovery strategy and explain its effect on shared work.
- Relevant: plausible need to validate.
- Differentiated: alternatives already cover conflicts and recovery; the hypothesis concerns evaluating the reasoning.
- Defensible: not yet passed; simulator and learning results are unavailable.
- Evidence needed: rubrics evaluating choice, consequences, and preservation of others' work in a new incident. Status: `unverified-claim P3`.

None of these candidates is presented as a validated pillar. Confirming the
messaging architecture does not mean passing the pillar test.

### 5. Segment translations

| Audience | Translation of the same promise | Emphasis and vocabulary |
| --- | --- | --- |
| Engineers | IT: «Integra modifiche e recupera comprendendo la storia condivisa.» EN: “Integrate changes and recover with an understanding of shared history.” | P1/P3; branch, diff, commit, conflict. |
| Architects | IT: «Valuta integrazione e recupero comprendendone gli effetti sulla collaborazione.» EN: “Evaluate integration and recovery by understanding their effects on collaboration.” | P2/P3; policy, shared history, integration, rollback. |
| Business professionals with technical experience | IT: «Collabora sulle modifiche e recupera una versione comprendendo il lavoro del gruppo.» EN: “Collaborate on changes and recover a version while understanding the group's work.” | P1/P3; change, review, version, restore. |

These are translations of one product and promise. Vocabulary and depth change
with the participant's context.

### 6. Messages per funnel stage

Discovery → choice → start, without assuming a sale. These are candidate messages
for when the product is available, rather than descriptions of its current state.

| Stage | Main message | Variants |
| --- | --- | --- |
| Discovery | IT: «Un laboratorio visuale per collaborare con Git.» EN: “A visual lab for collaborating with Git.” | IT: «Dalla modifica alla pull request: comprendi cosa cambia.» EN: “From change to pull request: understand what changes.” / IT: «Esplora le conseguenze delle decisioni Git.» EN: “Explore the consequences of Git decisions.” |
| Choice | IT: «Segui lo stesso scenario tra file, commit e revisione.» EN: “Follow one scenario through files, commits, and review.” | IT: «Confronta le decisioni su GitHub e Azure DevOps.» EN: “Compare decisions on GitHub and Azure DevOps.” / IT: «Guarda il percorso: basi, collaborazione e recupero.» EN: “Explore the path: basics, collaboration, and recovery.” |
| Start | IT: «Inizia dal livello Base, in italiano o inglese.» EN: “Start at the Base tier, in Italian or English.” | IT: «Accedi con un provider disponibile e avvia il primo esercizio.» EN: “Sign in with an available provider and start your first exercise.” / IT: «Riprendi dall'ultimo progresso salvato.» EN: “Resume from your last saved progress.” |

### 7. Anti-messages bank

**Wording to avoid:** IT: «Git per tutti», «soluzione completa», «impara senza
fatica», «diventa esperto rapidamente». EN equivalents: “Git for everyone”,
“complete solution”, “learn effortlessly”, “become an expert quickly”. Replace
these with a specific action or outcome from the path, without generic promises
or unverified time claims.

**Frames not to imitate:** visualization as the exclusive promise of
[LearnGitBranching](https://github.com/pcottle/learnGitBranching), learning GitHub
inside GitHub as the frame of [GitHub Skills](https://github.com/skills), and a
game with real Git as the frame of [Oh My Git!](https://ohmygit.org/).

**Unsupported claims:** IT: «riduce gli errori», «garantisce autonomia», «più
efficace», «accessibile a tutti». EN equivalents: “reduces errors”, “guarantees
independence”, “more effective”, “accessible to everyone”. These respectively
require observed results, transfer tests, appropriate comparisons, and
accessibility checks. Do not use them as facts; they remain `unverified-claim`.

### 8. What this changes tomorrow

Headline during design, IT: «Un laboratorio visuale di collaborazione con Git,
in progettazione.» EN: “A visual Git collaboration lab, currently in design.”
Subheading, IT: «Scenari su GitHub e Azure DevOps per comprendere modifiche,
revisioni e recupero. Percorso previsto in italiano e inglese.» EN: “Scenarios
on GitHub and Azure DevOps to understand changes, review, and recovery.
A path planned in Italian and English.”

The presentation explains the need, scenario, and consequences to understand,
distinguishing design from demonstrated capability. Suitable themes: review,
conflicts, recovery, and operational differences. A leaderboard as evidence of
competence or the internal stack as an educational benefit does not support
the positioning. The demand plan must respect free services, no paid campaigns,
and the confirmed post-launch maintenance budget of 1–2 hours/week.

## 5. Demand plan

Consolidated from the confirmed demand plan, without new forecasts.

### Starting point

No baseline for visits, starts, completions, or learning is available.
Strictly zero service cost, an independent public course, three tiers, and
complete Italian/English content at launch are confirmed. Social providers may
be introduced in phases consistent with the budget constraint.

An example used in a private project review is not a partial launch. This plan
does not execute publication, invitations, campaigns, or service changes.

### Design principles

1. A concrete problem leads to the course: a useful explanation and a link to
   the relevant exercise, without pages created only to capture searches.
2. Observable evidence precedes a claim: examples and feedback explain what
   the course offers; independence and effectiveness remain hypotheses to test.
3. Maintenance limits distribution: IT/EN content and corrections come first,
   followed by any additional channels.

Google recommends content useful to people. Organic presence does not require
payment, but crawling, indexing, and ranking are not guaranteed.
[People-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content),
[Search Essentials](https://developers.google.com/search/docs/essentials).

### Engine architecture

E1: Git problem → verified IT/EN explanation → curriculum → E2.

E2: worked example → understanding the method → tier choice → first exercise → E3.

E3: observed difficulty → reasoned IT/EN correction → possible voluntary return;
recurring cases update E1 and E2.

E1 supports discovery; E2 evaluation and starting; E3 fit and return visits.
Qualification means understanding whom the path serves and which problems it
addresses, rather than evaluating sales leads. Engines are repeatable activities,
not a channel list.

#### Candidate screening

| Candidate | Positioning fit | Operational viability | First signal and decision |
| --- | --- | --- | --- |
| Searchable practical scenarios | Aligned with positioning. | Content review within the IT/EN time allowance. | Acquisition unpredictable; selected as E1. |
| Worked example linked to the course | Shows the method. | Reuses verified scenarios, reducing duplication. | Observable once testable; selected as E2. |
| Feedback → revision → return | Supports learning. | Triage owner and priorities within 1–2 hours/week. | First pilot feedback can be planned; selected as E3. |
| Paid amplification | Can spread the message. | Incompatible with zero cost. | Rejected. |
| Ongoing outreach | Weak fit. | Requires contacts, messages, and additional work. | Excluded from the plan. |
| Ongoing newsletter | Possible return visits. | Editorial calendar and subscriber management beyond the minimum. | Rejected until capacity is demonstrated. |
| New owned community | Possible discussion. | Ongoing moderation is not planned. | Rejected; use a limited feedback surface. |

Post-launch capacity is confirmed as a budget, not a guarantee that every problem
can be solved. Initial production remains part of the development project.

### Engine detail

#### E1 — Searchable practical scenarios

Input: correct exercises, IT/EN explanations, sources, and links to the curriculum.
Mechanism: a problem generates a useful page; observed questions guide revisions.
Output: relevant visits to the path, if the page is discovered.
Indicators: impressions, clicks, query relevance, curriculum visits where
measurable, and requested corrections. Requirements: technical and linguistic
review, accessible pages. First signal: an impression or click after discovery,
without a guaranteed date. [Search Console metrics](https://support.google.com/webmasters/answer/7576553?hl=en)
define impressions/clicks/CTR; these data do not demonstrate learning.

#### E2 — Worked example → course

Input: a representative case spanning change, history, and review, with an
explained outcome. Mechanism: the participant evaluates the method and finds a
starting point. Output: an informed exercise start. Indicators: understanding
of the task, verified starts, first completion, access barriers, and IT/EN
differences. Requirements: verified example and a link to the path. First signal:
a person tries the example; before launch, only during a private review.

#### E3 — Feedback → revision → return

Input: voluntary observations, reproducible errors, and test results.
Mechanism: classify difficulties, correct material/translations, and explain
the update; the participant chooses whether to return or share the course.
Output: a corrected path and new voluntary opportunities to use it.
Indicators: reproducible problems, resolutions, recurrence after correction,
independent tests on new cases, and observable returns without extra tracking.
Requirements: triage owner and revision capacity. First plannable signal: pilot
feedback within the initial 90-day horizon, if people and material are available.
This is not a promise to obtain users or results by a date.

### Channel mix

| Candidate channel | Engine | Primary function | Weight | Activation |
| --- | --- | --- | --- | --- |
| Organic search leading to Pages | E1 | Capture an existing need. | Medium | Complete release. |
| Repository, README, and feedback space | E2/E3 | Evaluation. | High | Project status already explicit; course after release. |
| Example and internal links | E2 | Start. | High | Private first; public with the complete course. |
| Organic posts in existing communities | E1/E2 | Discovery. | Low | Only later, with authorization and capacity. |

Every channel is organic; advertising and additional service spend: **0 €**.
No purchase or trial is a prerequisite. At most three channels are active in the
first planning horizon; do not add the fourth if it exceeds maintenance capacity.

- Search/Pages copy, IT: «Dalla modifica alla pull request: comprendi cosa cambia»;
  EN: “From change to pull request: understand what changes.” Monitor impressions,
  clicks, relevant queries, and available curriculum visits.
- Repository: confirmed promise and actual status; monitor reported barriers,
  recurring questions, reproducibility, and classified/corrected reports.
- Example/course copy, IT: «Inizia dal livello Base, in italiano o inglese»;
  EN: “Start at the Base tier, in Italian or English.” Monitor starts, first
  completions, access errors, and understanding of the outcome.
- Community: useful case and contextual link; relevant feedback, attributable
  visits where available, and observable starts, without expected volumes.

Pages is static and does not replace the API/store. README introduces usefulness,
getting started, and support; it does not prove traffic. Discussions requires
enabling and moderation; Issues/Discussions on a public repository make feedback
public. Do not ask for email, secrets, private logs, or unnecessary personal data.
Form configuration and channel opening are later operational tasks requiring
approval.

### Activation sequence

1. After operational approval: prepare the example and minimal feedback
   collection, assign the owner, and test them privately.
2. Before launch: resolve blockers and verify all three tiers and IT/EN parity.
3. At the complete release: connect pages, repository, and example, with no
   more than three channels in the initial 90-day horizon.
4. Later: consider community activity only if maintenance and feedback remain
   sustainable.

The 90 days are a horizon, not a delivery date or traffic commitment.

### Operating requirements

Responsibility for content, IT/EN review, and triage, possibly held by one person;
no assignment is automatic. Confirmed post-launch human budget:
**1–2 hours/week in total** to read signals, triage, and make small revisions.
Larger corrections need planning and may pause additional distribution.
The budget does not estimate pre-launch development or translation.

Use only reliable aggregate data or documented pilot observations; no dashboard
justifies paid services or collecting additional personal data.
Search Console and feedback tools have not yet been set up.

### What this plan does not solve

It does not implement the simulator, SSO, persistence, measurement, or accessibility.
It does not prove effectiveness or set adoption targets. CPL and commercial
conversion rates are not relevant: advertising mechanisms were not selected.
Start, completion, and learning baselines must be collected without invented ranges.

## 6. Roadmap

### Schedule and capacity

D1–D90 are indicative windows. D1 starts after operational approval, owner
assignment, and declared initial availability. The confirmed 1–2 hours/week
covers post-launch maintenance only: it does not size development or translation.

If work exceeds the horizon, move the release. Zero service cost, three complete
tiers, and IT/EN parity remain mandatory. This document promises no launch date.

### Candidates, impact, and effort

| Candidate | Indicative impact / effort | Destination |
| --- | --- | --- |
| C1 — Verifiable login across free domains | Blocking / medium-high | I1: launch dependency. |
| C2 — Replay/store within free quotas | Blocking / medium-high | I1; complete verification in I4. |
| C3 — Capacity, data, score, providers, name, and licenses defined | Blocking / medium | I1: decisions before the corresponding steps. |
| C4 — Testable IT/EN incident spanning repository and review | High / high | I2: material for E2. |
| C5 — Hypotheses tested against a voluntary pilot | High / medium | I3: activates E3. |
| C6 — Three complete tiers, lab, and progress in IT/EN | Blocking / high | I4: launch scope. |
| C7 — Identity, accessibility, SEO, and recovery verified | Blocking / medium-high | I4: readiness. |
| C8 — Complete path reachable through selected channels | High / medium | I5: public E1/E2/E3. |
| C9 — Measured maintenance cycle | High / low-medium | I6: sustainability. |
| C10 — Additional free social providers | Medium / medium-high | After launch, with verified prerequisites and need. |
| C11 — Cases shared in existing communities | Medium / medium | Deferred: spare capacity and authorization. |
| C12 — Ongoing newsletter | Uncertain / medium | Parked: calendar/subscriber management unnecessary. |
| C13 — Arbitrary server-side shells | Out of scope / high | Excluded: changes simulation and operational requirements. |
| C14 — Purchased campaigns, domains, or services | Incompatible / variable | Excluded by zero cost. |
| C15 — Advanced competitive leaderboard | Uncertain / high | Parked: initial leaderboard is educational. |
| C16 — Content beyond the curriculum | Uncertain / high | Deferred until supported by observed problems. |

### First 90 days: six initiatives

| # | Initiative (result-phrased) | Source step | Impact | Effort | Owner | Depends on | Milestone | When |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I1 | Free feasibility and initial capacity made verifiable | Snapshot, Demand Plan; C1–C3 | Blocking | Medium-high | Technical and decision lead `[OWNER TBD]` | Operational approval; owners available. | Go/no-go dossier with initial evidence, decisions, and assigned capacity. | D1–15, indicative. |
| I2 | Representative incident understandable and reproducible in IT/EN | Market Map, Positioning, E2; C4 | High | High | Learning scenario lead `[OWNER TBD]` | Favorable I1 outcome. | Verified case spanning files, history, review, and recovery in both contexts. | D16–35, if sustainable. |
| I3 | Learning hypotheses tested against voluntary observations | P1–P3, E3; C5 | High | Medium | Learning validation lead `[OWNER TBD]` | I2, available participants, rubrics. | Test record with difficulties and reasoned scenario/claim decisions. | D36–50, subject to the pilot. |
| I4 | Release candidate complete across three tiers and both languages | Snapshot, technical roadmap; C6–C7 | Blocking | High | Release readiness lead `[OWNER TBD]` | I1–I3, initial capacity confirmed. | Complete artifact passing correctness, access, persistence, recovery, and usability criteria. | D51–75 if compatible; otherwise beyond D90. |
| I5 | Complete course reachable with the three engines connected | Demand Plan E1/E2/E3; C8 | High | Medium | Publishing maintainer `[OWNER TBD]` | I4, approved setup and publication, free conditions. | Public path from pages, repository, and example with usable feedback. | D76–85 only if all gates pass. |
| I6 | First maintenance cycle compared with budget | Demand Plan E3; C9 | High | Low-medium | Course and feedback maintainer `[OWNER TBD]` | I5, one complete observable week. | Actual workload report and decisions to remain within 1–2 hours/week. | First complete post-launch week; may extend beyond D90. |

One person may hold several roles after capacity is checked. I2/I3 are a private
review, not a reduced public launch. I4 preserves the entire scope.
Initial I1 evidence does not replace the complete real-world I4 test.

### Engine activation

- E1, searchable scenarios: material in I4 and public links in I5.
  Impressions and visits when available; no guaranteed indexing date.
- E2, example → course: private I2/I3 test, public I5 start. Observe whether
  a person understands the task and reaches the relevant exercise.
- E3, feedback → revision → return: first I3 cycle, continuing in I5/I6.
  Document difficulty, reasoned decision, and verification of the correction.

No invented volumes, conversion rates, or learning improvements.
Absent observations mean missing evidence, not automatic success or failure.

### Related risks and questions

| Item | Initiatives | Evidence or condition |
| --- | --- | --- |
| P1 — file → review | I2/I3 | Observed explanation and actions, not an advance claim. |
| P2 — transfer between platforms | I2/I3 | Distinguish Git from portals in an unguided case. |
| P3 — reasoned recovery | I2/I3 | Explained choice and preserved shared work. |
| G3 — usefulness/differentiation | I3/I6 | Audience observations; no presumed exclusivity. |
| G5 — success/independence | I1/I3/I6 | Rubrics before tests; baselines afterward. |
| G6 — owners/capacity/deadlines | I1/all | Roles and availability before the schedule. |
| G8 — providers | I1/I4, C10 | First verified free path; buttons for working providers only. |
| G9 — name/licenses/feedback | I1/I4 | Decisions before publication. |
| Cross-site auth | I1/I4 | Complete flow on free domains without third-party cookies. |
| CPU and quotas | I1/I4/I6 | Measure runtime; optimize or block if incompatible. |
| Score/attempts/elapsed time | I1/I4 | Transparent server rules; estimated breaks separate. |
| Retention/deletion/recovery | I1/I4/I6 | Explicit rules and tested restoration. |

A negative authentication, quota, correctness, or recovery result blocks launch;
it does not authorize purchases. Initial candidate rules are in the
[operational scope](../docs/analysis/implementation-proposal.md), approved for local work.

### Twelve-month outline

- Months 1–3: address the six initiatives in dependency order, with a conditional
  schedule. Continue beyond the quarter if requirements remain unmet.
- Months 4–6: after launch, consolidate correctness, IT/EN, and sustainability;
  consider C10 only for an observed barrier and with free prerequisites.
  If launch is blocked, complete the initial scope first.
- Months 7–9: consider C11 only with spare capacity and authorization.
  Do not add a fourth channel if maintenance cannot sustain it.
- Months 10–12: reassess C16 using collected problems and tests; update the
  roadmap before new formats. C12/C15 remain parked without demonstrated need.

## 7. Assumption & evidence ledger

### Open questions

Confidence concerns the working answer, not the project's value. Category, ICP,
and engines are explicit confirmed choices; effectiveness and technical
conditions have not thereby become evidence. No baseline is invented.

| ID / type | Question and why it matters | Confidence | Available evidence | Recommendation |
| --- | --- | --- | --- | --- |
| P1 / unverified-claim | Does connecting files and review improve understanding? | Low | Specifications; no app or test. | Working scenario and observed explanation, I2/I3. |
| P2 / unverified-claim | Independent transfer between GitHub/Azure? | Low | Coverage required, not demonstrated. | Unguided case in both contexts, I2/I3. |
| P3 / unverified-claim | Reasoned recovery of shared work? | Low | Rubrics still to implement. | Observe choice and consequences, I2/I3. |
| G3 / assumption | Actual usefulness and differentiation. | Low | Public map and user choice; no proven exclusivity. | Pilot and claim review, I3/I6. |
| G5 / missing-data | Adoption targets and evidence of independence. | Low | Metrics requested; no baseline. | Rubrics before tests; collect results without fictional rates. |
| G6 / missing-data | Owners, initial capacity, and actual schedule. | Low | Repository owner known; only maintenance quantified. | Assign roles/capacity before D1; reschedule. |
| G8 / assumption | GitHub as first provider and subsequent order. | Medium | Design fit and provider documentation. | Verify in the spike; show working providers only. |
| G9 / missing-data | Public name, licenses, and feedback channel. | Low | Repository title and scope; no chosen license. | Decide before publication; distinguish code/content/assets. |
| T1 / assumption | Replay and store fit within free quotas. | Low | Documented limits; no application benchmark. | Measure locally, then in the real environment; optimize or block launch. |
| T2 / assumption | SSO works cross-site in target browsers. | Low | Proposed architecture; no spike. | Maintained provider, handoff, and test with third-party cookies blocked. |
| T3 / assumption | Scoring/time rules and repeated attempts. | Medium | Simple proposed definition, not yet approved. | Evaluate operational scope before the final contract. |
| T4 / missing-data | Retention, deletion, and recovery. | Low | Documented principles; schema inactive. | Explicit policies and restoration before release. |
| T5 / missing-data | OAuth registrations and real configuration. | Low | No accounts/secrets touched. | Separately authorized setup; a mock is not a real-login test. |
| T6 / assumption | Maintenance workload fits within 1–2 hours/week. | Medium | Human budget confirmed; no observed workload. | Measure the first complete week in I6; reduce channels if necessary. |
| T7 / missing-data | Volunteers available for the pilot. | Low | No recruitment performed. | Prepare test and consent after authorization without promising participants. |
| T8 / unverified-claim | Actual SEO/accessibility/performance. | Low | Calculated palette and audit plans; no app. | Audit the rendered product and correct findings, I4. |

No advertising benchmark is required: CPL and commercial conversions are not
selected mechanisms. Learning data will be collected, not replaced with
convenient ranges. Usage-cost assumptions must be distinguished from a plan's
nominal free status and shared account quotas.

### Evidence map

| Origin | What it supports | Limitation |
| --- | --- | --- |
| User statements | Scope, audiences, IT/EN, simulator, timer, zero cost, category, promise, engines, and maintenance budget. | Confirm choices, not results. |
| Repository documentation | Architecture, curriculum, work status, and document checks. | Does not demonstrate implementation. |
| Official public sources | Alternatives, Google/GitHub mechanisms, and service quotas. | Do not measure course effectiveness or actual workload. |
| Design inferences | Six initiatives, windows, dependencies, and test hypotheses. | Approved as a direction; people and operational dates are not already assigned. |
| Connected tools | Verified repository access and metadata. | No CRM, commercial analytics, or paid source used. |

Main sources and their limitations: [Market Map](02-market-map.md),
[Demand Plan](04-demand-plan.md), [hosting](../docs/deployment.md).

## 8. Execution readiness

### 8.1 Conversion design: from discovery to learning

Pages/example → tier → first exercise → outcome → resume.
Define objectives, rubrics, feedback, and tier transitions. Without this work,
visits and starts do not demonstrate understanding. It requires instructional
design, UX, and testing with participants, rather than a sales process or CRM.

### 8.2 Deployment: activation and maintenance

Build and verify the product; prepare IT/EN content, feedback, and procedures
before activating channels. Required capabilities include TypeScript/Git,
authentication, data, accessibility, translation, and maintenance. The
1–2 hours/week is the post-launch budget only. If the initial scope remains
incomplete, postpone release; do not reduce languages/tiers or activate paid
services.

Maintenance covers triage and small revisions, not a guarantee of every fix.
Major incidents may require pausing distribution or the online service while
planning a correction. No commercial SLA is promised.

### 8.3 Measurement: sources, review, and decisions

API for confirmed starts/completions; voluntary observations for rubrics and
problems; Search Console signals only when configured and available. No invented
traffic or new personal trackers merely to complete a dashboard.
The maintainer role must periodically read signals and decide which corrections
or channels are sustainable. Without this routine, an outcome cannot be
attributed to an engine or the workload budget confirmed.

### Capacity and operational start

The plan requires no paid supplier or hire. Human roles remain to be assigned,
without assuming availability from the repository owner's name alone.

The [reviewable operational scope](../docs/analysis/implementation-proposal.md)
specifies the outcome, candidate dependencies, initial leaderboard rules, and
publication boundary. After approval, local implementation may start through
subagents in separate worktrees, with checks and documentation updates.
Account/secret setup, resources, deployment CI, pushes/PRs, and publication are
specific later steps, not authorized by GTM-document confirmation alone.

## Approval status

The user approved the roadmap, consolidated plan, and local implementation on
15 November 2026. Approval does not turn learning hypotheses into evidence or
authorize real accounts, external resources, or publication. Implementation has
started; checks and results are reported in the current technical documentation.
