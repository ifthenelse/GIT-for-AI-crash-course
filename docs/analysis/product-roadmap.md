# Roadmap tecnica candidata

Sequenza di sviluppo per il solo corso pubblico, aggiornata il 15 novembre 2026.
È parte della progettazione software: non sostituisce il GTM Plan consolidato,
che richiede i successivi checkpoint della skill. Nessuna data impegnativa è
possibile senza capacità e responsabili assegnati.

Per la sola manutenzione dopo il lancio l'utente ha confermato un budget iniziale
di 1–2 ore alla settimana. Non è una stima delle ore per costruire il simulatore
o tradurre l'intero percorso prima del lancio.

## Milestone e condizioni di uscita

| Fase | Risultato reviewabile | Condizione per procedere |
| --- | --- | --- |
| 0. Approvazione e spike | dipendenze candidate, proof login fra domini gratuiti, benchmark validatore | flusso minimo senza cookie terze parti e carico compatibile con Free; niente servizi a pagamento |
| 1. Nucleo Git | stato puro, parser subset, fixtures, comandi Base e replay condiviso | confronto con Git reale sui casi supportati; azioni equivalenti corrette accettate |
| 2. Laboratorio | terminale, DAG, editor e portale sincronizzati; window manager adattivo | tastiera/touch, impilamento e recupero finestre, undo/redo senza alterare layout o completamenti |
| 3. Progressi e sessione | primo provider sociale, avvio/finale server, idempotenza e coda offline | riapertura ripristina progressi; impossibile sbloccare tier dal solo client; tempi ufficiali distinti dalle stime |
| 4. Copertura del corso | tre livelli, conflitti, PR/policy, rollback, rebase, worktree e scenari finali | ogni argomento della matrice ha spiegazione, azione, criterio di successo e feedback |
| 5. Parità IT/EN | lezioni, esercizi, aiuti, guide OS, errori, UI e alternative accessibili completi | nessuna stringa o lezione mancante in una lingua; cambio lingua senza perdita dello scenario |
| 6. Identità e verifica | SVG trasparente nei due temi, icone/social card, classifica, SEO e accessibilità | audit sul prodotto renderizzato, correzione dei blocchi e prove di recupero dati |
| 7. Rilascio pubblico | artefatto statico su Pages e API gratuita verificata | percorso completo end-to-end, quote compatibili, pubblicazione approvata e rollback provato |

## Parallelizzazione dopo approvazione

Sottoagenti in worktree separate: motore/replay; window manager e viste; API/sessione;
contenuti bilingui; identità visiva e verifiche. Il coordinatore integra contratti
approvati e revisioni. Mai due agenti che scrivono nella stessa working copy.
API e motore condividono prima uno schema di azioni versionato per evitare derive.

La scrittura dei contenuti e delle traduzioni può procedere insieme al laboratorio;
la pubblicazione resta bloccata dalla parità completa dei tre livelli IT/EN.
Una preview per revisione può contenere un sottoinsieme dichiarato, ma non viene
presentata come il lancio completo richiesto.

## Scope del primo lancio proposto

Tre livelli e quattro finestre; scenari deterministici; lezioni e guide IT/EN;
progressi persistenti, tier progressivi, classifica didattica e timer server;
pause stimate, pratica locale e ripresa dopo errore; temi e SVG; provider GitHub
come prima fase proposta. Nessun Bash arbitrario, broker a pagamento, dominio da
acquistare o provider inattivo mostrato come disponibile.

Google, Microsoft e LinkedIn seguono quando prerequisiti e setup gratuiti sono
verificati. Apple rimane escluso finché introdurlo contrasta con costo zero.
L'ordine dei provider è una raccomandazione reviewabile, non una registrazione già eseguita.

## Dipendenze e limiti da risolvere

- Misurare auth e peggiori replay supportati sul runtime gratuito prima di
  dipendere da esso. Se non rientrano nel budget CPU, ottimizzare o fermare il
  lancio persistente; nessun upgrade automatico.
- Definire score, tentativi e aggregazione del tempo per tier prima dello schema
  definitivo. Le pause client non alterano la durata server.
- Provare il percorso di ripristino e fissare retention/cancellazione account.
- Confermare nome pubblico, licenze e canale feedback prima della pubblicazione.
- Definire un piccolo pilota con persone dei pubblici target per validare
  comprensione e trasferimento a una repository reale, senza inventare risultati.

## Criterio di prontezza

Un utente entra con il provider abilitato, completa uno scenario, riceve verifica
server, chiude il browser, rientra e ritrova il completamento; ripete e annulla
azioni senza perdere l'esito acquisito. Lo stesso percorso funziona nelle due
lingue, su viewport diversi e da tastiera. Nessun passaggio richiede un acquisto.

Questo documento rende il lavoro concreto per la futura approvazione operativa;
non autorizza dipendenze, schema definitivo, CI/CD, registrazioni OAuth, push o deploy.
