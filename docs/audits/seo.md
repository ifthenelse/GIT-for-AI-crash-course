# Local SEO audit

Method: the SEO Audit skill. Inputs: built HTML, sitemap/robots, React components
and pages opened in Chromium. A public site, Search Console, rankings, traffic
data and field Core Web Vitals are not available.

## Findings and fixes

| Finding | Impact | Fix and evidence |
| --- | --- | --- |
| The SPA initially lacked useful HTML content | High | Prerendered home, program and three levels in IT/EN: 10 pages with headings, summaries and 36/12 modules readable without JS |
| Identical IT/EN home titles and repeated descriptions | Medium | Unique titles and descriptions; checked with `npm run audit:seo` |
| Public links available only as hash routes | Medium | Program and level pages have real URLs and links in static content; React navigation preserves the session |
| Local preview could be indexed | Medium | Builds without SITE_URL use localhost, `noindex,nofollow` and robots Disallow |
| Pages repository base path | High | Build under `/git-practice/`, 10 URLs without JS and hydrated EN course/laboratory: no asset 404s or page errors |
| Social image always in English | Low | social-it.png for Italian and social.png for English, both 1200×630 |

Each public page has a canonical URL, reciprocal IT/EN alternates and x-default,
an HTML language, one H1, a meta description, Open Graph and Course JSON-LD.
The test reads JSON-LD from the complete document, without using a representation
that strips scripts. The sitemap contains the ten canonical URLs. The program and
three level pages are explicitly linked. Fonts and assets are served locally.

The check using `example.test` is a local fixture, not a publication. The
laboratory loads in a deferred chunk; the measured build includes approximately
139 kB of initial gzipped JavaScript and 26 kB for the laboratory, plus CSS and
fonts. These are not LCP/INP/CLS or real traffic measurements.

## Reproduction and public release gates

```bash
npm run build
npm run audit:seo
```

Before launch, set the real URL and base path, test HTTP responses/deep links,
HTTPS and canonical URLs on the deployed site, check that the bundle contains no
secrets and verify indexability. Search Console registration and field
measurements remain external activities requiring authorization. Course JSON-LD
does not guarantee rich results or rankings.

## Git by doing alignment, 22 November 2026

Scope: repository implementation and a production-domain build, not a live-site
or ranking audit. No Search Console or field Core Web Vitals data was available.

| Finding | Impact | Resolution |
| --- | --- | --- |
| Old product name in UI, page metadata and social previews | High | Git by doing across the header, footer, terminal, translations, page titles, provider and social assets |
| Public configuration examples pointed to the repository URL | High | Documented `https://gitbydoing.com/` with `/` as base; explicit public build remains required |
| Client navigation left descriptions, locale alternates and JSON-LD stale | High | Shared bilingual metadata for prerendering and React; update canonical, alternates, social metadata and Course JSON-LD on navigation |
| Generic course headings after hydration | Medium | Curriculum and tier headings now identify the selected page |
| 404 artifact duplicated the indexable home page | Medium | Dedicated noindex 404 artifact and client-side missing-page view |
| Existing symbol did not match the supplied identity | Medium | Native transparent SVG branch-and-arrow reconstruction, light/dark pictograms and wordmarks, adaptive favicon and bilingual PNG social previews |

The supplied raster is a visual reference. SVG geometry is reconstructed, not an
exact tracing, and avoids the visible raster halos. Teal is used as a brand
accent; small text uses darker teal on light surfaces for contrast. Wordmarks
use Inter with system fallbacks; they are editable SVG text, not font outlines.
Social PNGs are generated with ImageMagick; `BRAND_RASTER_FONT` can override the
local Arial font path when regenerating on another operating system.

Validation: `scripts/verify` passed 85 tests in 11 files; production build with
`PUBLIC_BASE_PATH=/ SITE_URL=https://gitbydoing.com/` and `npm run audit:seo`
passed for all ten public IT/EN pages. Browser inspection through the available
Chrome connection verified rendered Course JSON-LD, language/navigation metadata,
light/dark logo selection, no broken images and no horizontal overflow at 320px.
The standalone Playwright suite could not start Chrome in this environment
(SIGABRT before test execution); its five tests are not reported as passing.

A direct HTTPS request to the purchased domain was reset by the connection, so
no conclusion about public TLS or server availability is justified. DNS,
custom-domain binding, live HTTP status codes and redirects, Search Console and
field performance remain unverified. No Cloudflare account or access policy was
modified. Buying the domain does not configure hosting or make the site public.
