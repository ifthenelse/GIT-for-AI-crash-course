# Local product accessibility audit

Method: the Accessibility Audit skill and Humbleteam WCAG 2.2 checklist, using
TSX markup, CSS, the rendered DOM and Chromium screenshots. Checks included axe
scans in light and dark themes, keyboard interactions and a 320 CSS px viewport.
The inputs and findings apply to the samples below; they do not certify
conformance across the entire application.

## Findings and fixes

| Priority | Criterion | Finding | Fix |
| --- | --- | --- | --- |
| P1 | 1.4.1 / 2.4.4 | A footer link was distinguishable only by color | Permanent underlines for links within text; axe scan repeated |
| P1 | 1.4.11 | Form field borders had insufficient contrast | Separate control tokens from decorative borders: 3.49:1 in light mode and 4.86:1 in dark mode against the surface |
| P1 | 1.4.4 | Fixed-height graph rows overlapped remote controls at 200% text size | Rows sized in em units and scalable SVG; browser regression check at the boundary between commit details and remotes |
| P1 | 3.3.1 / 3.3.2 | Frontend alias format differed from the format accepted by the server | Limits of 3–30 characters, a Unicode pattern and explicit localized instructions; a specific text error |
| P2 | 2.1.1 / 2.4.7 | Entering resize mode did not focus the first field | Explicit focus on width; arrow-key movement with Enter/Esc and menu alternatives to dragging |
| P2 | 4.1.2 | Dialogs had no explicit accessible names | aria-labelledby on dialogs with associated headings |

## Criteria by screen

Each row accounts for the criterion separately for the home page, laboratory
and leaderboard. **Verified** means no remaining issue was found in the reviewed
sample. **N/V** identifies what the sample cannot demonstrate. No findings are
suppressed.

| SC | Home | Laboratory B01/B07 | Leaderboard |
| --- | --- | --- | --- |
| 1.1.1 Non-text Content | Verified: decorative logo with a text name | Verified: DAG with a parent list and decorative SVG | Verified: decorative icons with text |
| 1.3.1 Info and Relationships | Verified: headings, navigation and lists | Verified: sections, fieldset/legend and commit list | Verified: table/th and labeled filter |
| 1.4.3 Text Contrast | Verified: palette and axe scans in both themes | Verified: palette/terminal and axe scans in both themes | Verified: palette and axe scans in both themes |
| 1.4.4 Resize Text at 200% | Verified: screenshots show readable text and CTAs | Verified in the sample: scrolling/maximizing and corrected graph | Verified: empty state and controls; long table data outside the sample |
| 1.4.10 Reflow | Verified at 320 px; document width 320 | Verified at 320 px; windows recoverable from the dock | Verified at 320 px; table overflow remains local |
| 1.4.11 Non-text Contrast | Verified: controls and focus | Verified: borders, icons and graph nodes | Verified: selector and focus |
| 2.1.1 Keyboard | Verified: links, language, theme and levels | Verified: terminal, editor, dock, menus, move/resize and overview | Verified: native navigation and selector |
| 2.1.2 No Keyboard Trap | Verified in the reviewed flow | Verified: Tab leaves the terminal/editor; Esc closes overview | Verified: native controls |
| 2.4.4 Link Purpose | Verified: descriptive labels | Verified: lesson list and official sources | Verified: navigation and profile |
| 2.4.6 Headings and Labels | Verified: H1 and sections | Verified: windows and associated fields | Verified: title and headings |
| 2.4.7 Focus Visible | Verified: 3 px outline | Verified: outline, title bar and resizing | Verified: outlines on controls |
| 2.4.11 Focus Not Obscured | Verified in the keyboard flow | Verified: activation brings a window to the front; minimizing returns focus to the dock | Verified: no fixed overlay in the sample |
| 2.5.8 Minimum Target Size | Verified: buttons ≥24 CSS px; inline links exempt | Verified: window controls 24×25 px, dock and menus; links within text exempt | Verified: filter and buttons; inline links exempt |
| 3.2.2 On Input | Verified: explicit theme/language controls | Verified: editor does not submit implicitly; forms use explicit actions | Verified: filter updates within the same context |
| 3.3.1 Error Identification | N/V: no home-page form error in the sample | Verified: rejected commands, open objectives and pending submissions described in text | N/V: profile form errors outside the leaderboard screen |
| 3.3.2 Labels or Instructions | Verified: accessible selector | Verified: labels, terminal help and task; alias format in the profile dialog | Verified: labeled level selector |
| 3.3.8 Accessible Authentication | N/V: real provider not configured | N/V: local provider does not demonstrate GitHub accessibility | N/V: external provider outside the sample |
| 4.1.2 Name, Role, Value | Verified: native controls and accessible names | Verified: radio buttons, expanded menus, windows and named dialogs | Verified: select and semantic table |

No P0, P1 or P2 findings remain within the reviewed scope. The real social login
provider still requires testing in the public environment. Extended course
reading and additional combinations of windows and data require testing with
people and assistive technologies. Axe does not check every criterion and does
not replace these tests.

## Measurements and evidence

| Text/surface pair | Light | Dark |
| --- | ---: | ---: |
| Primary text | 14.28:1 | 12.94:1 |
| Secondary text | 6.08:1 | 8.28:1 |
| CTA text/CTA | 5.38:1 | 11.24:1 |
| Control border/surface | 3.49:1 | 4.86:1 |
| Focus/surface | 7.01:1 | 10.97:1 |

Ratios were calculated in sRGB from the actual pairs in styles.css, rather than
estimated visually. Screenshots at 1280/1440 px, 320 px and doubled text size are
in `.tmp/screenshots/`. Document-width checks returned 320/320 and 1280/1280 across
the three screens. Internal overflow in the editor, terminal and table remains
scrollable. The decorative home-page preview is aria-hidden.

`npm run test:e2e` repeats six axe scans (three screens × two themes) and the
keyboard flows. These include minimizing/restoring, moving/resizing, closing
overview with Esc, leaving the terminal with Tab, saving and the offline pending
state.
