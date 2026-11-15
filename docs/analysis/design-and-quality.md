# Visual identity and verification plan

Initial proposal approved. The logo, assets and interface are implemented. Actual
tokens and audit results are in `docs/audits/`; the following tables retain the
values evaluated during analysis.
Method: Design skill with brand/design-system dependencies; local SEO Audit;
Accessibility Audit and upstream checklist. Sources are in [skills.md](skills.md).

## Palette and typography

A professional lab with neutral surfaces and a teal accent. Every state also
uses text or symbols; the graph distinguishes branches with names and line styles.
Three token levels: primitive, semantic and component.

| Token | Light | Dark |
| --- | --- | --- |
| Background | `#F7FAFC` | `#0C1822` |
| Surface | `#FFFFFF` | `#132735` |
| Text | `#142B3D` | `#EDF4F8` |
| Secondary text | `#526575` | `#ADBFCC` |
| Action/link | `#086F6B` | `#5EEAD4` |
| Text on action | `#FFFFFF` | `#082C2A` |
| Control border | `#738797` | `#6C8799` |
| Focus | `#005FCC` | `#93C5FD` |
| Success | `#166534` | `#86EFAC` |
| Warning | `#854D0E` | `#FDE68A` |
| Error | `#B42318` | `#FDA4AF` |

Contrast calculated using sRGB relative luminance, linearization at `0.04045`
and the ratio `(Lhigher + 0.05) / (Llower + 0.05)`:

| Pair | Light | Dark |
| --- | ---: | ---: |
| Text / surface | 14.56:1 | 13.80:1 |
| Secondary / surface | 6.04:1 | 8.11:1 |
| Primary / surface | 6.01:1 | 10.37:1 |
| CTA text / CTA | 6.01:1 | 10.11:1 |
| Border / surface | 3.72:1 | 4.06:1 |
| Focus / surface | 5.98:1 | 8.50:1 |

These measurements cover only the proposed pairs; they do not establish interface
conformance. Hover, selection, code highlighting and other combinations must be measured.

Two families: **Inter** for headings, learning content, navigation, HUD and
leaderboard; **JetBrains Mono** for terminal, editor, commands, hashes and branches.
Self-hosted WOFF2, only required variants, distributed OFL licenses, fallbacks and
`font-display: swap`. Text at 16–18 px, line-height 1.6, width around 65 characters.
Terminal/editor resizable from 16 px; ligatures disabled; tabular numbers for
times and scores.

## Layout and interaction

Desktop: initial 2×2 grid with terminal, graph, editor and repository portal.
Windows can stack, reorder, resize and minimize, including on small viewports.
A dock, overview and presets allow recovery of every window. No interaction
relies exclusively on dragging.
The [window manager specification](../window-manager.md) is separate from Git state.

Home shows Base/Intermediate/Advanced tiers with textual states Available,
In progress, Completed and Locked. The HUD shows tier, exercise, objective,
synchronization status and time according to rules still to be agreed at this
stage. Leaderboard uses a semantic table with tier/version filters, aliases,
score and duration; no information is conveyed by color alone.

The graph includes a textual list of commits/parents/refs; no action relies only
on drag-and-drop. The terminal has an accessible input, an explorable log and
concise announcements of the new result. The editor offers plain-text mode
without keyboard traps. Reduce animations and preserve focus when lab state changes.

## Logo: implementation brief

Original pictogram with a commit line that forks and rejoins, three nodes for
the levels, legible at 16–24 px. Avoid imitating Git or platform trademarks.
Two variants for light/dark backgrounds and a monochrome version.

Required output after approval: native transparent SVG, `viewBox`, original paths,
no embedded raster, background or external references. The user's transparency
requirement overrides the Design skill's white-background instruction.
A generated PNG cannot be described as vector SVG.
Derivatives: favicon, 192/512 icons, header, home and 1200×630 social card.
The social card may have its own background while retaining the transparent logo.

## Languages and messages

i18next covers all UI strings, errors, dialogs and accessible alternatives.
Canonical Git commands and output remain distinguishable from translated explanations.
Correct document language, plurals, numbers and durations; changing language must
preserve the scenario. Complete Italian and English at launch are confirmed:
lessons, hints, errors, OS guides, messages and accessible alternatives, as well
as the UI. New untranslated strings block release of both languages.

Italian product-copy examples reviewed with Copy Editing:

- “Completa il livello Base per iniziare Intermedio.”
- “Salvato sul dispositivo. In attesa di sincronizzazione.”
- “Progressi sincronizzati.”
- “Il salvataggio non è riuscito. Il tuo lavoro è disponibile su questo dispositivo.”
- “Il comando non è ancora supportato in questo laboratorio.” Where relevant, follow with the supported alternative.

Local completion is not described as permanent before API confirmation.
Italian UI label: “Classifica”; English label: “Leaderboard”.

## SEO: status and plan

**Product audit had not been performed at this analysis stage:** the app,
application HTML and deployed URL were not yet available. No scores, Search
Console data or indexing outcomes had been verified.

1. Public prerendering of home, curriculum and tier descriptions; lab and personal data not indexable.
2. Stable language URLs, self-canonical URLs, reciprocal hreflang and a consistent sitemap.
3. Verify the Pages base path, refresh and direct access for every deployed page.
4. Unique title/description, consistent headings, technical sources and review dates; complete translations.
5. Open Graph with an actually available social card; real internal links.
6. Verify any JSON-LD in the rendered DOM or with Rich Results Test; do not diagnose from fetch alone.
7. Measure LCP, INP and CLS, distinguishing lab measurements from real-user data after release.
8. Personal pages and callbacks not indexable; noindex does not replace API authorization.

Future report: issue, evidence/URL, impact, fix, priority and retest result.

## Accessibility: status and plan

**Product audit had not been performed at this analysis stage:** the skill requires
screenshots, a URL or markup and prohibits conclusions drawn from a description
alone. No criterion was declared conformant.

Future sample: home, locked tier, normal/conflict/error/offline lab, login and
leaderboard in both themes. Check all 18 upstream checklist criteria: each ends
in a finding, a verified result with evidence, or an unverified status.

Evidence: DOM and accessible names; keyboard flow; visible, unobscured focus;
no traps; 320 CSS px viewport and 200% text; target sizes under SC 2.5.8 and its
exceptions, with a 44 px goal for primary controls; errors associated with fields;
correct tab states; accessible authentication; human checks with assistive technology.
P0/P1/P2 findings include the WCAG criterion, fix and retest.
The result will not be a legal certification.

## Sources

- [Design and dependencies](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills)
- [Accessibility Audit](https://github.com/humbleteam/accessibility-audit)
- [Inter license](https://github.com/rsms/inter/blob/master/LICENSE.txt)
- [JetBrains Mono license](https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt)
