# Procedure operative

Il risultato locale è disponibile; non esistono servizi distribuiti o comandi di rilascio pubblico validati. Lo stato
dell'onboarding e i prerequisiti sono in [deployment.md](../deployment.md).

Prima del rilascio documentare e provare:

- distribuzione e rollback di frontend/API con compatibilità delle versioni;
- backup e ripristino dei progressi e completamenti;
- mancato salvataggio, retry e riconciliazione della coda offline;
- esaurimento quote o budget CPU del validatore;
- errore login, rotazione credenziali provider e revoca delle sessioni;
- isolamento degli utenti e cancellazione account secondo regole approvate.

Ogni procedura dovrà indicare owner, prerequisiti, passaggi, verifica e recupero.
Le credenziali rimangono nei servizi autorizzati, non nella documentazione.

## Uso e recupero locale

Avviare API e Vite come indicato in README.md. Il database di sviluppo è
`.tmp/progress.sqlite`; la suite browser usa un file differente e lo ricrea.
Per effettuare una copia consistente locale arrestare l'API, copiare il database
e gli eventuali WAL/SHM, poi riavviare e accedere nuovamente. I token non vengono
conservati dal browser: il nuovo login recupera lo stesso utente.

Se un invio resta pendente, mantenere la bozza e ripristinare connettività/API;
usare Riprova la sincronizzazione. Dopo scadenza accedere di nuovo con la stessa
identità. La durata ufficiale include l'attesa fino alla ricezione valida.
Un risultato rifiutato per obiettivi incompleti richiede completare lo scenario;
reset e undo non cancellano i risultati già confermati.

Per recuperare una finestra usare dock, panoramica o Ripristina disposizione.
Se il layout locale è corrotto il componente applica un preset dentro il viewport.
Lo stato Git rimane separato dalle preferenze di disposizione.

La CI di verifica prepara Node da `.node-version`, installa il lockfile e controlla
tipi, test, build e SEO statico; un job separato esegue E2E e axe. Non distribuisce il sito. È una configurazione
preparata localmente; il runner remoto e Node 26 non sono stati eseguiti qui.
