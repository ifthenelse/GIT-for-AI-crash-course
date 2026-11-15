# 0002. Laboratorio Git pubblico con verifica server

- Status: accepted
- Date: 2026-11-15

## Context

Il corso deve funzionare soprattutto nel frontend, con tre livelli IT/EN,
progressi persistenti e una classifica didattica. Sono vincolanti costo dei
servizi zero, repository pubblica e approvazione prima della pubblicazione.

## Decision

L'utente ha approvato l'implementazione locale del perimetro in
`docs/analysis/implementation-proposal.md`: React/Vite/TypeScript,
Zustand/Zundo, i18next, motore Git deterministico condiviso fra UI e server,
finestre impilabili e POST finale verificata dopo avvio server.
I completamenti non appartengono alla cronologia annullabile.

Frontend destinato a Pages; servizio compatibile con runtime gratuito e SQLite/D1.
Per sviluppo e test si usa un provider sociale simulato esplicitamente locale;
OAuth reale resta configurabile separatamente, senza password locali.

## Alternatives considered

- Git e shell arbitrari nel server: isolamento e costi oltre il perimetro.
- Completamenti dichiarati dal browser: insufficienti per sblocco e durata server.
- Stato solo locale: non soddisfa la persistenza autorevole fra accessi.

## Consequences

Serve verifica differenziale del subset rispetto a Git reale, test delle soluzioni
didattiche e del replay, e controlli browser/API/dati. La pubblicazione dipende
da runtime gratuito, configurazione reale, tre livelli IT/EN e audit completati.
Il provider di prova non dimostra il corretto funzionamento dell'OAuth reale.
