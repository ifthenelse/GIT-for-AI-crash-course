import fs from 'node:fs/promises';
import path from 'node:path';
import { lessons } from '../packages/course-content/src/index.ts';

const root = path.resolve('dist');
const template = (await fs.readFile(path.join(root, 'index.html'), 'utf8')).replace(/<title>[\s\S]*?<\/title>/g, '').replace(/<meta (?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '').replace(/<link rel="(?:canonical|alternate)"[^>]*>/g, '').replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '').replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');
const site = new URL(process.env.SITE_URL || 'http://localhost:4173/');
if (!site.pathname.endsWith('/')) site.pathname += '/';
const local = ['localhost', '127.0.0.1'].includes(site.hostname);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const names = { it: { title: 'Git Practice Lab', course: 'Il percorso completo', base: 'Git: le basi', intermediate: 'Collaborare con Git', advanced: 'Git avanzato e recupero', description: 'Impara a collaborare con Git: 36 moduli interattivi su GitHub e Azure DevOps, dalle basi al recupero del lavoro.', intro: 'Collabora con Git sapendo cosa cambia e come recuperare il lavoro.', open: 'Apri il laboratorio', program: 'Esplora il programma', home: 'Home', lang: 'English' }, en: { title: 'Git Practice Lab', course: 'The complete course', base: 'Git foundations', intermediate: 'Git collaboration', advanced: 'Advanced Git and recovery', description: 'Learn to collaborate with Git: 36 interactive modules for GitHub and Azure DevOps, from the basics to recovering your work.', intro: 'Collaborate with Git knowing what changes and how to recover your work.', open: 'Open the lab', program: 'Explore the curriculum', home: 'Home', lang: 'Italiano' } };
const pages = [];
for (const locale of ['it', 'en']) {
  for (const kind of ['', 'program/', 'tier/base/', 'tier/intermediate/', 'tier/advanced/']) {
    const relative = `${locale}/${kind}`;
    const t = names[locale];
    const tier = kind.startsWith('tier/') ? kind.split('/')[1] : null;
    const selected = tier ? lessons.filter((l) => l.tier === tier) : lessons;
    const description = tier ? `${locale === 'it' ? 'Corso' : 'Course'} ${t[tier]}: ${selected.slice(0,3).map(l=>l.title[locale]).join(', ')}. ${locale === 'it' ? '12 moduli pratici Git con scenari nel browser e guide ufficiali.' : '12 practical Git modules with browser scenarios and official guides.'}` : kind ? `${locale === 'it' ? 'Programma completo: 36 moduli Git in tre corsi, dalle configurazioni e SSH a merge, PR, rebase e recupero. Esercitati nel laboratorio visuale.' : 'Complete curriculum:36 Git modules in three courses, from configuration and SSH to merging, PRs, rebasing and recovery. Practise in the visual lab.'}` : t.description;
    const title = tier ? `${t[tier]} · ${t.title}` : kind ? `${t.course} · ${t.title}` : `${t.title} · ${locale === 'it' ? 'Corso interattivo di Git' : 'Interactive Git course'}`;
    const url = new URL(relative, site).href;
    const other = locale === 'it' ? 'en' : 'it';
    const alternate = new URL(`${other}/${kind}`, site).href;
    const program = new URL(`${locale}/program/`, site).href;
    const body = `<main id="static-content"><nav aria-label="${locale === 'it' ? 'Navigazione' : 'Navigation'}"><a href="${new URL(`${locale}/`, site)}">${t.home}</a> · <a href="${program}">${t.program}</a> · <a href="${alternate}" lang="${other}" hreflang="${other}">${t.lang}</a></nav><h1>${esc(title)}</h1><p>${esc(t.intro)}</p><p>${esc(description)}</p><a href="#/course">${t.open}</a><ul>${["base","intermediate","advanced"].map(id=>`<li><a href="${new URL(`${locale}/tier/${id}/`,site)}">${t[id]}</a></li>`).join("")}</ul><ol class="curriculum">${selected.map((l) => `<li><h2>${esc(l.id)} · ${esc(l.title[locale])}</h2><p>${esc(l.summary[locale])}</p></li>`).join('')}</ol><noscript>${locale === 'it' ? 'Il programma è leggibile senza JavaScript. Il laboratorio interattivo richiede JavaScript.' : 'The curriculum is readable without JavaScript. The interactive lab requires JavaScript.'}</noscript></main>`;
    const schema = { '@context': 'https://schema.org', '@type': 'Course', name: title, description, inLanguage: locale, url, provider: { '@type': 'Organization', name: 'Git Practice Lab' } };
    const meta = `<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${local ? 'noindex,nofollow' : 'index,follow'}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="${locale}" href="${url}"><link rel="alternate" hreflang="${other}" href="${alternate}"><link rel="alternate" hreflang="x-default" href="${new URL(`it/${kind}`, site)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${new URL(locale === 'it' ? 'social-it.png' : 'social.png', site)}"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
    const html = template.replace(/<html[^>]*>/, `<html lang="${locale}">`).replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta\s+name="description"[^>]*>/g, '').replace('</head>', `${meta}</head>`).replace(/<div id="root"><\/div>/, `<div id="root">${body}</div>`);
    const dir = path.join(root, relative); await fs.mkdir(dir, { recursive: true }); await fs.writeFile(path.join(dir, 'index.html'), html);
    pages.push({ url, locale, alternate });
  }
}
await fs.copyFile(path.join(root, 'it/index.html'), path.join(root, 'index.html'));
await fs.copyFile(path.join(root, 'it/index.html'), path.join(root, '404.html'));
await fs.writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${pages.map((p) => `<url><loc>${esc(p.url)}</loc><xhtml:link rel="alternate" hreflang="${p.locale}" href="${esc(p.url)}"/><xhtml:link rel="alternate" hreflang="${p.locale === 'it' ? 'en' : 'it'}" href="${esc(p.alternate)}"/></url>`).join('')}</urlset>`);
await fs.writeFile(path.join(root, 'robots.txt'), local ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', site)}\n`);
console.log(`Prerendered ${pages.length} public pages (IT/EN); ${local ? 'local preview is noindex' : 'canonical URL: ' + site.href}`);
