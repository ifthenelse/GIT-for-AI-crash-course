# Positioning Architecture — GIT-for-AI-crash-course

*Go2Rev GTM Planner · Fase 3 di 5 · Confermato dall’utente · 15 novembre 2026*

## 1. Executive summary

Categoria confermata: **laboratorio visuale di collaborazione con Git**. Il corso
vuole aiutare a scegliere come collaborare e recuperare dagli errori comprendendo
le conseguenze sulla repository. La proposta collega modifiche, storia, PR e policy
nello stesso scenario; visualizzazione, livelli e interattività da soli non provano
una differenza rispetto alle alternative.

La promessa è un obiettivo didattico da verificare. I tre pilastri sono candidati
`unverified-claim`: requisiti e documentazione dimostrano un'intenzione progettuale,
non l'efficacia di un'applicazione ancora da implementare.

## 2. Category decision

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

## 3. Core promise

**IT:** «Collabora con Git sapendo cosa cambia e come recuperare il lavoro.»

**EN:** “Collaborate with Git knowing what changes and how to recover your work.”

**Fallback IT:** «Scegli come collaborare e recuperare con Git, vedendo cosa cambia nella repository.»

**Fallback EN:** “Choose how to collaborate and recover with Git, seeing what changes in the repository.”

La promessa riguarda autonomia e comprensione; è coerente con gli scenari
specificati. Diventerà una capacità dimostrata solo dopo prove su problemi nuovi
svolti senza guida. In una pagina di progetto deve essere chiaro che il corso
è in progettazione, senza descrivere il risultato come già disponibile.

## 4. Pillars

### P1 — Dal file alla revisione

- Claim candidato: collegare una modifica ai suoi effetti sulla storia e sulla revisione condivisa.
- Relevant: plausibile per i pubblici dichiarati, senza riscontri diretti ancora disponibili.
- Differentiated: ipotesi rispetto all'enfasi sul grafo di LearnGitBranching e sul lavoro reale di GitHub Skills; nessuna esclusività dimostrata.
- Defensible: non ancora superato; viste sincronizzate specificate, senza implementazione osservabile.
- Prova necessaria: scenario funzionante e partecipante capace di spiegare file, index, commit e PR. Stato: `unverified-claim P1`.

### P2 — Lo stesso problema, due contesti

- Claim candidato: riconoscere principi Git comuni e differenze operative fra GitHub e Azure DevOps.
- Relevant: coerente con il pubblico, frequenza del bisogno ancora ignota.
- Differentiated: ipotesi rispetto ai percorsi che enfatizzano una piattaforma; unicità non accertata.
- Defensible: non ancora superato; la copertura è un requisito, non una capacità già realizzata.
- Prova necessaria: scenari corrispondenti verificati sulle fonti e trasferimento autonomo fra contesti. Stato: `unverified-claim P2`.

### P3 — Recupero motivato

- Claim candidato: scegliere una strategia di recupero spiegandone l'effetto sul lavoro condiviso.
- Relevant: bisogno plausibile da verificare.
- Differentiated: conflitti e recupero già esistono nelle alternative; l'ipotesi riguarda la verifica della motivazione.
- Defensible: non ancora superato; mancano simulatore e risultati di apprendimento.
- Prova necessaria: rubriche che valutino scelta, conseguenze e conservazione del lavoro altrui su un incidente nuovo. Stato: `unverified-claim P3`.

Nessuno dei tre candidati è presentato come pilastro già validato. Confermare
l'architettura dei messaggi non equivale a superare il test dei pilastri.

## 5. Segment translations

| Pubblico | Traduzione della stessa promessa | Enfasi e lessico |
| --- | --- | --- |
| Engineers | integra modifiche e recupera comprendendo la storia condivisa | P1/P3; branch, diff, commit, conflitto |
| Architects | valuta integrazione e recupero comprendendone gli effetti sulla collaborazione | P2/P3; policy, storia condivisa, integrazione, rollback |
| Business con esperienza tecnica | collabora sulle modifiche e recupera una versione comprendendo il lavoro del gruppo | P1/P3; modifica, revisione, versione, ripristino |

Non sono tre prodotti o promesse incompatibili; termini e approfondimento cambiano
con il contesto del partecipante.

## 6. Messages per funnel stage

Percorso scoperta → scelta → avvio, senza presupporre una vendita. Sono testi
candidati per quando il prodotto sarà disponibile, non una descrizione dello stato attuale.

| Momento | Messaggio principale | Varianti |
| --- | --- | --- |
| Scoperta | Un laboratorio visuale per collaborare con Git. | Dalla modifica alla pull request: comprendi cosa cambia. / Esplora le conseguenze delle decisioni Git. |
| Scelta | Segui lo stesso scenario tra file, commit e revisione. | Confronta le decisioni su GitHub e Azure DevOps. / Guarda il percorso: basi, collaborazione e recupero. |
| Avvio | Inizia dal livello Base, in italiano o inglese. | Accedi con un provider disponibile e avvia il primo esercizio. / Riprendi dall'ultimo progresso salvato. |

## 7. Anti-messages bank

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

## 8. What this changes tomorrow

Titolo durante la progettazione: «Un laboratorio visuale di collaborazione con
Git, in progettazione.» Sottotitolo: «Scenari su GitHub e Azure DevOps per comprendere
modifiche, revisioni e recupero. Percorso previsto in italiano e inglese.»

La presentazione spiega bisogno, scenario e conseguenze da comprendere, distinguendo
progetto e capacità dimostrate. Temi coerenti: revisioni, conflitti, recupero e
differenze operative. Classifica come prova di competenza e stack interno come
beneficio didattico non sostengono il posizionamento.
Il piano di diffusione dovrà rispettare servizi gratuiti, assenza di campagne
a pagamento e budget di manutenzione post-lancio confermato di 1–2 ore/settimana.

## 9. Open questions

P1–P3 rimangono ipotesi. Prima di pubblicare claim di efficacia servono scenari
funzionanti, rubriche e prove con rappresentanti dei tre pubblici. Non esistono
ancora dati sufficienti per dichiarare un vantaggio rispetto alle alternative.

Promessa IT/EN e messaggi sono stati confermati dall’utente il 15 novembre 2026.
I pilastri restano ipotesi non verificate: la conferma autorizza il passo di analisi
successivo, non dichiara efficacia, capacità già realizzate o approvazione operativa.
