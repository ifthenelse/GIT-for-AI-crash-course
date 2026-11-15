# Verifiche dell'implementazione locale

Ambiente: Node.js **24.22.1**, TypeScript 7, Chromium di sistema **156**.
`.node-version` rimane 26: la suite non è stata eseguita su Node 26 in questa sessione.
Nessuna prova applicativa usa credenziali reali o crea risorse cloud. La CI definisce
un job browser per ripetere E2E/axe oltre ai controlli statici.

## Comandi e perimetro

| Comando | Verifica |
| --- | --- |
| `scripts/verify` | controllo tipi e 63 test unitari/integrati |
| `npm run build` | TypeScript, Vite, 10 pagine statiche IT/EN |
| `npm run audit:seo` | titoli/descrizioni unici, canonical, hreflang, contenuti, JSON-LD, immagini e sitemap |
| `npm run test:e2e` | 16 scenari: browser → API locale → SQLite → risposta → UI; axe e tastiera |

Playwright avvia API 8788 e frontend 4173, usa un database isolato `.tmp/e2e.sqlite`
che il suo setup ricrea, e rileva `/usr/bin/chromium`. In altri ambienti impostare
`PLAYWRIGHT_CHROMIUM_EXECUTABLE` oppure installare il browser Playwright compatibile.
Il download CDN dei browser non era disponibile in questa sessione: la suite ha
usato con successo Chromium di sistema. Il database di sviluppo resta separato.

## Risultati e invarianti

- Catalogo: 36 moduli, 12 per tier, testi IT/EN completi, obiettivo iniziale aperto;
  tutte le soluzioni passano azione per azione e tramite replay, senza mutare il seed.
- Motore: staging selettivo, reset soft/mixed/hard e contenuti merge/revert
  confrontati con Git reale in repository temporanee. Conflitti, rebase, worktree,
  undo/redo/reset e input ostili verificati; non si promette equivalenza universale.
- Stato: Zundo e log di replay coincidono; reset svuota la cronologia dello scenario.
  Nel browser undo dopo un risultato salvato non revoca il completamento.
- API: proprietà risorse, tier, versione, risultati inventati, scadenza/revoca,
  idempotenza, concorrenza, opt-in/opt-out, challenge e handoff monouso.
- Catalogo reale via API/SQLite: tutte le 36 POST finali accettate, tre tier da
  1.200 punti, sblocco progressivo, primi tempi conservati dopo una ripetizione.
- Persistenza: archivio chiuso/riaperto, nuovo login e refresh recuperano risultati;
  richiesta finale pendente offline sincronizzata alla riconnessione.
- UI: lingua e tema persistenti, finestre recuperabili a 320 px, spostamento e
  ridimensionamento da tastiera, overview, editor/staging/terminale/grafo coerenti.
- Accessibilità/SEO: [report con ambito, evidenze e limiti](audits/README.md).

È stata provata anche una build con base `/git-practice/` e canonical di fixture
`https://example.test/git-practice/`: dieci pagine senza JS, corso e laboratorio EN
idratati, senza asset 404 o errori della pagina. Non è una distribuzione pubblica.

Microbenchmark locale del solo motore: 720 replay delle soluzioni (20×36), mediana
circa 0,13 ms, p95 circa 0,86 ms, massimo circa 2,29 ms. Esclude avvio moduli,
autenticazione, API, database e payload avversi: **non certifica il budget Worker
Free** e non giustifica l'attivazione di risorse pubbliche.

## Gate prima del lancio

OAuth GitHub reale e navigazione fra origini con cookie terze parti bloccati;
runtime D1/Worker e CPU sui casi massimi; quote e blocco senza addebiti;
backup/ripristino pubblico, retention e cancellazione dei dati; pilot con persone
per comprensione IT/EN e tecnologie assistive. Google, Microsoft e LinkedIn sono
fasi successive; Apple rimane disabilitato. Le prove locali non coprono tali servizi.
