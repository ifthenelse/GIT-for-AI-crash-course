import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const directory = path.resolve('apps/web/public');
// Native vector reconstruction of the approved branching and forward-action concept.
const mark = (ink) => `<g fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 35H25C34 35 39 27 42 18"/><path d="M25 35C33 35 34 46 39 46"/><circle cx="13" cy="35" r="8"/><circle cx="46" cy="10" r="8"/></g><g fill="none" stroke="#14B8A6" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="47" cy="46" r="8"/><path d="M55 46H74M67 39L74 46L67 53"/></g>`;
const svg = (body, width, height, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${body}</svg>`;
for (const [suffix, ink] of [['', '#0F172A'], ['-dark', '#F8FAFC']]) {
  await fs.writeFile(`${directory}/logo${suffix}.svg`, svg(`<g transform="translate(0 7)">${mark(ink)}</g>`, 80, 66, 'Git by doing'));
  await fs.writeFile(`${directory}/wordmark${suffix}.svg`, svg(`<text x="0" y="59" fill="${ink}" font-family="Inter,system-ui,sans-serif" font-size="64" font-weight="750" letter-spacing="-2">Git by <tspan fill="#14B8A6">doing</tspan></text>`, 390, 80, 'Git by doing'));
}
await fs.writeFile(`${directory}/favicon.svg`, svg(`<style>.ink{stroke:#0F172A}@media(prefers-color-scheme:dark){.ink{stroke:#F8FAFC}}</style><g transform="translate(1 7)">${mark('#0F172A').replace('<g fill="none"', '<g class="ink" fill="none"')}</g>`, 80, 80, 'Git by doing'));
const rasterFont = process.env.BRAND_RASTER_FONT || '/System/Library/Fonts/Supplemental/Arial.ttf';
  for (const locale of ['en', 'it']) {
    const suffix = locale === 'it' ? '-it' : '';
    const headline = locale === 'it' ? 'Impara Git facendo pratica.' : 'Learn Git by doing.';
    const detail = locale === 'it' ? '36 lezioni · Collaborazione · Recupero' : '36 lessons · Collaboration · Recovery';
    const body = `<rect width="1200" height="630" fill="#0F172A"/><g transform="translate(80 65) scale(2)">${mark('#F8FAFC')}</g><g font-family="Arial"><text x="80" y="325" font-size="72" font-weight="750" fill="#F8FAFC">Git by</text><text x="300" y="325" font-size="72" font-weight="750" fill="#14B8A6">doing</text><text x="80" y="415" font-size="46" fill="#F8FAFC">${headline}</text><text x="80" y="493" font-size="28" fill="#CBD5E1">${detail}</text><text x="80" y="564" font-size="26" fill="#14B8A6">gitbydoing.com</text></g>`;
    const image = svg(body, 1200, 630, headline);
    await fs.writeFile(`${directory}/social${suffix}.svg`, image);
    execFileSync('magick', ['-font', rasterFont, '-background', 'none', `MSVG:${directory}/social${suffix}.svg`, `${directory}/social${suffix}.png`]);
  }

await fs.writeFile(`${directory}/brand-assets.json`, JSON.stringify({ productName: 'Git by doing', domain: 'gitbydoing.com', geometry: 'Native SVG reconstruction of the approved three-node branching arrow. Transparent pictograms and wordmarks, no raster artifacts.', colors: { ink: '#0F172A', inverse: '#F8FAFC', teal: '#14B8A6' }, socialSize: [1200, 630], files: ['logo.svg', 'logo-dark.svg', 'wordmark.svg', 'wordmark-dark.svg', 'favicon.svg', 'social.svg', 'social-it.svg', 'social.png', 'social-it.png'], fontLicense: 'fonts/Inter-OFL.txt' }, null, 2) + '\n');
