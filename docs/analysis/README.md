# Analisi del corso Git

Aggiornamento: 15 novembre 2026. Base della ricognizione: commit `c723660`.

L'utente ha approvato roadmap, piano consolidato e implementazione locale il
15 novembre 2026. Le analisi conservano le motivazioni e le ipotesi di partenza.
Per il risultato attuale leggere README.md, docs/architecture.md e docs/testing.md.
Account reali, risorse cloud, segreti e pubblicazione restano passaggi separati.

| Documento | Stato |
| --- | --- |
| [Architettura](../architecture.md) | requisiti aggiornati con le risposte utente; implementazione locale approvata |
| [Programma didattico](curriculum.md) | 36 moduli implementati IT/EN, tutti gli argomenti richiesti coperti |
| [Design e verifiche](design-and-quality.md) | proposta iniziale; audit del prodotto in docs/audits/ |
| [Business Snapshot](../../gtm-plan/01-business-snapshot.md) | GTM Planner, fase 1 confermata con correzioni |
| [Mappa delle alternative](../../gtm-plan/02-market-map.md) | fase 2 GTM confermata; categoria scelta dall'utente |
| [Posizionamento](../../gtm-plan/03-positioning.md) | fase 3 GTM, promessa IT/EN e messaggi confermati |
| [Piano di diffusione](../../gtm-plan/04-demand-plan.md) | fase 4 GTM, motori e canali gratuiti confermati |
| [Roadmap GTM](roadmap.md) | sei iniziative e direzione a 12 mesi approvate |
| [GTM Plan consolidato](gtm-plan.md) | approvato dopo verifica trasversale; ledger completo |
| [Perimetro operativo](implementation-proposal.md) | perimetro locale e dipendenze approvati |
| [Plan QA](plan-qa.md) | controllo trasversale prima della consolidazione |
| [Decisioni](decision-tree.md) | primo round risolto; prossimi checkpoint evidenziati |
| [Window manager](../window-manager.md) | finestre impilabili e riordinabili, anche da tastiera |
| [Tempo e pause](../timing-and-pauses.md) | elapsed server e stime browser separati |
| [Roadmap tecnica](product-roadmap.md) | sequenza di sviluppo proposta, non GTM consolidato |
| [Hosting pubblico](../deployment.md) | solo GitHub Pages e backend entro quote gratuite |
| [Skill](skills.md) | inventario, fonti upstream e pulizia eseguita |
| [Verifiche](../testing.md) | evidenze applicative e limiti delle verifiche |

Analisi distribuita tra cinque sottoagenti: inventario/dependenze delle skill,
programma didattico, System Design, percorso GTM, design e piano SEO/accessibilità;
un ulteriore sottoagente verifica le fonti gratuite del piano di diffusione.
Scritture della working copy eseguite soltanto dall'agente coordinatore.

## Confini e ripresa

La richiesta di eliminazione delle skill inutilizzate e il pull sono già autorizzati.
La pulizia è eseguita; l'implementazione locale è verificata.

La repository riguarda esclusivamente il corso pubblico indipendente. La documentazione,
le skill conservate e i file locali sono allineati a questo perimetro.

GTM Planner ha completato intake, mappa, posizionamento e diffusione, confermati dall'utente.
Categoria: «laboratorio visuale di collaborazione con Git». Promessa: «Collabora
con Git sapendo cosa cambia e come recuperare il lavoro.» Roadmap e piano consolidato
sono approvati dopo il controllo trasversale.
Il perimetro operativo permette di approvare il lavoro locale concreto e le relative
dipendenze, mantenendo separati setup degli account e pubblicazione.
Le date dipenderanno dalla capacità del team: nessuna data di lancio è stata inventata.

Logo SVG, asset derivati, app, dipendenze e contratti sono implementati localmente.
CI/CD di distribuzione e setup cloud restano separati.
Non sono stati eseguiti push o aperte PR.
