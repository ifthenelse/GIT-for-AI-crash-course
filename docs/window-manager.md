# Gestore delle finestre del laboratorio

Confermato: terminale, cronologia Git, editor e portale repository sono finestre
impilabili e riordinabili anche su piccoli viewport. La specifica rimane da
implementare dopo approvazione.

## Comportamenti

| Funzione | Proposta |
| --- | --- |
| Desktop iniziale | quattro finestre in griglia 2×2 |
| Attivazione | click o ingresso del focus portano davanti la finestra |
| Dock | quattro pulsanti sempre raggiungibili con nome e stato |
| Minimizza | nasconde la finestra conservando contenuto, cursore e cronologia |
| Ripristina | recupera posizione e ultimo focus valido |
| Ingrandisci | occupa l'area del laboratorio, mantenendo HUD, dock e uscita |
| Sposta/ridimensiona | trascinamento o menu con controlli equivalenti da tastiera |
| Disponi | preset griglia, affianca, sovrapponi e ripristina disposizione |
| Panoramica | elenco delle quattro finestre con stato e azioni di recupero |

Le finestre principali si minimizzano; non si chiudono accidentalmente.
Il comando Chiudi riguarda elementi temporanei, come un confronto di file.
Nessun comando di disposizione distrugge lo stato Git o ricrea l'editor.

## Tastiera e accessibilità

Finestre come regioni titolate non modali, ordine DOM stabile anche se cambia
lo z-order. Quando il focus entra in una finestra coperta, questa viene mostrata
prima che il controllo focalizzato possa restare nascosto.

Ogni titolo offre un menu con Sposta, Ridimensiona, Minimizza, Ingrandisci e preset.
In modalità Sposta le frecce muovono, Invio conferma ed Esc annulla; la modalità
è annunciata e non intercetta le scorciatoie del browser o del sistema operativo.
Ridimensiona offre valori di larghezza/altezza e pulsanti per modificarli.
Nessuna operazione richiede soltanto trascinamento.

Minimizzando si sposta il focus al pulsante nel dock; i contenuti nascosti sono
esclusi dall'albero accessibile e dalla tabulazione, mantenendo lo stato in memoria.
Uscendo dall'ingrandimento si recuperano layout e focus precedenti. Panoramica
può essere un dialogo con ritorno del focus al comando che l'ha aperta.
Il terminale e l'editor offrono un percorso di uscita da tastiera documentato;
nella modalità testo semplice Tab esce dal campo e l'indentazione ha un comando.

Gli annunci di spostamento sono concisi, senza leggere coordinate a ogni pixel.
Con `prefers-reduced-motion` eliminare animazioni di spostamento e zoom.

## Viewport piccolo

Usare finestre sovrapposte in cascata con dock e panoramica, non una UI di sole tab.
La finestra attiva può occupare quasi tutto lo spazio e può essere ingrandita.
Preset affiancati disponibili solo quando restano leggibili i contenuti.
Titolo e controlli di recupero rimangono raggiungibili dopo rotazione, resize
o apertura della tastiera virtuale. Nessun controllo soltanto hover.

Il viewport della pagina non richiede scroll orizzontale. Codice e grafo possono
avere scroll interno quando necessario; il grafo dispone anche di elenco testuale.
Obiettivo per i controlli principali: 44 CSS px, con verifica della disposizione
reale a 320 CSS px, testo al 200% e zoom al 400%.

## Persistenza

Preferenze locali per account, browser/dispositivo e classe di viewport, separate
dalla repository e dalla cronologia Zundo. Annullare un comando Git non sposta
le finestre. Non promettere sincronizzazione del layout tra dispositivi.

Salvare posizioni normalizzate, dimensioni e stati; validare versione e limiti
al ripristino. Coordinate fuori area vengono ricondotte a un preset sicuro.
Ripristina disposizione riguarda le finestre; Ripristina esercizio riguarda
lo scenario e non cancella un completamento già confermato.

## Messaggi IT/EN

| Italiano | English |
| --- | --- |
| Ripristina Terminale | Restore Terminal |
| Ingrandisci finestra | Maximize window |
| Ripristina dimensioni | Restore window size |
| Mostra tutte le finestre | Show all windows |
| Disponi finestre | Arrange windows |
| Ripristina disposizione | Reset window layout |
| Disposizione salvata su questo dispositivo. | Window layout saved on this device. |
| Tempo di studio stimato | Estimated study time |
| Il timer di studio è in pausa. Il tempo ufficiale continua. | The study timer is paused. Official elapsed time continues. |
| La stima usa i segnali del browser. Cambiare finestra non modifica il punteggio. | The estimate uses browser signals. Switching windows does not affect your score. |

## Criteri di accettazione

Completare lo scenario e tutte le operazioni del gestore con sola tastiera;
recuperare ogni finestra dopo sovrapposizione, viewport cambiato e dati layout
obsoleti; preservare focus, selezione e cursore; verificare screen reader, touch,
entrambi i temi e entrambe le lingue. Passare tra finestre simulate non deve
attivare una pausa del documento. Audit del prodotto renderizzato prima del lancio.
