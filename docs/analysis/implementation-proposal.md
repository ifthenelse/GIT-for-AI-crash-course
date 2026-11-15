# Perimetro operativo proposto

Stato: perimetro approvato il 15 novembre 2026 per l'implementazione locale.
Il testo seguente conserva il perimetro reviewabile approvato; lo stato attuale
e le evidenze di verifica sono in README.md e docs/testing.md.

## Risultato dell'implementazione locale

Corso pubblico indipendente con tre livelli e 36 moduli, tutti completi in italiano
e inglese. Quattro finestre sincronizzate e accessibili: terminale Bash simulato,
DAG Git, editor leggero e portale GitHub/Azure DevOps. Window manager impilabile,
riordinabile e recuperabile da dock/panoramica anche sui viewport piccoli.

Stato immutabile con Zustand, cronologia Zundo limitata allo scenario, bozze e
invii pendenti persistenti. API con avvio server, replay, POST finale idempotente,
completamenti non revocati da undo/reset e classifica didattica. Timer ufficiale
separato da visibilità/focus e pause stimate. Primo provider proposto: GitHub.

Identità visiva con temi chiaro/scuro, logo SVG trasparente originale nei due temi,
icone e social card; testi revisionati, pagine pubbliche prerenderizzate IT/EN,
verifiche SEO/accessibilità sul prodotto implementato e correzione dei problemi.

## Dipendenze candidate comprese nel perimetro

| Area | Pacchetti proposti | Scopo |
| --- | --- | --- |
| Frontend | `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`, `@types/node` | applicazione statica, tipi e build |
| Stato | `zustand`, `zundo` | store e cronologia selettiva |
| Lingue | `i18next`, `react-i18next` | interfaccia e contenuti IT/EN |
| Verifica locale | `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@playwright/test`, `@axe-core/playwright` | invarianti, interazioni e flussi browser/accessibilità |
| Runtime API di prova | `@cloudflare/vitest-pool-workers`, `@cloudflare/workers-types`, se compatibili con la toolchain gratuita | test del servizio senza risorse di produzione |
| SSO | candidato `better-auth` con `drizzle-orm`, oppure `@auth/core` con `@auth/d1-adapter` | confronto nello spike; un solo stack mantenuto e scelta motivata in ADR |

Se un candidato richiede un adapter ulteriore, esplicitarne nome e ragione prima
di aggiungerlo. Niente piattaforme di autenticazione a pagamento. Usare versioni
stabili compatibili verificate al setup e un lockfile generato dal package manager;
nessun aggiornamento manuale del lockfile. Terminale, grafo ed editor possono
iniziare con componenti accessibili propri, senza dipendenze pesanti obbligatorie.

Fonti per i candidati SSO: [Better Auth](https://better-auth.com/docs/installation),
[Auth.js](https://authjs.dev/), [adapter D1](https://authjs.dev/getting-started/adapters/d1).
La documentazione non prova ancora la compatibilità del flusso cross-site o il
budget CPU: entrambi richiedono uno spike. Non installare due stack SSO in produzione.

## Prima verifica tecnica e condizioni di prosecuzione

1. Fissare lo schema di azioni versionato e un primo scenario rappresentativo.
2. Verificare login/handoff fra origini, token in memoria, challenge PKCE e cookie
   terze parti bloccati, usando prima un provider di prova locale.
3. Eseguire replay e test del servizio nel runtime candidato, misurando i casi
   supportati più costosi. La prova locale non certifica i consumi della produzione:
   prima della pubblicazione servono misure sul servizio gratuito configurato.
4. Se fattibilità o compatibilità falliscono, correggere o rivedere l'implementazione
   entro costo zero; registrare il blocco. Non sostituire il requisito con uno
   store soltanto locale o un upgrade a pagamento senza decisione esplicita.

Solo il provider di prova appartiene ai test automatici locali. Login reale richiede
una registrazione OAuth configurata e un controllo integrato successivo; non
dichiararlo verificato dal solo mock.

## Regole iniziali della classifica: proposta semplice

- 100 punti per esercizio completato e verificato; 0 per esercizio non completato.
  Il massimo per un tier di 12 moduli è 1.200 punti. Sono regole proposte,
  non benchmark né risultati misurati.
- Tutti i percorsi corretti equivalenti danno gli stessi punti; niente penalità
  per più comandi, aiuti, accessibilità o cambio finestra.
- La classifica dei tier conclusi ordina per punti decrescenti e poi durata
  crescente. A completamento integrale i punti coincidono per costruzione:
  il tempo distingue i risultati, senza promettere certificazione antifrode.
- Durata del tier: somma dei tempi ufficiali delle prime riuscite dei suoi
  esercizi. Ogni tempo va dall'avvio server al primo completamento valido;
  non comprende altri tentativi. Mostrare questa definizione nell'interfaccia.
- Le ripetizioni servono alla pratica e possono avere risultati personali
  separati; non riscrivono completamento e risultato della prima conclusione.
- Classifiche separate per versione di corso/regole; alias pubblico con adesione
  esplicita. Le stime di pause e focus non sono dati pubblici della classifica.

Questa scelta privilegia verificabilità e semplicità. È inclusa come proposta
reviewabile; il contratto definitivo dovrà corrispondere alle regole approvate.

## Dati: regole prima dello schema

Identità con provider/subject stabile, senza unione automatica tramite email.
Autorizzazione di ogni tentativo e progresso sul server. Completamento append-only
per utente/tier/versione; una nuova versione non cancella i risultati storici.
Nessuna migrazione a versioni future o equivalenza di sblocchi viene inventata ora.

Conservare aggregati delle pause e copertura; scartare il ledger grezzo dopo il
calcolo, senza conservarlo per diagnosi nel rilascio iniziale. Per replay e bozze
definire limiti e cancellazione con lo schema. La richiesta di cancellazione
account rimuove identità e progressi personali, non può essere descritta come
semplice reset dell'esercizio e richiede una conferma esplicita nel prodotto.
Documentare retention, backup e cancellazione effettiva prima del rilascio.

## Organizzazione e verifica

Struttura candidata: `apps/web` per l'interfaccia, `packages/git-engine` per il
motore condiviso, `packages/course-content` per scenari e traduzioni,
`services/progress-api` per il servizio. È una proposta di scaffold, non una
struttura già creata nella repository.

Sottoagenti in worktree separate: motore/replay, window manager e viste,
API/SSO, contenuti IT/EN, identità e verifiche. Il coordinatore integra contratti,
test e documentazione. Non assegnare automaticamente ruoli umani non confermati.

`scripts/verify` dovrà diventare un controllo reale di tipi, codice e test.
Verifiche necessarie: confronto del motore con Git reale, undo/completamenti,
idempotenza/offline/riapertura, autorizzazione, tutte le finestre da tastiera,
temi e IT/EN, audit SEO/accessibilità sul prodotto renderizzato e recupero dati.

## Pubblicazione come passaggio separato

L'approvazione dell'implementazione locale permette di costruire e verificare
il risultato. Registrazioni OAuth reali, risorse cloud, segreti, CI di distribuzione,
push/PR e pubblicazione richiederanno il perimetro specifico prima dell'esecuzione.
Non sono autorizzati implicitamente dalla conferma di un documento GTM.
Il lancio pubblico resta soggetto a costo zero e ai criteri di prontezza.
