# Audit SEO locale

Metodo: skill SEO Audit. Input: HTML prodotto dalla build, sitemap/robots,
componenti React e pagine effettivamente aperte in Chromium. Non sono disponibili
un sito pubblico, Search Console, ranking, dati di traffico o Core Web Vitals reali.

## Esito e correzioni

| Problema rilevato | Impatto | Correzione ed evidenza |
| --- | --- | --- |
| SPA inizialmente priva di contenuto HTML utile | alto | prerender di home, programma e tre tier in IT/EN: 10 pagine con titoli, sintesi e 36/12 moduli leggibili senza JS |
| Titoli home IT/EN identici e descrizioni ripetute | medio | titoli e descrizioni unici; controllo con `npm run audit:seo` |
| Link pubblici disponibili solo come hash | medio | programma e tier hanno URL reali e link nel contenuto statico; navigazione React conserva la sessione |
| Preview locale potenzialmente indicizzabile | medio | build senza SITE_URL usa localhost e `noindex,nofollow`, robots Disallow |
| Base path delle repository Pages | alto | build sotto `/git-practice/`, 10 URL senza JS e corso/laboratorio idratati EN: nessun asset 404 o errore pagina |
| Immagine sociale sempre inglese | basso | social-it.png per italiano e social.png per inglese, con dimensioni 1200×630 |

Ogni pagina pubblica ha canonical, alternates IT/EN reciproci e x-default, lingua
HTML, una H1, meta description, Open Graph e JSON-LD Course. Il test legge il
JSON-LD dal documento completo: non usa una rappresentazione che rimuove script.
La sitemap contiene i dieci URL canonici. Il programma e le tre pagine tier sono
collegati esplicitamente. Font e asset sono serviti localmente.

La prova con dominio `example.test` è una fixture locale e non costituisce una
pubblicazione. Il laboratorio viene caricato in un chunk differito; la build
misurata comprende circa 139 kB gzip iniziali di JavaScript e 26 kB per il
laboratorio, oltre a CSS e font. Non sono misure di LCP/INP/CLS o traffico reale.

## Riproduzione e gate pubblici

```bash
npm run build
npm run audit:seo
```

Prima del lancio impostare URL e base path reali, provare risposte HTTP/deep link,
HTTPS e canonical sul sito distribuito, controllare il bundle senza segreti e
verificare l'indicizzabilità. Registrazione Search Console e misure sul campo
rimangono attività esterne da autorizzare. La presenza di Course JSON-LD non
promette rich results o posizionamenti.
