# Implemented visual identity

A clear, readable laboratory with neutral surfaces and a teal accent. The dark
theme preserves the same roles with a brighter accent. The implemented colors
are CSS tokens in `apps/web/src/styles.css`; states also use text or symbols.

| Role | Light | Dark |
| --- | --- | --- |
| Background | #F9FBFA | #101C23 |
| Surface | #FFFFFF | #17262F |
| Text | #172D39 | #E2EDEA |
| Secondary text | #526570 | #ADC1C5 |
| Action | #087568 | #7CE3C3 |
| Link | #086257 | #96EBD3 |
| Highlighted surface | #E5F4EF | #203E39 |
| Decorative border | #D9E3DF | #344B52 |
| Control border | #7C8D86 | #78959C |
| Focus | #8F4400 | #FFD28F |

Variable Inter is used for headings, lesson text, navigation, the HUD and the
leaderboard. JetBrains Mono is used for the terminal, files, commands and
identifiers. WOFF2 files are self-hosted with `font-display: swap`, fallback fonts
and distributed OFL licenses. Provenance, sizes and SHA-256 hashes are recorded in
`apps/web/public/fonts/sources.json`.

The original pictogram connects three nodes with a branch/merge path. `logo.svg`
and `logo-dark.svg` contain vector paths and circles on transparent backgrounds,
with no embedded raster images. The generated concept informed the geometry; the
final file is native SVG. The asset registry is `brand-assets.json`.

Derivatives: favicon.svg; transparent 192/512 PNGs; social.svg/social.png and
social-it.svg/social-it.png at 1200×630. Social cards have a solid background for
sharing; the logos remain transparent. The mark is used in the header and on the
home page. The mock repository in the hero is decorative and separate from the
laboratory.

Contrast measurements and checks of both themes are in the
[accessibility report](accessibility.md).

## Lesson illustration direction

The generated [reference sheet](../design/lesson-illustration-reference.png) explores
repository folders, snapshots, staging, branches, synchronization and conflict
resolution. The shipped illustrations use native SVG and existing semantic color
tokens so they remain crisp and adapt to both themes. Each concept paragraph has
a complementary illustration; the prose remains the complete accessible explanation.

The upstream UI/UX Pro Max design skill was consulted again for this extension
(https://github.com/nextlevelbuilder/ui-ux-pro-max-skill). Its image accessibility,
reserved layout space and performance guidance informed the implementation.
