# GTM Plan — GIT-for-AI-crash-course
*Go2Rev methodology · 15 novembre 2026 · Approvato dall’utente*

Le cinque fasi sono confermate; roadmap e consolidamento sono approvati dopo la
verifica trasversale [plan-qa](../docs/analysis/plan-qa.md). Il documento non dichiara completata
l'implementazione e non autorizza pubblicazioni, contatti o servizi.

## 1. Executive summary

Il corso pubblico indipendente si posiziona come **laboratorio visuale di
collaborazione con Git**. Promessa confermata: «Collabora con Git sapendo cosa
cambia e come recuperare il lavoro.» Il percorso collega modifiche, commit,
revisione, policy e recupero, attraverso tre livelli completi in italiano e inglese.

La diffusione confermata usa tre motori: scenari utili per farsi trovare, esempio
svolto per scegliere/avviare il corso e feedback volontario per correggere il
percorso. Servizi a costo zero, massimo tre canali iniziali e manutenzione
post-lancio di 1–2 ore/settimana sono vincoli, non previsioni di efficacia.

I primi 90 giorni organizzano sei iniziative dipendenti da capacità e prove:
fattibilità, caso rappresentativo, verifica privata, release candidate completa,
rilascio autorizzato e primo ciclo di manutenzione. Il calendario è orientativo;
se non bastano tempo o evidenze, il rilascio slitta. Non si riducono livelli o
lingue e non si acquista un piano per aggirare i blocchi.

## 2. Business snapshot

Progetto pubblico in fase di analisi, da repository pubblica. Partecipanti:
Engineers, Architects e persone di business con esperienza tecnica pratica;
nessun limite geografico dichiarato. Accesso senza processo commerciale o pagamento
richiesto. Nessuna baseline di traffico, avvii o apprendimento disponibile.

Frontend previsto su Pages; React/Vite, TypeScript, Zustand/Zundo e i18next;
API esterna gratuita per identità, validazione e progressi. SSO sociale per fasi,
con GitHub proposto per primo. Italiano e inglese completi sono requisiti del lancio.

Andrea Collet è owner della repository, non un'assegnazione automatica dei ruoli
operativi. Capacità iniziale e responsabili da definire; 1–2 ore/settimana confermate
solo dopo il lancio. Testo completo: [snapshot](01-business-snapshot.md).

## 3. Market map

Tre livelli di alternative: simulatori interattivi; pratica su piattaforme reali
e riferimenti tecnici; affiancamento o ricerca al momento del problema. Non sono
note frequenze di scelta o quote di mercato.

- [LearnGitBranching](https://github.com/pcottle/learnGitBranching): grafo, sandbox,
  livelli e comandi nel browser. Visualizzare Git non dimostra da solo una differenza del corso.
- [Oh My Git!](https://ohmygit.org/): gioco con strutture visualizzate e Git reale;
  percorso pubblicizzato desktop e manutenzione ridotta dichiarata. Non sono prove di qualità inferiore.
- [GitHub Skills](https://github.com/skills): esercizi in repository del partecipante
  e feedback di piattaforma, alternativa di pratica reale.
- [Microsoft Learn](https://learn.microsoft.com/en-us/training/modules/intro-to-git/)
  e [Azure Repos](https://learn.microsoft.com/en-us/azure/devops/repos/git/?view=azure-devops):
  formazione e documentazione su concetti, PR e policy, con prerequisiti e risorse distinti.
- [Pro Git](https://git-scm.com/book/en/v2): riferimento progressivo su basi,
  workflow e internals; l'edizione italiana mostra una traduzione non uniforme secondo la pagina consultata.

Assi qualitativi: simulazione/pratica reale; modello mentale/collaborazione;
esercizio/consultazione. La posizione del corso è progettata, non misurata.
**GAP HYPOTHESIS:** seguire un incidente dal file alla policy; spiegare il recupero
attraverso conseguenze visibili. Rilevanza, apertura della posizione e realizzabilità
non sono dimostrate. [Mappa completa e fonti](02-market-map.md).

## 4. Positioning

Estratto del posizionamento confermato; le etichette `unverified-claim` rimangono.

### Category decision

Confronto qualitativo delle direzioni emerse dalla [mappa confermata](02-market-map.md).
Dimensione e domanda del mercato non sono misurate; nessun punteggio numerico inventato.

| Categoria candidata | Spazio e concorrenza osservabili | Aderenza e interesse |
| --- | --- | --- |
| Laboratorio visuale di collaborazione con Git, scelta confermata | collega comandi e lavoro condiviso; sovrapposizione con simulatori e pratica reale | coerente con gli scenari progettati; interesse dei pubblici da validare |
| Palestra di recupero Git | bisogno più circoscritto; recupero e conflitti già presenti nelle alternative | copre una parte del programma; rischio di apparire utile solo quando c'è un incidente |
| Percorso pratico IT/EN | dimensione ignota; lingue e progressione non dimostrano esclusività | aderente ai requisiti, rilevanza da verificare nelle due lingue |

La scelta impone di spiegare collaborazione e conseguenze oltre alla sintassi,
distinguere simulazione e operazioni reali e verificare l'apprendimento. Le risorse
esistenti restano alternative utili e possibili approfondimenti.

### Core promise

**IT:** «Collabora con Git sapendo cosa cambia e come recuperare il lavoro.»

**EN:** “Collaborate with Git knowing what changes and how to recover your work.”

**Fallback IT:** «Scegli come collaborare e recuperare con Git, vedendo cosa cambia nella repository.»

**Fallback EN:** “Choose how to collaborate and recover with Git, seeing what changes in the repository.”

La promessa riguarda autonomia e comprensione; è coerente con gli scenari
specificati. Diventerà una capacità dimostrata solo dopo prove su problemi nuovi
svolti senza guida. In una pagina di progetto deve essere chiaro che il corso
è in progettazione, senza descrivere il risultato come già disponibile.

### Pillars

#### P1 — Dal file alla revisione

- Claim candidato: collegare una modifica ai suoi effetti sulla storia e sulla revisione condivisa.
- Relevant: plausibile per i pubblici dichiarati, senza riscontri diretti ancora disponibili.
- Differentiated: ipotesi rispetto all'enfasi sul grafo di LearnGitBranching e sul lavoro reale di GitHub Skills; nessuna esclusività dimostrata.
- Defensible: non ancora superato; viste sincronizzate specificate, senza implementazione osservabile.
- Prova necessaria: scenario funzionante e partecipante capace di spiegare file, index, commit e PR. Stato: `unverified-claim P1`.

#### P2 — Lo stesso problema, due contesti

- Claim candidato: riconoscere principi Git comuni e differenze operative fra GitHub e Azure DevOps.
- Relevant: coerente con il pubblico, frequenza del bisogno ancora ignota.
- Differentiated: ipotesi rispetto ai percorsi che enfatizzano una piattaforma; unicità non accertata.
- Defensible: non ancora superato; la copertura è un requisito, non una capacità già realizzata.
- Prova necessaria: scenari corrispondenti verificati sulle fonti e trasferimento autonomo fra contesti. Stato: `unverified-claim P2`.

#### P3 — Recupero motivato

- Claim candidato: scegliere una strategia di recupero spiegandone l'effetto sul lavoro condiviso.
- Relevant: bisogno plausibile da verificare.
- Differentiated: conflitti e recupero già esistono nelle alternative; l'ipotesi riguarda la verifica della motivazione.
- Defensible: non ancora superato; mancano simulatore e risultati di apprendimento.
- Prova necessaria: rubriche che valutino scelta, conseguenze e conservazione del lavoro altrui su un incidente nuovo. Stato: `unverified-claim P3`.

Nessuno dei tre candidati è presentato come pilastro già validato. Confermare
l'architettura dei messaggi non equivale a superare il test dei pilastri.

### Segment translations

| Pubblico | Traduzione della stessa promessa | Enfasi e lessico |
| --- | --- | --- |
| Engineers | integra modifiche e recupera comprendendo la storia condivisa | P1/P3; branch, diff, commit, conflitto |
| Architects | valuta integrazione e recupero comprendendone gli effetti sulla collaborazione | P2/P3; policy, storia condivisa, integrazione, rollback |
| Business con esperienza tecnica | collabora sulle modifiche e recupera una versione comprendendo il lavoro del gruppo | P1/P3; modifica, revisione, versione, ripristino |

Non sono tre prodotti o promesse incompatibili; termini e approfondimento cambiano
con il contesto del partecipante.

### Messages per funnel stage

Percorso scoperta → scelta → avvio, senza presupporre una vendita. Sono testi
candidati per quando il prodotto sarà disponibile, non una descrizione dello stato attuale.

| Momento | Messaggio principale | Varianti |
| --- | --- | --- |
| Scoperta | Un laboratorio visuale per collaborare con Git. | Dalla modifica alla pull request: comprendi cosa cambia. / Esplora le conseguenze delle decisioni Git. |
| Scelta | Segui lo stesso scenario tra file, commit e revisione. | Confronta le decisioni su GitHub e Azure DevOps. / Guarda il percorso: basi, collaborazione e recupero. |
| Avvio | Inizia dal livello Base, in italiano o inglese. | Accedi con un provider disponibile e avvia il primo esercizio. / Riprendi dall'ultimo progresso salvato. |

### Anti-messages bank

**Formulazioni da evitare:** «Git per tutti», «soluzione completa», «impara senza
fatica», «diventa esperto rapidamente». Sostituirle con un'azione o un risultato
specifico del percorso, senza promesse generiche o tempi non verificati.

**Cornici da non imitare:** visualizzazione come promessa esclusiva di
[LearnGitBranching](https://github.com/pcottle/learnGitBranching), imparare GitHub
dentro GitHub come cornice di [GitHub Skills](https://github.com/skills), gioco con
Git reale come cornice di [Oh My Git!](https://ohmygit.org/).

**Claim non difendibili:** «riduce gli errori», «garantisce autonomia», «più efficace»,
«accessibile a tutti». Richiedono rispettivamente risultati osservati, prove di
trasferimento, confronti appropriati e verifiche di accessibilità. Non usarli come
fatti; restano `unverified-claim`.

### What this changes tomorrow

Titolo durante la progettazione: «Un laboratorio visuale di collaborazione con
Git, in progettazione.» Sottotitolo: «Scenari su GitHub e Azure DevOps per comprendere
modifiche, revisioni e recupero. Percorso previsto in italiano e inglese.»

La presentazione spiega bisogno, scenario e conseguenze da comprendere, distinguendo
progetto e capacità dimostrate. Temi coerenti: revisioni, conflitti, recupero e
differenze operative. Classifica come prova di competenza e stack interno come
beneficio didattico non sostengono il posizionamento.
Il piano di diffusione dovrà rispettare servizi gratuiti, assenza di campagne
a pagamento e budget di manutenzione post-lancio confermato di 1–2 ore/settimana.

## 5. Demand plan

Consolidato dal piano di diffusione confermato, senza nuove previsioni.

### Starting point

Nessuna baseline di visite, avvii, completamenti o apprendimento è disponibile.
Sono confermati costo dei servizi zero assoluto, corso pubblico indipendente,
tre livelli e italiano/inglese completi al lancio. Provider social per fasi
compatibili con il vincolo economico.

Un esempio usato in una verifica privata del progetto non costituisce un lancio
parziale. Nessuna pubblicazione, invito, campagna o modifica dei servizi viene
eseguita con questo piano.

### Design principles

1. Un problema concreto conduce al percorso: spiegazione utile e collegamento
   all'esercizio pertinente, senza pagine create solo per intercettare ricerche.
2. Una prova osservabile precede un claim: esempi e feedback spiegano cosa offre
   il corso; autonomia ed efficacia rimangono ipotesi da verificare.
3. La manutenzione limita la diffusione: prima contenuti IT/EN e correzioni,
   poi eventuali canali ulteriori.

Google raccomanda contenuti utili alle persone. La presenza organica non richiede
pagamento, ma crawl, indicizzazione e ranking non sono garantiti.
[People-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content),
[Search Essentials](https://developers.google.com/search/docs/essentials).

### Engine architecture

E1: problema Git → spiegazione IT/EN verificata → programma → E2.

E2: esempio svolto → comprensione del metodo → scelta del livello → primo esercizio → E3.

E3: difficoltà osservata → correzione motivata IT/EN → possibile ritorno volontario;
i casi ricorrenti aggiornano E1 ed E2.

E1 sostiene scoperta; E2 valutazione e avvio; E3 aderenza e ritorno. Qualificazione
significa capire per chi e per quali problemi il percorso funziona, senza valutare
contatti commerciali. I motori sono attività ripetibili, non una lista di canali.

#### Screening dei candidati

| Candidato | Coerenza | Operatività | Primo segnale e scelta |
| --- | --- | --- | --- |
| Scenari pratici cercabili | allineati al posizionamento | revisione dei contenuti entro slot IT/EN | acquisizione non prevedibile; selezionato E1 |
| Esempio svolto collegato al corso | mostra il metodo | riusa scenari verificati, riducendo duplicazioni | osservabile quando provabile; selezionato E2 |
| Feedback → revisione → ritorno | sostiene apprendimento | owner di triage e priorità entro 1–2 ore/settimana | primo riscontro del pilota pianificabile; selezionato E3 |
| Amplificazione a pagamento | può diffondere | incompatibile con costo zero | scartata |
| Outreach continuativo | aderenza debole | richiede contatti, messaggi e ulteriore lavoro | scartato dal piano |
| Newsletter continuativa | possibile ritorno | calendario e gestione iscritti oltre il minimo | scartata finché capacità non dimostrata |
| Nuova community proprietaria | possibile confronto | moderazione continuativa non prevista | scartata; feedback su superficie circoscritta |

La capacità post-lancio è confermata come budget, non come garanzia di poter
risolvere ogni problema. La produzione iniziale resta nel progetto di sviluppo.

### Engine detail

#### E1 — Scenari pratici cercabili

Input: esercizi corretti, spiegazioni IT/EN, fonti e collegamenti al programma.
Meccanismo: un problema genera una pagina utile; i dubbi osservati guidano le revisioni.
Output: accessi pertinenti al percorso, se la pagina viene scoperta.
Indicatori: impressioni, clic, pertinenza delle query, passaggi al programma se
misurabili e correzioni richieste. Requisiti: revisione tecnica e linguistica,
pagine accessibili. Primo segnale: impressione o clic dopo scoperta, senza data
garantita. [Metriche Search Console](https://support.google.com/webmasters/answer/7576553?hl=en)
definisce impressioni/clic/CTR; questi dati non provano apprendimento.

#### E2 — Esempio svolto → corso

Input: caso rappresentativo fra modifica, storia e revisione, con esito spiegato.
Meccanismo: il partecipante valuta il metodo e trova il punto da cui iniziare.
Output: avvio consapevole di un esercizio. Indicatori: comprensione del compito,
avvii verificati, primo completamento, ostacoli di accesso e differenze IT/EN.
Requisiti: esempio verificato e collegamento al percorso. Primo segnale: una
persona prova l'esempio; prima del lancio solo come verifica privata.

#### E3 — Feedback → revisione → ritorno

Input: osservazioni volontarie, errori riproducibili e risultati delle prove.
Meccanismo: classificare difficoltà, correggere materiale/traduzioni e spiegare
l'aggiornamento; il partecipante sceglie se tornare o condividere il corso.
Output: percorso corretto e nuove occasioni volontarie di utilizzo.
Indicatori: problemi riproducibili, risoluzioni, ricorrenza dopo correzione, prove
autonome su casi nuovi e ritorni osservabili senza tracciamento aggiuntivo.
Requisiti: owner del triage e capacità di revisione. Primo segnale pianificabile:
riscontro del pilota nell'orizzonte iniziale di 90 giorni, se persone e materiale
sono disponibili. Non è una promessa di ottenere utenti o risultati entro una data.

### Channel mix

| Canale candidato | Motore | Funzione primaria | Peso | Attivazione |
| --- | --- | --- | --- | --- |
| Ricerca organica verso Pages | E1 | intercettare un bisogno | medio | rilascio completo |
| Repository, README e spazio feedback | E2/E3 | valutazione | alto | stato del progetto già esplicito; corso dopo il rilascio |
| Esempio e collegamenti interni | E2 | avvio | alto | privato prima; pubblico col corso completo |
| Post organici in community esistenti | E1/E2 | scoperta | basso | solo successivamente, con autorizzazione e capacità |

Ogni canale è organico; spesa pubblicitaria e servizi aggiuntivi: **0 €**.
Nessun acquisto o trial come requisito. Massimo tre canali attivi nel primo
orizzonte di pianificazione; il quarto non si aggiunge se supera la manutenzione.

- Ricerca/Pages: «Dalla modifica alla pull request: comprendi cosa cambia»;
  controllare impressioni, clic, query pertinenti e passaggi al programma disponibili.
- Repository: promessa confermata e stato reale; controllare ostacoli segnalati,
  domande ricorrenti, riproducibilità e segnalazioni classificate/corrette.
- Esempio/corso: «Inizia dal livello Base, in italiano o inglese»; controllare
  avvii, primi completamenti, errori di accesso e comprensione dell'esito.
- Community: caso utile e collegamento contestuale; feedback pertinente, accessi
  attribuibili se disponibili e avvii osservabili, senza volumi attesi.

Pages è statico e non sostituisce API/archivio. README introduce utilità, inizio
e assistenza; non prova traffico. Discussions richiede abilitazione e moderazione;
Issues/Discussions su repository pubblica rendono il feedback pubblico. Non
chiedere email, segreti, log privati o dati personali non necessari. Configurazione
di moduli e apertura di canali sono attività operative successive da approvare.

### Activation sequence

1. Dopo approvazione operativa: preparare esempio e raccolta minima del feedback,
   assegnare il responsabile e verificarli privatamente.
2. Prima del lancio: chiudere blocchi e verificare tre livelli e parità IT/EN.
3. Al rilascio completo: collegare pagine, repository ed esempio, con massimo
   tre canali nell'orizzonte iniziale dei 90 giorni.
4. In seguito: valutare community solo se manutenzione e feedback sono sostenibili.

I 90 giorni sono un orizzonte, non una data di consegna né un impegno di traffico.

### Operating requirements

Responsabilità per contenuti, revisione IT/EN e triage, anche nella stessa persona;
nessun incarico è assegnato automaticamente. Budget umano post-lancio confermato:
**1–2 ore/settimana complessive** per lettura dei segnali, triage e piccole revisioni.
Correzioni più ampie richiedono pianificazione e possono sospendere la diffusione
aggiuntiva. Il budget non stima lo sviluppo e la traduzione prima del lancio.

Usare solo dati aggregati affidabili o osservazioni documentate del pilota;
nessuna dashboard giustifica servizi a pagamento o nuova raccolta di dati personali.
Il setup di Search Console e degli strumenti di feedback non è ancora avvenuto.

### What this plan does not solve

Non implementa simulatore, SSO, persistenza, misurazione o accessibilità. Non prova
efficacia né stabilisce target di adozione. CPL e tassi commerciali non sono
pertinenti: i meccanismi pubblicitari non sono selezionati. Le baseline di avvio,
completamento e apprendimento sono da raccogliere, senza intervalli inventati.

## 6. Roadmap

### Calendario e capacità

D1–D90 sono finestre orientative. D1 inizia dopo approvazione operativa, assegnazione
dei responsabili e disponibilità iniziale dichiarata. Le 1–2 ore/settimana confermate
sono soltanto manutenzione post-lancio: non dimensionano sviluppo e traduzioni.

Se il lavoro supera l'orizzonte, slitta il rilascio. Costo dei servizi zero,
tre livelli completi e parità IT/EN rimangono obbligatori. Nessuna data di lancio
è promessa da questo documento.

### Candidati, impatto ed effort

| Candidato | Impatto / effort indicativi | Destinazione |
| --- | --- | --- |
| C1 — Login fra domini gratuiti verificabile | bloccante / medio-alto | I1: dipendenza del lancio |
| C2 — Replay/archivio entro quote gratuite | bloccante / medio-alto | I1, verifica completa I4 |
| C3 — Capacità, dati, score, provider, nome e licenze definiti | bloccante / medio | I1: decisioni prima dei rispettivi passaggi |
| C4 — Incidente IT/EN fra repository e revisione provabile | alto / alto | I2: materiale per E2 |
| C5 — Ipotesi confrontate con pilota volontario | alto / medio | I3: attiva E3 |
| C6 — Tre livelli, laboratorio e progressi IT/EN completi | bloccante / alto | I4: scope del lancio |
| C7 — Identità, accessibilità, SEO e ripristino verificati | bloccante / medio-alto | I4: prontezza |
| C8 — Percorso completo raggiungibile dai canali selezionati | alto / medio | I5: E1/E2/E3 pubblici |
| C9 — Ciclo di manutenzione misurato | alto / basso-medio | I6: sostenibilità |
| C10 — Altri provider social gratuiti | medio / medio-alto | dopo lancio, prerequisiti e bisogno verificati |
| C11 — Casi diffusi in community esistenti | medio / medio | rinviato: capacità residua e autorizzazione |
| C12 — Newsletter continuativa | incerto / medio | parcheggiata: calendario/iscritti non necessari |
| C13 — Shell arbitrarie sul server | fuori perimetro / alto | esclusa: cambia simulazione e fabbisogno operativo |
| C14 — Campagne, domini o servizi acquistati | incompatibile / variabile | esclusi dal costo zero |
| C15 — Classifica competitiva avanzata | incerto / alto | parcheggiata: classifica iniziale didattica |
| C16 — Nuovi contenuti oltre il programma | incerto / alto | rinviati ai problemi osservati |

### Primi 90 giorni: sei iniziative

| # | Initiative (result-phrased) | Source step | Impact | Effort | Owner | Depends on | Milestone | When |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I1 | Fattibilità gratuita e capacità iniziale verificabili | Snapshot, Demand Plan; C1–C3 | bloccante | medio-alto | Responsabile tecnico e decisioni `[OWNER TBD]` | approvazione operativa; responsabili disponibili | dossier go/no-go con prove iniziali, decisioni e capacità assegnata | D1–15 orientativo |
| I2 | Incidente rappresentativo comprensibile e riproducibile IT/EN | Market Map, Positioning, E2; C4 | alto | alto | Responsabile scenari didattici `[OWNER TBD]` | I1 favorevole | caso verificato tra file, storia, revisione e recupero nei due contesti | D16–35 se sostenibile |
| I3 | Ipotesi didattiche confrontate con osservazioni volontarie | P1–P3, E3; C5 | alto | medio | Responsabile verifica didattica `[OWNER TBD]` | I2, partecipanti disponibili, rubriche | registro delle prove con difficoltà e decisioni motivate su scenari/claim | D36–50 subordinato al pilota |
| I4 | Release candidate completa nei tre livelli e nelle due lingue | Snapshot, roadmap tecnica; C6–C7 | bloccante | alto | Responsabile prontezza del rilascio `[OWNER TBD]` | I1–I3, capacità iniziale confermata | artefatto completo che supera correttezza, accesso, persistenza, ripristino e fruibilità | D51–75 se compatibile; altrimenti oltre D90 |
| I5 | Corso completo raggiungibile con i tre motori collegati | Demand Plan E1/E2/E3; C8 | alto | medio | Maintainer pubblicazione `[OWNER TBD]` | I4, setup e pubblicazione approvati, condizioni gratuite | percorso pubblico da pagine, repository ed esempio con feedback utilizzabile | D76–85 solo se tutti i gate passano |
| I6 | Primo ciclo di manutenzione confrontato col budget | Demand Plan E3; C9 | alto | basso-medio | Maintainer corso e feedback `[OWNER TBD]` | I5, una settimana completa osservabile | rapporto del carico effettivo e decisioni per restare entro 1–2 ore/settimana | prima settimana completa post-lancio; può oltrepassare D90 |

Uno stesso responsabile può coprire più ruoli dopo verifica della capacità.
I2/I3 sono una verifica privata, non un lancio pubblico ridotto. I4 conserva
l'intero scope. Le prove iniziali I1 non sostituiscono il test reale completo I4.

### Attivazione dei motori

- E1, scenari cercabili: materiale in I4 e collegamenti pubblici in I5.
  Impressioni e visite quando disponibili; nessuna data garantita di indicizzazione.
- E2, esempio → corso: prova privata I2/I3, avvio pubblico I5. Osservare se
  una persona comprende il compito e raggiunge l'esercizio pertinente.
- E3, feedback → revisione → ritorno: primo ciclo I3, prosecuzione I5/I6.
  Documentare difficoltà, decisione motivata e verifica della correzione.

Nessun volume, tasso di conversione o miglioramento didattico inventato.
Assenza di osservazioni è evidenza mancante, non successo o fallimento automatico.

### Rischi e questioni collegate

| Voce | Iniziative | Prova o condizione |
| --- | --- | --- |
| P1 — file → revisione | I2/I3 | spiegazione e azioni osservate, non claim anticipato |
| P2 — trasferimento fra piattaforme | I2/I3 | distinguere Git e portali su un caso non guidato |
| P3 — recupero motivato | I2/I3 | scelta spiegata e lavoro condiviso conservato |
| G3 — utilità/differenziazione | I3/I6 | osservazioni dei pubblici, nessuna esclusività presunta |
| G5 — successo/autonomia | I1/I3/I6 | rubriche prima delle prove; baseline dopo |
| G6 — owner/capacità/scadenze | I1/tutte | ruoli e disponibilità prima del calendario |
| G8 — provider | I1/I4, C10 | primo percorso gratuito verificato; pulsanti solo operativi |
| G9 — nome/licenze/feedback | I1/I4 | decisioni prima della pubblicazione |
| Auth cross-site | I1/I4 | flusso completo sui domini gratuiti senza cookie terzi |
| CPU e quote | I1/I4/I6 | misurare runtime; ottimizzare o bloccare se incompatibile |
| Score/tentativi/durata | I1/I4 | regole trasparenti e server; pause stimate separate |
| Retention/cancellazione/recupero | I1/I4/I6 | regole esplicite e ripristino provato |

Un esito negativo su autenticazione, quota, correttezza o recupero blocca il lancio;
non autorizza acquisti. Le regole iniziali candidate sono nel
[perimetro operativo](../docs/analysis/implementation-proposal.md), approvato per il lavoro locale.

### Orizzonte di dodici mesi

- Mesi 1–3: affrontare le sei iniziative secondo dipendenze, con calendario
  condizionato. Proseguire oltre il trimestre se i requisiti non sono soddisfatti.
- Mesi 4–6: dopo il lancio, consolidare correttezza, IT/EN e sostenibilità;
  valutare C10 soltanto per un ostacolo osservato e con prerequisiti gratuiti.
  Se il lancio è bloccato, completare prima lo scope iniziale.
- Mesi 7–9: considerare C11 soltanto con capacità residua e autorizzazione.
  Non aggiungere un quarto canale se la manutenzione non lo sostiene.
- Mesi 10–12: riesaminare C16 usando problemi e prove raccolte; aggiornare la
  roadmap prima di nuovi formati. C12/C15 restano parcheggiati senza bisogno dimostrato.

## 7. Assumption & evidence ledger

### Questioni aperte

La confidenza riguarda la risposta di lavoro, non il valore del progetto. Categoria,
ICP e motori sono scelte esplicite confermate; efficacia e condizioni tecniche non
sono diventate evidenze per questo motivo. Nessuna baseline è inventata.

| ID / tipo | Questione e perché conta | Confidenza | Evidenza disponibile | Raccomandazione |
| --- | --- | --- | --- | --- |
| P1 / unverified-claim | collegare file e revisione migliora comprensione? | bassa | specifiche, nessuna app o prova | scenario funzionante e spiegazione osservata, I2/I3 |
| P2 / unverified-claim | trasferimento autonomo fra GitHub/Azure? | bassa | copertura richiesta, non dimostrata | caso non guidato nei due contesti, I2/I3 |
| P3 / unverified-claim | recupero motivato del lavoro condiviso? | bassa | rubriche ancora da implementare | osservare scelta e conseguenze, I2/I3 |
| G3 / assumption | utilità e differenziazione effettive | bassa | mappa pubblica e scelta utente, nessuna esclusività provata | pilota e revisione dei claim, I3/I6 |
| G5 / missing-data | target di adozione e prova di autonomia | bassa | metriche richieste, nessuna baseline | rubriche prima delle prove; raccogliere risultati senza tassi fittizi |
| G6 / missing-data | owner, capacità iniziale e calendario reale | bassa | owner repository noto; solo manutenzione quantificata | assegnare ruoli/capacità prima di D1, ricalendarizzare |
| G8 / assumption | GitHub primo provider e ordine successivo | media | compatibilità di progetto e documentazione provider | verificare nello spike; mostrare solo provider operativi |
| G9 / missing-data | nome pubblico, licenze e canale feedback | bassa | titolo repository e perimetro, nessuna licenza scelta | decidere prima della pubblicazione, distinguere codice/contenuti/asset |
| T1 / assumption | replay e archivio rientrano nelle quote gratuite | bassa | limiti documentati, nessun benchmark dell'app | misura locale e poi reale; ottimizza o blocca il lancio |
| T2 / assumption | SSO funziona cross-site nei browser previsti | bassa | architettura proposta, nessuno spike | provider mantenuto, handoff e prova con cookie terzi bloccati |
| T3 / assumption | regole punti/tempi e tentativi ripetuti | media | definizione semplice proposta, non ancora approvata | valutare il perimetro operativo prima del contratto definitivo |
| T4 / missing-data | retention, cancellazione e recupero | bassa | principi documentati, schema non attivo | politiche esplicite e ripristino prima del rilascio |
| T5 / missing-data | registrazioni OAuth e configurazione reale | bassa | nessun account/secret toccato | setup separato autorizzato; mock non vale come test di login reale |
| T6 / assumption | carico manutenzione entro 1–2 ore/settimana | media | budget umano confermato, nessun carico osservato | misurare prima settimana completa in I6, ridurre canali se necessario |
| T7 / missing-data | volontari disponibili per il pilota | bassa | nessun reclutamento eseguito | predisporre prova e consenso dopo autorizzazione, senza promettere partecipanti |
| T8 / unverified-claim | SEO/accessibilità/prestazioni effettive | bassa | palette calcolata e piani di audit; app assente | audit sul prodotto renderizzato e correzioni, I4 |

Nessun benchmark pubblicitario richiesto: CPL e conversioni commerciali non sono
meccanismi selezionati. I dati di apprendimento vengono raccolti, non sostituiti
con intervalli di comodo. Le ipotesi di costo d'uso vanno separate dalla gratuità
nominale del piano e dalle quote condivise dell'account.

### Evidence map

| Origine | Cosa sostiene | Limite |
| --- | --- | --- |
| Dichiarazioni utente | perimetro, pubblici, IT/EN, simulatore, timer, costo zero, categoria, promessa, motori e budget manutenzione | confermano scelte, non risultati |
| Documentazione repository | architettura, programma, stato dei lavori e verifiche documentali | non dimostra implementazione |
| Fonti pubbliche ufficiali | alternative, meccanismi Google/GitHub e quote dei servizi | non misura efficacia del corso o carico reale |
| Inferenze di progetto | sei iniziative, finestre, dipendenze e ipotesi di prova | approvate come direzione; persone e date operative non sono già assegnate |
| Strumenti connessi | accesso e metadati del repository verificati | nessun CRM, analytics commerciale o fonte a pagamento usata |

Fonti principali e relativi limiti: [Market Map](02-market-map.md),
[Demand Plan](04-demand-plan.md), [hosting](../docs/deployment.md).

## 8. Execution readiness

### 8.1 Conversion design: dalla scoperta all'apprendimento

Percorso pagine/esempio → livello → primo esercizio → esito → ripresa.
Definire obiettivi, rubriche, feedback e passaggio fra livelli. Se si salta questo
lavoro, visite e avvii non dimostrano comprensione. Servono progettazione didattica,
UX e verifica con partecipanti; non un processo di vendita o CRM.

### 8.2 Deployment: attivazione e manutenzione

Costruire e verificare il prodotto, preparare contenuti IT/EN, feedback e procedure
prima di attivare i canali. Servono competenze TypeScript/Git, autenticazione,
dati, accessibilità, traduzione e manutenzione. Le 1–2 ore/settimana sono soltanto
il budget post-lancio. Se lo scope iniziale resta incompleto, rinviare il rilascio;
non ridurre lingue/livelli né attivare servizi a pagamento.

La manutenzione comprende triage e piccole revisioni, non garantisce ogni correzione.
Incidenti importanti possono richiedere sospensione della diffusione o del servizio
online mentre si pianifica la correzione. Nessuno SLA commerciale è promesso.

### 8.3 Measurement: fonti, revisione e decisioni

API per avvii/completamenti confermati; osservazioni volontarie per rubriche e
problemi; segnali Search Console solo quando configurati e disponibili. Niente
traffico inventato o nuovi tracker personali per completare una dashboard.
Il ruolo manutentore deve leggere periodicamente i segnali e decidere quali
correzioni o canali siano sostenibili. Senza questa routine non si può attribuire
un risultato a un motore o confermare il budget di lavoro.

### Capacità e avvio operativo

Nessun fornitore o assunzione a pagamento richiesti dal piano. I ruoli umani sono
ancora da assegnare, senza presumere disponibilità dal solo nome dell'owner.

Il [perimetro operativo reviewabile](../docs/analysis/implementation-proposal.md) specifica risultato,
dipendenze candidate, regole iniziali di classifica e confine della pubblicazione.
Dopo approvazione si può iniziare l'implementazione locale per sottoagenti in
worktree separate, con verifiche e aggiornamento della documentazione. Setup di
account/segreti, risorse, CI di distribuzione, push/PR e pubblicazione sono passaggi
specifici successivi, non autorizzati dalla sola conferma del documento GTM.

## Stato dell’approvazione

Roadmap, consolidato e implementazione locale approvati dall’utente il 15 novembre
2026. L’approvazione non trasforma ipotesi didattiche in prove né autorizza
account reali, risorse esterne o pubblicazione. L’implementazione è iniziata;
verifiche e risultati sono riportati nella documentazione tecnica corrente.
