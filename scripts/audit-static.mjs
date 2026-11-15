import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
const pages=['','program/','tier/base/','tier/intermediate/','tier/advanced/'];
const canonicals=new Set();const titles=new Set();const descriptions=new Set();
for(const locale of ['it','en'])for(const page of pages){
 const file=`dist/${locale}/${page}index.html`;const html=await readFile(file,'utf8');const doc=new JSDOM(html).window.document;
 assert.equal(doc.documentElement.lang,locale,file);assert.equal(doc.querySelectorAll('h1').length,1,file);assert.equal(doc.querySelectorAll('title').length,1,file);const title=doc.title;assert(!titles.has(title),`duplicate title: ${file}`);titles.add(title);
 const description=doc.querySelector('meta[name=description]')?.content;assert(description?.length>60,file);assert(!descriptions.has(description),`duplicate description: ${file}`);descriptions.add(description);
 const canonical=doc.querySelector('link[rel=canonical]')?.href;assert(canonical?.includes(`/${locale}/${page}`),file);assert(!canonicals.has(canonical),file);canonicals.add(canonical);
 for(const lang of ['it','en']){const link=doc.querySelector(`link[hreflang=${lang}]`);assert.equal(link?.href,canonical.replace(`/${locale}/${page}`,`/${lang}/${page}`),file);}
 assert.equal(JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)['@type'],'Course');assert(doc.querySelector('meta[property="og:image"]')?.content.endsWith(locale==='it'?'social-it.png':'social.png'),file);
 assert.equal(doc.querySelectorAll('#static-content .curriculum li').length,page.startsWith('tier/')?12:36,file);assert(!html.includes('undefined'),file);
}
const sitemap=await readFile('dist/sitemap.xml','utf8');for(const url of canonicals)assert(sitemap.includes(url));assert.equal((sitemap.match(/<loc>/g)||[]).length,10);const robots=await readFile('dist/robots.txt','utf8');assert(robots.includes('Sitemap:')||robots.includes('Disallow: /'));
console.log('SEO static audit:10unique IT/EN pages, titles/descriptions, content, reciprocal hreflang, canonical, Course JSON-LD, social images and sitemap PASS.');
