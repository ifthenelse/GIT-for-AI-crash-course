# Audit di accessibilità del prodotto locale

Metodo: Accessibility Audit e checklist WCAG 2.2 Humbleteam, con markup TSX,
CSS, DOM renderizzato e screenshot Chromium. Scansioni axe nei temi chiaro/scuro;
interazioni da tastiera e viewport da 320 CSS px. Input e risultato si riferiscono
ai campioni sotto, non a una certificazione di conformità dell'intera applicazione.

## Problemi rilevati e risolti

| Priorità | Criterio | Problema | Correzione |
| --- | --- | --- | --- |
| P1 | 1.4.1 / 2.4.4 | link nel footer riconoscibile soltanto dal colore | sottolineatura permanente dei link nel testo; scansione axe ripetuta |
| P1 | 1.4.11 | bordi dei campi troppo deboli | token controllo distinti dai bordi decorativi: 3,49:1 chiaro, 4,86:1 scuro contro la superficie |
| P1 | 1.4.4 | righe del grafo ad altezza fissa sovrapposte ai controlli remote con testo al 200% | righe in em e SVG scalabile; regressione browser sul limite fra dettagli e remote |
| P1 | 3.3.1 / 3.3.2 | formato alias frontend diverso da quello accettato dal server | limiti 3–30, pattern Unicode e istruzione locale esplicita; errore testuale specifico |
| P2 | 2.1.1 / 2.4.7 | ingresso nel ridimensionamento senza focus nel primo campo | focus esplicito sulla larghezza; spostamento con frecce, Invio/Esc e menu alternativi al drag |
| P2 | 4.1.2 | dialoghi senza nome esplicito | aria-labelledby sui dialoghi e titoli associati |

## Criteri per ciascuno schermo

Ogni riga contabilizza il criterio separatamente per home, laboratorio e classifica.
**Verificato** significa nessun problema residuo nel campione esaminato.
**N/V** indica quanto il campione non può dimostrare. Nessun finding è soppresso.

| SC | Home | Laboratorio B01/B07 | Classifica |
| --- | --- | --- | --- |
| 1.1.1 contenuti non testuali | verificato: logo decorativo con nome testuale | verificato: DAG con elenco parent, SVG decorativo | verificato: icone decorative e testo |
| 1.3.1 relazioni | verificato: titoli, nav e liste | verificato: sezioni, fieldset/legend, elenco commit | verificato: table/th e filtro etichettato |
| 1.4.3 contrasto testo | verificato: palette e axe nei due temi | verificato: palette/terminale e axe nei due temi | verificato: palette e axe nei due temi |
| 1.4.4 testo al 200% | verificato: screenshot, testi e CTA leggibili | verificato nel campione: scroll/ingrandimento e grafo corretto | verificato: stato vuoto e controlli; dati tabellari lunghi fuori campione |
| 1.4.10 reflow | verificato a 320 px, larghezza documento 320 | verificato a 320 px, finestre recuperabili dal dock | verificato a 320 px; tabella con overflow locale |
| 1.4.11 contrasto non testuale | verificato: controlli e focus | verificato: bordi, icone e nodi del grafo | verificato: selettore e focus |
| 2.1.1 tastiera | verificato: link, lingua, tema e tier | verificato: terminale, editor, dock, menu, move/resize e overview | verificato: navigazione e selettore nativi |
| 2.1.2 assenza trap | verificato nel percorso esaminato | verificato: Tab lascia terminale/editor; Esc chiude overview | verificato: controlli nativi |
| 2.4.4 scopo link | verificato: etichette descrittive | verificato: elenco lezioni e fonti ufficiali | verificato: navigazione e profilo |
| 2.4.6 titoli/etichette | verificato: H1 e sezioni | verificato: finestre e campi associati | verificato: titolo e intestazioni |
| 2.4.7 focus visibile | verificato: outline 3 px | verificato: outline, titlebar e ridimensionamento | verificato: outline sui controlli |
| 2.4.11 focus non oscurato | verificato nel percorso da tastiera | verificato: attivazione porta la finestra davanti; minimize restituisce focus al dock | verificato: nessun overlay fisso nel campione |
| 2.5.8 target minimo | verificato: pulsanti ≥24 CSS px; link inline esenti | verificato: chrome 24×25 px, dock e menu; link nel testo esenti | verificato: filtro e pulsanti; link inline esenti |
| 3.2.2 input | verificato: tema/lingua espliciti | verificato: editor senza invio implicito e form espliciti | verificato: filtro aggiorna lo stesso contesto |
| 3.3.1 errori | N/V: nessun errore di form home nel campione | verificato: comandi rifiutati, obiettivi aperti e invio pendente descritti in testo | N/V: errori di form del profilo fuori dalla schermata classifica |
| 3.3.2 istruzioni | verificato: selettore accessibile | verificato: label, aiuto terminale e compito; formato alias nel dialogo profilo | verificato: livello etichettato |
| 3.3.8 autenticazione | N/V: provider reale non configurato | N/V: il provider locale non prova l'accessibilità di GitHub | N/V: provider esterno fuori dal campione |
| 4.1.2 nome/ruolo/valore | verificato: controlli nativi e nomi accessibili | verificato: radio, menu espansi, finestre, dialoghi nominati | verificato: select e tabella semantica |

Nessuna sezione P0, P1 o P2 residua nel perimetro esaminato. Restano da verificare
con l'ambiente pubblico il provider sociale reale e, con persone e tecnologie
assistive, lettura estesa del corso e combinazioni ulteriori di finestre/dati.
Axe non esamina tutti i criteri e non sostituisce queste prove.

## Misure ed evidenze

| Coppia testo/superficie | Chiaro | Scuro |
| --- | ---: | ---: |
| testo principale | 14,28:1 | 12,94:1 |
| testo secondario | 6,08:1 | 8,28:1 |
| testo CTA/CTA | 5,38:1 | 11,24:1 |
| bordo controllo/superficie | 3,49:1 | 4,86:1 |
| focus/superficie | 7,01:1 | 10,97:1 |

Calcolo sRGB sulle coppie effettive in styles.css, non stima a vista. Screenshot
a 1280/1440 px, 320 px e dimensione dei testi raddoppiata sono in
`.tmp/screenshots/`. Il controllo di larghezza ha restituito 320/320 e 1280/1280
nei tre schermi. Gli overflow interni di editor, terminale e tabella restano
scorribili. L'anteprima decorativa della home è aria-hidden.

`npm run test:e2e` ripete sei scansioni axe (tre schermi × due temi) e i percorsi
di tastiera. Sono inclusi minimo/ripristino, move/resize, overview con Esc,
uscita dal terminale con Tab, salvataggio e stato pendente offline.
