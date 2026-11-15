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
