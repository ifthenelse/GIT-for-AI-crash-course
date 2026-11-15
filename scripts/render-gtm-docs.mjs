import fs from 'node:fs/promises';
import { JSDOM } from 'jsdom';

// Render the Markdown subset used by the canonical plans. Preserve the existing
// embedded design system; all narrative and roadmap labels come from Markdown.
const documents = [
  ['00-gtm-plan', 'GTM plan'],
  ['01-business-snapshot', '1 Business snapshot'],
  ['02-market-map', '2 Market map'],
  ['03-positioning', '3 Positioning'],
  ['04-demand-plan', '4 Demand plan'],
  ['05-roadmap', '5 Roadmap'],
];
const escape = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const slug = value => value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
function inline(value) {
  const tokens = [];
  const token = html => { tokens.push(html); return `@@HTML${tokens.length - 1}@@`; };
  let text = value.replace(/(?:\*\*)?IT:(?:\*\*)?\s*«([^»]+)»/g, (_, quote) => token(`<strong>IT:</strong> <span lang="it">«${inline(quote)}»</span>`));
  text = text.replace(/`([^`]+)`/g, (_, code) => token(`<code>${escape(code)}</code>`));
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => token(`<a href="${escape(href)}">${inline(label)}</a>`));
  text = escape(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return text.replace(/@@HTML(\d+)@@/g, (_, index) => tokens[Number(index)]);
}
function cells(line) {
  const result = []; let cell = ''; let code = false;
  for (const char of line.trim().replace(/^\|/, '').replace(/\|$/, '')) {
    if (char === '`') code = !code;
    if (char === '|' && !code) { result.push(cell.trim()); cell = ''; } else cell += char;
  }
  result.push(cell.trim()); return result;
}
function renderMarkdown(markdown) {
  const lines = markdown.split('\n'); const output = [];
  let section = false;
  const closeSection = () => { if (section) output.push('</div></section>'); section = false; };
  const ensureSection = () => { if (!section) { output.push('<section class="section"><div class="grid">'); section = true; } };
  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line || /^# /.test(line)) { index++; continue; }
    const heading = /^(#{2,6})\s+(.+)$/.exec(line);
    if (heading) {
      if (heading[1].length === 2) {
        closeSection();
        output.push(`<section class="section chapter" id="${slug(heading[2])}"><header class="section__head"><h2 class="section__title">${inline(heading[2])}</h2></header><div class="grid">`);
        section = true;
      } else { ensureSection(); const level = heading[1].length; output.push(`<h${level} id="${slug(heading[2])}">${inline(heading[2])}</h${level}>`); }
      index++; continue;
    }
    ensureSection();
    if (line.startsWith('|') && /^\|?\s*:?-{3}/.test(lines[index + 1]?.trim() ?? '')) {
      const headers = cells(line); index += 2; const rows = [];
      while (lines[index]?.trim().startsWith('|')) rows.push(cells(lines[index++]));
      output.push(`<div class="table-wrap"><table class="tbl"><thead><tr>${headers.map(cell => `<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^```/.test(line)) {
      index++; const code = []; while (index < lines.length && !/^```/.test(lines[index])) code.push(lines[index++]); index++;
      output.push(`<pre><code>${escape(code.join('\n'))}</code></pre>`); continue;
    }
    if (/^(?:[-*+] |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line); const tag = ordered ? 'ol' : 'ul'; const items = [];
      while (index < lines.length) {
        const match = /^(?:[-*+] |\d+\. )(.+)$/.exec(lines[index].trim()); if (!match) break;
        let text = match[1]; index++;
        while (index < lines.length && /^\s{2,}\S/.test(lines[index]) && !/^\s*(?:[-*+] |\d+\. )/.test(lines[index])) text += ` ${lines[index++].trim()}`;
        items.push(`<li>${inline(text.replace(/^\[x\]\s*/i, '✓ ').replace(/^\[ \]\s*/, '☐ '))}</li>`);
      }
      output.push(`<${tag}>${items.join('')}</${tag}>`); continue;
    }
    if (/^---+$/.test(line)) { output.push('<hr>'); index++; continue; }
    const paragraph = [line]; index++;
    while (index < lines.length && lines[index].trim() && !/^(?:#{1,6}\s|\||[-*+] |\d+\. |```)/.test(lines[index].trim())) paragraph.push(lines[index++].trim());
    const text = paragraph.join(' ');
    output.push(text.startsWith('> ') ? `<blockquote>${inline(text.replace(/^>\s*/g, ''))}</blockquote>` : `<p style="max-width:90ch">${inline(text)}</p>`);
  }
  closeSection(); return output.join('\n');
}
function roadmap(markdown) {
  const rows = markdown.split('\n').filter(line => /^\| I[1-6] \|/.test(line)).map(cells);
  if (rows.length !== 6) throw new Error('The roadmap must retain its six initiatives.');
  const ranges = [[1, 4], [3, 6], [6, 9], [8, 12], [11, 14]];
  return `<section class="section"><header class="section__head"><h2 class="section__title">Indicative 90-day roadmap</h2><p class="section__aside">The bars summarize the stated windows. They are not delivery commitments.</p></header><div class="gantt" role="region" aria-label="Indicative roadmap, scroll horizontally" tabindex="0"><div class="gantt__inner"><div class="g-row g-row--head"><div class="g-label">Initiative and owner</div><div class="g-track">${Array.from({ length: 13 }, (_, index) => `<div class="g-week">W${index + 1}</div>`).join('')}</div></div>${rows.map((row, index) => `<div class="g-row"><div class="g-label"><h4><span class="n">${inline(row[0])}</span> ${inline(row[1])}</h4><p>${inline(row[5])}</p><p>Impact: ${inline(row[3])} · Effort: ${inline(row[4])}<br>Depends on: ${inline(row[6])}<br>${inline(row[8])}</p></div><div class="g-track">${index < ranges.length ? `<div class="bar bar--in" style="grid-column:${ranges[index][0]} / ${ranges[index][1]}"><span class="ms" title="${escape(row[7])}">${inline(row[7])}</span></div>` : `<p style="grid-column:1 / 14">${inline(row[8])} ${inline(row[7])}</p>`}</div></div>`).join('')}</div></div></section>`;
}
const roadmapSource = await fs.readFile('gtm-plan/05-roadmap.md', 'utf8');
for (const [name, label] of documents) {
  const source = await fs.readFile(`gtm-plan/${name}.md`, 'utf8');
  const previous = await fs.readFile(`gtm-plan/${name}.html`, 'utf8');
  const style = previous.match(/<style>([\s\S]*?)<\/style>/)?.[1];
  if (!style) throw new Error(`Missing existing design system: ${name}`);
  const title = source.match(/^# (.+)$/m)?.[1] ?? label;
  const metadata = source.match(/^\*([^*]+)\*$/m)?.[1] ?? 'Approved planning record · 15 November 2026';
  const navigation = documents.map(([id, caption]) => `<a data-tab="${id.slice(0, 2)}" href="${id}.html"${id === name ? ' aria-current="page"' : ''}>${caption}</a>`).join('');
  const contents = name === '00-gtm-plan' ? `<nav class="toc" aria-label="Plan chapters"><div class="wrap">${[...source.matchAll(/^## (.+)$/gm)].map(([, heading]) => `<a href="#${slug(heading)}">${inline(heading)}</a>`).join('')}</div></nav>` : '';
  const description = `${label} for the independent Git Practice Lab. Approved scope, evidence, assumptions and zero-cost release gates.`;
  const html = `<!doctype html>\n<!-- Generated from ${name}.md by node scripts/render-gtm-docs.mjs. -->\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(description)}"><title>${escape(title)}</title><style>${style}</style></head><body><header class="hero"><div class="wrap"><div class="hero__top"><p class="eyebrow"><span>GTM Planner</span><span>${label}</span></p><p class="status status--ok">${escape(metadata)}</p></div><div class="hero__body"><h1 class="hero__title hero__title--wide">${inline(title)}</h1></div><nav class="tabs tabs--row" aria-label="Planning documents">${navigation}</nav></div></header>${contents}<main class="wrap">${['00-gtm-plan', '05-roadmap'].includes(name) ? roadmap(roadmapSource) : ''}${renderMarkdown(source)}</main><a class="credit" href="https://rev-ops.studio/gtm-planner" target="_blank" rel="noopener noreferrer"><div class="wrap"><span class="credit__mark" aria-hidden="true"></span><span class="credit__text">Created with <b>GTM Planner</b>, a free Claude plugin by RevOps Studio</span><span class="credit__url">rev-ops.studio/gtm-planner →</span></div></a></body></html>\n`;
  const document = new JSDOM(html).window.document;
  if (document.querySelectorAll('h1').length !== 1 || document.documentElement.lang !== 'en') throw new Error(`Invalid rendered document: ${name}`);
  await fs.writeFile(`gtm-plan/${name}.html`, html);
}
console.log('Rendered six English GTM views from canonical Markdown, preserving existing styles and roadmap windows.');
