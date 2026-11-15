# Hosting pubblico a costo zero

Stato: analisi aggiornata il 15 novembre 2026. Questa repository ospita esclusivamente
il corso pubblico indipendente. L'implementazione locale è approvata e disponibile. Nessun servizio pubblico,
registrazione OAuth o pipeline di distribuzione è stato configurato.

## Vincolo economico

**Costo dei servizi zero assoluto.** Non introdurre piani a pagamento, trial a
scadenza, acquisto obbligatorio di dominio o risorse che possano generare addebiti.
Le quote gratuite limitano il servizio: al loro esaurimento si riducono disponibilità
e funzionalità online, senza upgrade automatico. La pratica locale e gli invii
pendenti non devono essere confusi con un salvataggio server confermato.

La repository è pubblica; l'account collegato ha accesso amministrativo. Il piano
Pro dichiarato non è visibile dal connettore e non è necessario alla proposta:
Pages per repository pubbliche è disponibile anche su GitHub Free.

## Proposta tecnica

Frontend statico su GitHub Pages; Cloudflare Workers Free per API e callback OAuth;
D1 Free per identità applicative, tentativi e progressi. Nessun broker commerciale
obbligatorio. Il codice include un entrypoint Worker e un adapter D1. La scelta resta condizionata ai benchmark e alla verifica dei termini
e delle quote correnti sull'account al momento del setup autorizzato.

| Componente | Limite gratuito verificato | Condizione di rilascio |
| --- | --- | --- |
| GitHub Pages | sito statico; 1 GB pubblicato e limite soft di banda di 100 GB/mese | build, base path, apertura diretta e callback verificati |
| Workers Free | 100.000 richieste/giorno, 10 ms CPU per richiesta | replay e autenticazione rientrano nei limiti misurati |
| D1 Free | 5 milioni righe lette/giorno, 100.000 scritte/giorno, 5 GB totali account | verificare anche limite singolo DB, indici e altri consumi account |
| Identità | provider introdotti per fasi | registrazioni e consensi gratuiti verificati, pulsanti solo se operativi |
| Dominio | domini predefiniti gratuiti | nessun dominio da acquistare come requisito |

La skill Cloudflare corrente indica `cf` per un nuovo progetto; non è stata creata
una configurazione Wrangler. Confermare la toolchain nella fase di setup, seguendo
la documentazione corrente senza installare CLI per questa analisi.

## Provider social per fasi

Sequenza approvata per la preparazione locale; le configurazioni reali sono separate:

1. **GitHub al lancio:** OAuth app, profilo pubblico e ID stabile. Per il solo
   accesso non richiedere scope repository o email privata; token del provider
   e secret restano nel backend.
2. **Google:** ampliare l'accesso previa configurazione di client e consenso
   soltanto per identità, senza servizi cloud a pagamento.
3. **Microsoft e LinkedIn:** dopo verifica di account/registrazioni, consensi e
   prodotto di login gratuito disponibile. Microsoft social login non richiede
   di distribuire compute cloud.
4. **Apple:** disabilitato e fuori dal lancio. Il programma sviluppatori può avere
   costo e il login web ha prerequisiti specifici; non attivare sottoscrizioni.
   Introdurlo soltanto se un percorso futuro rispetta il vincolo di costo zero.

Nessuna registrazione con password, email link o credenziali locali. Ogni nuova
identità sociale crea o recupera il relativo utente; collegamento tra provider
solo tramite flusso esplicito e autenticato. Le env abilitano provider già configurati,
non creano automaticamente app OAuth o approvazioni.

## Sessione tra domini gratuiti

`github.io` e `workers.dev` sono cross-site: CORS non rimuove i blocchi dei cookie
terze parti. Spike obbligatorio prima del rilascio: callback backend, codice
applicativo monouso con challenge PKCE, token dell'app breve in memoria e rinnovo
con navigazione principale, usando una libreria mantenuta compatibile col runtime.
Il token GitHub non viene restituito al frontend. Non salvare bearer in localStorage
né inviarli nell'URL. Nessun dominio a pagamento come soluzione obbligatoria.

Frontend: URL API e identificativi pubblici; backend: secret e credenziali dei soli
provider abilitati. Le variabili `VITE_*` sono pubbliche. Confermare privacy, redirect
URI esatti e origin ammessi in ogni ambiente; niente wildcard per dati autenticati.

## Pubblicazione e dati

Dopo approvazione: build Vite con base path della repository; home, programma e
pagine tier prerenderizzati IT/EN; laboratorio con routing compatibile con Pages.
Verificare refresh, deep link, cambio lingua e login sul sito realmente distribuito.
L'hosting Pages non applica automaticamente header di un altro provider: verificare
le protezioni effettivamente disponibili. Nessun segreto nel bundle o nei workflow.

Start e completamento generano richieste; le osservazioni delle pause viaggiano
nel solo POST finale, senza heartbeat continui. Caching della classifica aggregata,
query indicizzate, limiti payload e replay e limiti di frequenza evitano sprechi.
Prima del rilascio verificare quota e comportamento di blocco effettivi; non dedurli
dalla sola etichetta Free.

Il completamento definitivo non viene cancellato da nuovi esercizi. La capacità
storage resta finita: backup/export e recupero devono essere provati senza
introdurre storage a pagamento. Non usare repository pubblica o Issues come backup
di dati personali. Eventuali file di export per manutenzione rimangono fuori da Git.

## Gate e recupero

Nessun lancio persistente finché il flusso login → esercizio → verifica → salvataggio
→ riapertura non passa sui servizi gratuiti. Se il carico supera il budget, ottimizzare
o limitare l'uso e ritardare il lancio; non introdurre una spesa implicita.

Dopo i controlli approvati, la promozione richiede un artefatto noto e smoke test.
Rollback frontend/API con versioni compatibili del motore e dei dati; ripristino
database come procedura distinta. Nessun push o deploy autorizzato da questo documento.

## Fonti

- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Limiti Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Workers Free](https://developers.cloudflare.com/workers/platform/limits/) e [prezzi](https://developers.cloudflare.com/workers/platform/pricing/)
- [D1](https://developers.cloudflare.com/d1/platform/pricing/)
- [OAuth GitHub](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) e [scope](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
- [Google Identity](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
- [Registrazioni Microsoft](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
- [LinkedIn OIDC](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)
- [Apple Developer Program](https://developer.apple.com/programs/whats-included/) e [login web](https://developer.apple.com/help/account/capabilities/configure-sign-in-with-apple-for-the-web/)

## Configurazione locale disponibile

`.env.example` elenca i nomi effettivi: `APP_ORIGIN`, `ALLOW_ORIGINS`, `PORT`,
`DATABASE_PATH`, `VITE_API_URL`, `AUTH_SECRET`, `GITHUB_CLIENT_ID`,
`GITHUB_CLIENT_SECRET`. Il processo API legge `.env`; Vite espone soltanto
`VITE_*`. Il provider fittizio locale si disabilita con `NODE_ENV=production`;
l'entrypoint Worker lo disabilita sempre. Il callback GitHub previsto è
`https://<origine-api>/auth/callback/github`, da registrare sul provider.

Una build Pages si prepara senza pubblicarla:

```bash
PUBLIC_BASE_PATH=/nome-repository/ SITE_URL=https://account.github.io/nome-repository/ npm run build
```

Impostare `VITE_API_URL` all'origine dell'API già configurata. Gli URL sopra sono
segnaposto di documentazione. `dist/` contiene 10 pagine IT/EN, asset, sitemap e
robots. La navigazione del laboratorio usa hash compatibili con hosting statico.
La build senza `SITE_URL` usa localhost ed è intenzionalmente esclusa dai crawler.

L'entrypoint `services/progress-api/src/worker.ts` richiede binding `DB`,
`APP_ORIGIN`, origin consentiti e segreti dei provider attivi. Lo schema esportato
da `database.ts` deve essere applicato prima di avviarlo. Nessuna CLI, binding
pubblico, secret o workflow di deploy è stato configurato da questa implementazione.

Archivio locale: `.tmp/progress.sqlite`, WAL e SHM quando presenti. Per una copia
consistente di sviluppo arrestare il server prima di copiare questi file. I test
usano database temporanei e verificano anche chiusura/riapertura. Un ripristino
della produzione D1 richiederà una procedura e una prova dedicate.

## Variabili GitHub e segreti: configurazione della repository

Repository: `ifthenelse/GIT-for-AI-crash-course`. In **Settings → Secrets and
variables → Actions → Variables** preparare:

| Nome | Valore |
| --- | --- |
| `PUBLIC_BASE_PATH` | `/GIT-for-AI-crash-course/` |
| `SITE_URL` | `https://ifthenelse.github.io/GIT-for-AI-crash-course/` |
| `VITE_API_URL` | origine HTTPS reale del Worker, senza `/v1` o `/auth` finali |

Il workflow CI legge queste variabili soltanto per la build. Se non sono
configurate, produce la preview locale non indicizzabile. Il solo inserimento in
un file `.env` non imposta necessariamente `PUBLIC_BASE_PATH` per vite.config.ts
né `SITE_URL` per il processo Node di prerender: usare env del processo come nel
workflow o il comando inline documentato sopra.

**La CI attuale non richiede GitHub Actions secrets.** `GITHUB_TOKEN` è fornito
automaticamente da GitHub; non creare un PAT o un secret con quel nome. Il workflow
verifica anche E2E/axe con Chromium, ma non distribuisce Pages o Cloudflare.
Creare le tre variabili non attiva la pubblicazione né configura il backend.

Le seguenti impostazioni vanno invece nel **runtime Cloudflare Worker**, quando
sarà autorizzato e predisposto l'ambiente pubblico:

| Tipo | Nome | Valore |
| --- | --- | --- |
| Variable | `APP_ORIGIN` | `https://ifthenelse.github.io/GIT-for-AI-crash-course/` |
| Variable | `ALLOW_ORIGINS` | `https://ifthenelse.github.io` |
| Variable | `GITHUB_CLIENT_ID` | Client ID dell'app OAuth GitHub registrata |
| Secret | `GITHUB_CLIENT_SECRET` | Client secret dell'app OAuth |
| Secret | `AUTH_SECRET` | valore casuale forte, ad esempio 32 byte casuali in base64 |
| Binding D1 | `DB` | database con lo schema applicato |

`APP_ORIGIN` include percorso della repository e slash finale: è il ritorno OAuth.
`ALLOW_ORIGINS` contiene l'origine, senza percorso: autorizza le chiamate browser.
I secret OAuth non devono diventare variabili `VITE_*` né essere inclusi nella
build Pages. Si può generare `AUTH_SECRET` localmente con `openssl rand -base64 32`
e salvarlo direttamente nello store del Worker, senza incollarlo in chat o Git.

Nella GitHub OAuth App impostare Homepage URL al SITE_URL sopra e Authorization
callback URL a `https://<origine-api>/auth/callback/github`. Il callback appartiene
al backend; il client ID non è il token personale GitHub né l'ID numerico account.
Google, Microsoft e LinkedIn non hanno env operative in questa versione; Apple
rimane disabilitato. Non creare secret per provider non implementati.

`CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` non sono consumati dai workflow
attuali. Serviranno soltanto se si introdurrà una distribuzione automatica;
permessi e nomi saranno definiti con quel workflow. Per un futuro deploy Pages
con le azioni ufficiali basterà il token automatico con permessi specifici: non
è necessario preparare in anticipo un PAT generale.
