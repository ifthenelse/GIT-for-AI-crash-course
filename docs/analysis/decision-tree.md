# Decisioni confermate e checkpoint rimanenti

Aggiornato con le risposte dell'utente del 15 novembre 2026. Metodo di intervista:
wrapper locale `/grill-me` e dipendenza upstream `grilling`; fonti in [skills.md](skills.md).

## Primo round: risposte acquisite

| Tema | Decisione |
| --- | --- |
| Perimetro | solo corso pubblico indipendente, aperto a tutti, repository pubblica; massima priorità a questo rilascio |
| Motore | simulatore interamente nel browser e guide facoltative sul computer |
| Durata | avvio server e tempo trascorso; eventi di visibilità/focus per stimare pause e interruzioni |
| Costo | zero assoluto; provider social introducibili per fasi |
| Quarta vista | portale GitHub/Azure DevOps con PR, policy, fork e release |
| Finestre | desktop e viewport piccoli: impilabili, riordinabili e recuperabili come in un window manager |
| Lingue | italiano e inglese completi al lancio |
| Ricerca GTM | soltanto fonti pubbliche gratuite; niente traffico inventato o servizi a pagamento |
| Categoria | mappa delle alternative e direzione «laboratorio visuale di collaborazione con Git» confermate |
| Posizionamento | promessa IT/EN e messaggi confermati; benefici didattici ancora da validare |
| Manutenzione post-lancio | budget iniziale di 1–2 ore alla settimana; distinto dallo sviluppo e dalle traduzioni iniziali |
| Diffusione | tre motori gratuiti e priorità confermati; massimo tre canali iniziali |

Le scelte estranee al perimetro pubblico non fanno parte dei documenti o dei file
locali della repository. Le risposte superano le ipotesi della prima bozza.

## Raccomandazioni tecniche reviewabili

- Tempo server ufficiale distinto da tempo di studio stimato; nessuna penalità
  per cambio scheda/finestra o per spostarsi fra i pannelli.
- Listener `document.visibilitychange`; `window.blur/focus` come segnale separato;
  lifecycle e gap non osservati trattati esplicitamente.
- GitHub come primo social login, poi provider compatibili con registrazioni gratuite.
- Hosting Pages + Workers/D1 Free soltanto dopo benchmark e verifica delle quote;
  nessun upgrade a pagamento implicito.
- Layout locale distinto da stato Git/Zundo e da progressi confermati.

Queste sono proposte di dettaglio dell'implementazione, non codice già approvato.

## Prossimo checkpoint GTM

Snapshot e [mappa delle alternative](../../gtm-plan/02-market-map.md) sono confermati.
La categoria scelta è **laboratorio visuale di collaborazione con Git**. Gli altri
strumenti trattano anche simulazione e grafi: queste caratteristiche da sole non
sono una promessa di unicità o efficacia. Il [posizionamento](../../gtm-plan/03-positioning.md)
è confermato, mantenendo espliciti i tre pilastri non verificati. Anche il
[piano di diffusione](../../gtm-plan/04-demand-plan.md) è confermato.

Il prossimo checkpoint è l'approvazione della [roadmap](roadmap.md) e del
[GTM Plan consolidato](gtm-plan.md), proposti dopo QA. Il
[perimetro operativo](implementation-proposal.md) esplicita risultato, dipendenze
e regole della classifica approvati per il lavoro locale il 15 novembre 2026.

## Decisioni successive

- Nome pubblico e licenze di codice/contenuti prima della pubblicazione.
- Regole di punteggio, aggregazione dei tempi e tentativi ripetuti: una proposta
  semplice è ora nel perimetro operativo; attende l'approvazione insieme al lavoro locale.
- Responsabili di sviluppo, traduzione, revisione didattica e manutenzione;
  capacità iniziale necessaria prima di una data impegnativa. Il budget di
  manutenzione post-lancio è già confermato: 1–2 ore/settimana.
- Retention, cancellazione account e trattamento delle versioni del corso.

Sono decisioni di prodotto/governance; i fatti tecnici reperibili nelle fonti
rimangono responsabilità dell'analisi e non vanno richiesti di nuovo all'utente.

## Approvazione dell'operatività

Chiedere approvazione sul perimetro concreto prima di app, dipendenze, contratti,
CI/CD e setup dei servizi. Confermare uno snapshot o una mappa GTM non autorizza
implementazione, spese, registrazioni OAuth, push o deploy.

## Aggiornamento implementazione

Il perimetro locale e le dipendenze sono stati approvati il 15 novembre 2026.
Le scelte implementate sono registrate in ADR 0002 e docs/architecture.md.
I checkpoint relativi a servizi reali e pubblicazione rimangono separati.
