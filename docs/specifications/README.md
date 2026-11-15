# Specifiche del corso Git

Il perimetro locale è approvato. I contratti implementati sono in
`packages/contracts/src/index.ts`; il catalogo eseguibile è in
`packages/course-content/src/`. Corso versione `1.0.0`, motore versione `1`.

- [Architettura e API effettive](../architecture.md).
- [Mappa iniziale degli argomenti](../analysis/curriculum.md).
- [Window manager](../window-manager.md) e [tempo e pause](../timing-and-pauses.md).
- [Test e limiti](../testing.md), [audit](../audits/README.md).
- [Hosting e gate di pubblicazione](../deployment.md).

La regola implementata è 100 punti per prima conclusione valida; 12 esercizi
concludono un tier e sbloccano il successivo. Reset e undo non annullano i risultati.
I provider reali richiedono configurazione separata; nessun account o servizio
viene creato automaticamente dalle variabili di ambiente.
