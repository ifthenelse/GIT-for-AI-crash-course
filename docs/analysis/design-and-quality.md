# Identità visiva e piano di verifica

Proposta iniziale approvata. Logo, asset e interfaccia sono implementati. I token effettivi e i risultati degli audit sono in `docs/audits/`; le tabelle seguenti conservano i valori valutati in analisi.
Metodo: skill Design con dipendenze brand/design-system; SEO Audit locale;
Accessibility Audit e checklist upstream. Fonti in [skills.md](skills.md).

## Palette e tipografia

Laboratorio professionale con superfici neutre e accento teal. Ogni stato usa
anche testo o simboli; il grafo distingue i branch con nomi e stili di linea.
Token su tre livelli: primitivi, semantici, componente.

| Token | Chiaro | Scuro |
| --- | --- | --- |
| Sfondo | `#F7FAFC` | `#0C1822` |
| Superficie | `#FFFFFF` | `#132735` |
| Testo | `#142B3D` | `#EDF4F8` |
| Testo secondario | `#526575` | `#ADBFCC` |
| Azione/link | `#086F6B` | `#5EEAD4` |
| Testo su azione | `#FFFFFF` | `#082C2A` |
| Bordo controllo | `#738797` | `#6C8799` |
| Focus | `#005FCC` | `#93C5FD` |
| Successo | `#166534` | `#86EFAC` |
| Avviso | `#854D0E` | `#FDE68A` |
| Errore | `#B42318` | `#FDA4AF` |

Contrasti calcolati con luminanza relativa sRGB, linearizzazione a `0.04045` e
rapporto `(Lmaggiore + 0.05) / (Lminore + 0.05)`:

| Coppia | Chiaro | Scuro |
| --- | ---: | ---: |
| Testo / superficie | 14,56:1 | 13,80:1 |
| Secondario / superficie | 6,04:1 | 8,11:1 |
| Primario / superficie | 6,01:1 | 10,37:1 |
| Testo CTA / CTA | 6,01:1 | 10,11:1 |
| Bordo / superficie | 3,72:1 | 4,06:1 |
| Focus / superficie | 5,98:1 | 8,50:1 |

Sono misure delle sole coppie proposte, non conformità dell'interfaccia.
Hover, selezione, evidenziazione del codice e altri abbinamenti vanno misurati.

Due famiglie: **Inter** per titoli, testo didattico, navigazione, HUD e classifica;
**JetBrains Mono** per terminale, editor, comandi, hash e branch. WOFF2 self-hosted,
sole varianti necessarie, licenze OFL distribuite, fallback e `font-display: swap`.
Testo 16–18 px, interlinea 1,6, larghezza circa 65 caratteri. Terminale/editor
ridimensionabili da 16 px; ligature disattivate; numeri tabulari per tempi e score.

## Layout e interazione

Desktop: griglia iniziale 2×2 con terminale, grafo, editor e portale repository.
Le finestre sono impilabili, riordinabili, ridimensionabili e minimizzabili anche
su viewport piccoli. Dock, panoramica e preset permettono di recuperare ogni
finestra. Nessuna interazione soltanto tramite trascinamento.
Specifica del [window manager](../window-manager.md), separata dallo stato Git.

Home con tier Base/Intermedio/Avanzato e stati testuali Disponibile, In corso,
Completato, Bloccato. HUD con tier, esercizio, obiettivo, stato sincronizzazione
e tempo secondo le regole da concordare. Classifica in tabella semantica con
filtri tier/versione, alias, punteggio e durata; nessuna informazione solo a colore.

Grafo con elenco testuale di commit/parent/refs; nessuna azione solo drag-and-drop.
Terminale con campo accessibile, log esplorabile e annunci concisi del nuovo esito.
Editor con modalità testo semplice e senza trappole da tastiera. Riduzione delle
animazioni e focus conservato quando cambia lo stato del laboratorio.

## Logo: brief per l'operatività

Pittogramma originale con linea di commit che si biforca e si ricongiunge, tre nodi
per i livelli, leggibile a 16–24 px. Evitare imitazioni dei marchi Git e delle piattaforme.
Due varianti per sfondi chiari/scuri e versione monocromatica.

Output richiesto dopo approvazione: SVG nativo trasparente, `viewBox`, tracciati
originali, niente raster incorporato, sfondo o riferimenti esterni. La trasparenza
richiesta dall'utente prevale sull'indicazione di sfondo bianco della skill Design.
Un PNG generato non può essere descritto come SVG vettoriale.
Derivati: favicon, icone 192/512, header, home e social card 1200×630.
La social card può avere un proprio sfondo, preservando il logo trasparente.

## Lingue e messaggi

i18next per tutte le stringhe UI, errori, dialoghi e alternative accessibili.
Comandi e output Git canonici distinguibili dalle spiegazioni tradotte.
Lingua del documento, plurali, numeri e durate corretti; cambio lingua senza
perdita dello scenario. Italiano e inglese completi al lancio sono confermati:
lezioni, aiuti, errori, guide OS, messaggi e alternative accessibili, oltre alla UI.
Le stringhe nuove non tradotte bloccano il rilascio di entrambe le lingue.

Microcopy revisionata con Copy Editing:

- «Completa il livello Base per iniziare Intermedio.»
- «Salvato sul dispositivo. In attesa di sincronizzazione.»
- «Progressi sincronizzati.»
- «Il salvataggio non è riuscito. Il tuo lavoro è disponibile su questo dispositivo.»
- «Il comando non è ancora supportato in questo laboratorio.» Segue, se pertinente, l'alternativa supportata.

Il completamento locale non viene chiamato definitivo prima della conferma API.
UI italiana: «Classifica»; etichetta inglese: «Leaderboard».

## SEO: stato e piano

**Audit del prodotto non eseguito:** mancano app, HTML applicativo e URL distribuito.
Non esistono punteggi, dati Search Console o esiti di indicizzazione verificati.

1. Prerender pubblico di home, programma e descrizioni tier; laboratorio e dati personali non indicizzabili.
2. URL stabili per lingua, self-canonical, hreflang reciproci e sitemap coerente.
3. Base path Pages, refresh e apertura diretta verificati su ogni pagina distribuita.
4. Title/description unici, heading coerenti, fonti tecniche e data di revisione; traduzioni complete.
5. Open Graph con social card effettivamente disponibile; link interni reali.
6. Eventuale JSON-LD verificato nel DOM renderizzato o con Rich Results Test; niente diagnosi da solo fetch.
7. Misurare LCP, INP e CLS, distinguendo laboratorio e dati reali dopo rilascio.
8. Pagine personali e callback non indicizzabili; noindex non sostituisce l'autorizzazione API.

Report futuro: problema, evidenza/URL, impatto, correzione, priorità e riesito.

## Accessibilità: stato e piano

**Audit del prodotto non eseguito:** la skill richiede screenshot, URL o markup e
vieta conclusioni dedotte da una sola descrizione. Nessun criterio dichiarato conforme.

Campione futuro: home, tier bloccato, laboratorio normale/conflitto/errore/offline,
login e classifica, in entrambi i temi. Verificare tutti i 18 criteri della checklist
upstream: ogni criterio termina in rilievo, verifica con prova o non verificabile.

Evidenze: DOM e nomi accessibili; percorso da tastiera; focus visibile/non coperto;
assenza di trappole; vista a 320 CSS px, testo al 200%; dimensione target secondo
SC 2.5.8 e relative eccezioni, con obiettivo 44 px sui controlli principali;
errori associati ai campi; tab con stati corretti; autenticazione accessibile;
verifica umana con tecnologie assistive. Rilievi P0/P1/P2 con criterio WCAG,
correzione e nuova verifica. Il risultato non sarà una certificazione legale.

## Fonti

- [Design e dipendenze](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills)
- [Accessibility Audit](https://github.com/humbleteam/accessibility-audit)
- [Licenza Inter](https://github.com/rsms/inter/blob/master/LICENSE.txt)
- [Licenza JetBrains Mono](https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt)
