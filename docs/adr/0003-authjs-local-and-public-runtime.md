# 0003. Auth.js per GitHub e adapter SQL applicativi

- Status: accepted
- Date: 2026-11-15

## Decisione

Fra i candidati compresi nell'approvazione locale si usa `@auth/core`.
Auth.js gestisce OAuth GitHub con state e PKCE. Il backend mantiene un'identità
applicativa provider/subject e un bearer opaco a breve durata; lo scambio fra
origini usa una challenge e un codice monouso. Il provider token resta backend.

Il corso usa adapter SQL propri per progressi, sessioni e handoff, con una stessa
interfaccia Fetch per Node/SQLite e Worker/D1. La sessione intermedia Auth.js usa
JWT cifrato; l'adapter D1 Auth.js candidato non è necessario e non viene mantenuto
tra le dipendenze. Non si installa un secondo stack di autenticazione.

## Conseguenze

Le prove locali coprono il provider di sviluppo esplicitamente fittizio, i confini
di autorizzazione e lo scambio monouso. Non dimostrano il login GitHub reale.
Prima del lancio servono app OAuth registrata, callback, CORS e origini distribuite
verificati, oltre al budget CPU del piano gratuito. Altri provider rimangono fasi
successive entro il vincolo di costo zero. Apple resta disabilitato.
