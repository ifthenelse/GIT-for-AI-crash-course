# Git Practice Lab

Collabora con Git sapendo cosa cambia e come recuperare il lavoro.

Corso pubblico e indipendente per Engineers, Architects e persone di business con esperienza tecnica pratica. Il laboratorio simula una repository attraverso terminale Bash, grafo dei commit, editor e portale GitHub/Azure DevOps. Il percorso comprende 36 moduli in italiano e inglese, distribuiti nei livelli Base, Intermedio e Avanzato.

L'implementazione locale è stata approvata il 15 novembre 2026. La pubblicazione e la configurazione dei servizi reali sono passaggi separati: nessuna risorsa cloud o registrazione OAuth viene creata avviando il progetto.

## Avvio locale

Servono Node.js 24.15+ della serie 24 oppure Node.js 26+, npm e Git. La versione indicata dalla repository in `.node-version` è 26; le verifiche locali usano Node.js 24.22.1; anche la CI su Node.js 26 è passata.

```bash
npm ci
cp .env.example .env
npm run dev:api
```

In un secondo terminale:

```bash
npm run dev
```

Aprire `http://127.0.0.1:5173`. Il provider **Sviluppo locale** permette di provare il salvataggio senza credenziali esterne. È un'identità fittizia, disponibile soltanto nel server di sviluppo. I dati vengono salvati in `.tmp/progress.sqlite`; il token applicativo rimane in memoria e dopo un refresh occorre accedere di nuovo. La stessa identità di prova recupera i progressi già confermati.

Il simulatore esegue soltanto il sottoinsieme di comandi previsto dal corso. Le guide per installare Git e configurare SSH sul proprio computer sono distinte dagli esercizi nel browser.

## Comandi

| Comando | Scopo |
| --- | --- |
| `npm run dev` | frontend Vite con proxy all'API locale |
| `npm run dev:api` | API locale e archivio SQLite persistente |
| `scripts/verify` | tipi e test automatici |
| `npm run build` | build statica e pagine pubbliche prerenderizzate IT/EN |
| `npm run preview` | anteprima della build |
| `npm run test:e2e` | flussi browser e controlli axe; usa Chromium di sistema quando disponibile |

Per una build destinata a Pages, impostare esplicitamente `PUBLIC_BASE_PATH` e `SITE_URL`; l'URL API pubblico usa `VITE_API_URL`. Le build locali sono intenzionalmente `noindex`. Dettagli e condizioni di rilascio in [docs/deployment.md](docs/deployment.md).

## Struttura

- `apps/web`: React, Vite, i18next, Zustand e Zundo; finestre e persistenza locale.
- `packages/git-engine`: motore deterministico condiviso tra browser e validatore.
- `packages/course-content`: scenari, obiettivi, soluzioni e testi IT/EN.
- `packages/contracts`: contratti versionati condivisi.
- `services/progress-api`: autenticazione, replay, progressi definitivi e classifica con adesione esplicita.
- `gtm-plan`: piano prodotto approvato e roadmap.

Undo e reset agiscono sullo scenario. I completamenti confermati dal server rimangono acquisiti. I tempi ufficiali derivano dall'avvio server; le pause stimate tramite visibilità e focus sono mostrate separatamente.

## Documentazione

[Architettura](docs/architecture.md), [test e limiti delle verifiche](docs/testing.md), [analisi e decisioni](docs/analysis/README.md), [sicurezza](SECURITY.md), [contributi](CONTRIBUTING.md) e [istruzioni per gli agenti](AGENTS.md).

Il costo dei servizi deve rimanere zero. Il frontend è predisposto per GitHub Pages e l'API include un adapter per il runtime pubblico candidato. OAuth reale, quote gratuite, distribuzione e ripristino richiedono verifiche sull'ambiente configurato prima del lancio.
