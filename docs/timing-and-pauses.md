# Tempo ufficiale e pause stimate

Requisiti confermati: avvio registrato dal server, tempo trascorso e uso dei
segnali di visibilità per cercare di stimare interruzioni. Questa è una specifica
proposta; nessun listener o endpoint è ancora implementato.

## Misure e impiego

| Misura | Origine | Uso |
| --- | --- | --- |
| `elapsedMs` | ricezione del primo completamento valido meno avvio, entrambi server | durata ufficiale dell'esercizio |
| `visibleMsEstimated` | intervalli con documento visibile | riepilogo personale stimato |
| `focusedVisibleMsEstimated` | documento visibile e finestra con focus | tempo di studio stimato, senza prova di attenzione |
| `hiddenMsEstimated` | intervalli con documento nascosto | pausa stimata |
| `unfocusedVisibleMsEstimated` | visibile, senza focus | interruzione possibile, distinta dalla pagina nascosta |
| transizioni | conteggi separati hidden/visible e focus/blur | riepilogo delle interruzioni osservate |
| `coverage` | continuità della raccolta | `complete`, `partial` o `truncated` |

La durata server comprende letture, pause e attesa fino alla ricezione valida.
Le stime non vengono sottratte dal tempo ufficiale, non alterano i punti e non
bloccano sblocchi/completamenti. Una pagina visibile può essere incustodita;
consultare documentazione in un'altra finestra può essere parte dello studio.
Nessuna penalità per cambio scheda o uso di strumenti assistivi.

Il timer «Tempo di studio stimato» si interrompe quando la pagina è nascosta o
la finestra perde focus e riprende quando è visibile e focalizzata. Gli intervalli
restano distinguibili nel riepilogo. Non chiamarlo misura dell'attenzione.

## Eventi e macchina a stati

- Listener principale su **`document`**, evento minuscolo `visibilitychange`;
  leggere subito `document.visibilityState`.
- `window.blur`/`window.focus` aggiungono un segnale indipendente. Blur non
  implica pagina nascosta: può dipendere da browser chrome, dialoghi o schermi affiancati.
- `pagehide` chiude il segmento del documento; `pageshow` rilegge stato e focus.
  Quando `event.persisted` è vero, gestire BFCache senza creare un nuovo tentativo server.
- All'inizio e alla fine campionare lo stato, anche in assenza di transizioni.
- Deduplicare stati ripetuti. `hidden` seguito da `pagehide` non aggiunge due pause.
- Focus e selezione tra le quattro finestre simulate sono eventi interni al
  documento: non devono generare pause o perdite di focus della finestra browser.

Gli stati temporali sono disgiunti: visibile/focalizzato, visibile/non focalizzato,
nascosto, non osservato. Non sommare blur e hidden come durate sovrapposte.
Il client non osserva applicazioni, finestre o indirizzi esterni.

## Orologio, lifecycle e recupero

Usare `performance.now()` per gli intervalli nello stesso documento. Reload e
navigazioni creano segmenti con identificativo diverso: non sottrarre timestamp
di documenti differenti. I timer ripetuti servono soltanto a ridisegnare la UI;
non sommare tick, perché le pagine in background possono subire throttling.

Sleep, sospensione mobile, chiusura forzata e ultimi eventi persi possono lasciare
buchi. `performance.now()` durante lo sleep non avanza uniformemente su tutti
i browser/sistemi: un intervallo visibile lungo non prova attività continuativa.
I buchi diventano tempo non osservato e copertura parziale, senza inventare
pause o attenzione. Anche la raccolta completa di eventi non prova attenzione.

Persistenza locale durante il lavoro e sulle transizioni, con salvataggio
anticipato dei cambi di scenario. Non affidarsi a `unload`/`beforeunload` o a
una richiesta di rete eseguita mentre la pagina si chiude. La POST finale resta
idempotente e ritentabile tramite coda locale.

Se il completamento avviene offline, l'orario client non retrodata il risultato
ufficiale: il ritardo fino all'accettazione server è incluso e dichiarato nella UI.
Un retry dopo l'accettazione restituisce il risultato originario senza aumentare il tempo.

## Protocollo candidato

Includere nel POST finale un ledger opzionale con versione, copertura, eventi
omessi e segmenti. Ogni segmento contiene un `documentId`; ogni evento contiene
sequenza, offset relativo, causa, visibilità, focus e `persisted` quando pertinente.
Niente heartbeat o endpoint di analytics separati.

Limiti proposti da validare: 512 eventi e 32 KiB per tentativo, durate con precisione
non superiore a quella necessaria, ad esempio arrotondate a 100 ms. Superato il
limite, contare eventi omessi e indicare `truncated`; l'esercizio rimane completabile.

Il server verifica limiti, enum, ordine e valori finiti/non negativi e ricalcola
gli aggregati. Questi restano dichiarazioni del browser: `event.isTrusted` non
certifica l'attendibilità del payload HTTP. Telemetria assente o non valida rende
indisponibili le sole stime; non annulla un esercizio altrimenti verificato.
Il registro delle azioni Git segue limiti e validazione separati.

## Più schede e privacy

Un solo writer locale per tentativo, coordinato tra schede; le altre offrono un
passaggio esplicito del controllo. Coordinamento e lock browser migliorano la UI,
non costituiscono una barriera antifrode. Il server conserva proprietà del
tentativo, unicità e idempotenza anche con dispositivi differenti.

Preferire la conservazione server degli aggregati e della copertura. Eliminare
il ledger grezzo dopo il calcolo, salvo un breve periodo di diagnosi motivato da
definire. Mai URL di altre pagine, titoli delle finestre, app aperte, screenshot,
clipboard o registrazione dei tasti. Pause e cambi focus non sono pubblicati
nella classifica.

## Verifica prima del rilascio

Cambio scheda/app, browser minimizzato, dialoghi, due monitor, passaggio tra pannelli,
reload, back/forward BFCache, sleep, mobile, eventi duplicati, overflow del ledger,
storage indisponibile, più schede e completamento offline. Verificare durata
server invariata dai segnali client e nessuna penalità ai cambi di contesto.

Fonti: [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API),
[visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event),
[performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now),
[pagehide](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event),
[pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event),
[BFCache](https://web.dev/articles/bfcache).
