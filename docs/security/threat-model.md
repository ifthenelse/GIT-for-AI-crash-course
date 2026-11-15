# Confini di fiducia e controlli

Stato locale del 15 novembre 2026. Le verifiche automatiche coprono i confini
indicati; configurazione pubblica e provider GitHub reale non sono ancora provati.

| Asset / confine | Controllo implementato | Evidenza | Limite residuo |
| --- | --- | --- | --- |
| Risultati, browser → API | replay con seed server, obiettivi, proprietà tentativo, tier e versione | unit/integration API, catalogo reale, E2E manipolazione | soluzioni e automazioni possibili; classifica didattica |
| Completamenti, API → DB | batch atomico, idempotenza, vincoli unici e prima riuscita conservata | concorrenza, retry identico/differente, ripetizione e riapertura SQLite | runtime D1 e ripristino pubblico da provare |
| Identità, provider → API | Auth.js GitHub con state e PKCE; identità provider/subject, niente linking email | handoff locale con challenge, stato, scadenza e consumo singolo | OAuth GitHub reale richiede credenziali e verifica integrata |
| Sessioni | bearer opaco breve, hash nel DB, solo memoria frontend, revoca logout | test scadenza/revoca; nessuna persistenza bearer nel client | XSS può agire come utente nella pagina; header Pages da verificare |
| Dati utente | proprietà verificata prima di operare sul tentativo | fixture con due utenti, risposta non rivelatrice | nuove API richiederanno gli stessi controlli |
| Pause | limite ledger, soli aggregati conservati, nessun effetto sul ranking | test ledger malformato e tempi server | stime manipolabili o incomplete |
| Risorse | limiti azioni/file/commit/corpo, rate limiter per istanza | test payload e comandi rifiutati | limite globale e CPU Worker Free da misurare |
| Segreti | env backend; VITE solo URL pubblico; token provider escluso dal client | ispezione codice, esempio env privo di segreti | configurazione reale e bundle finale da ricontrollare al deploy |
| Classifica | alias e consenso esplicito; nessuna email o ledger pubblico | test opt-in/opt-out e corso reale | retention e cancellazione account prima del lancio |
| Computer | nessun subprocesso nell'app; comandi/hook/SSH fittizi con whitelist | test shell injection, traversal, oggetti immutabili | guide OS possono essere eseguite consapevolmente dall'utente |

La bozza IndexedDB e il layout locale rimangono sul dispositivo, separati per
identità e versione; logout revoca la sessione senza presentarsi come cancellazione
dei dati locali o dell'account. Il database locale è escluso da Git.

Prima della pubblicazione definire e provare retention, richiesta di cancellazione,
backup/ripristino e limiti del servizio gratuito. Nessuna promessa di conservazione
illimitata o certificazione antifrode deriva dall'immutabilità dello stato.
