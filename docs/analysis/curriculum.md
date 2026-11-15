# Percorso didattico proposto

Programma di analisi approvato. Il catalogo implementato e le soluzioni verificate sono in `packages/course-content/src/`; questo documento conserva la mappa iniziale. Italiano e inglese completi al lancio: ogni modulo, guida OS,
aiuto e messaggio dovrà essere disponibile in entrambe le lingue.
Ogni modulo alterna spiegazione, previsione, azione e verifica.
La repository narrativa è un portale con README, catalogo JSON, configurazione YAML
e pagina HTML: gli esercizi non richiedono conoscenze di sviluppo applicativo.
Le verifiche controllano obiettivi e stato, accettando sequenze equivalenti corrette.

## Base

| ID | Argomenti e scenario | Evidenza di successo |
| --- | --- | --- |
| B01 | Cos'è Git, utilità, distribuzione e storia dal 2005; ricostruire versioni di un catalogo | distinguere snapshot, file di lavoro, Git e piattaforme |
| B02 | Installazione Windows/Linux/macOS 26+ con metodi comuni | interpretare versione, percorso eseguibile e canale di aggiornamento |
| B03 | Configurazione system/global/local e gerarchia dei file | identità corretta e origine dei valori con `--show-origin --show-scope` |
| B04 | Clone HTTPS e da VS Code | contenuto, cronologia e `origin` corretti; VS Code non è un protocollo |
| B05 | Chiavi SSH con passphrase e `.ssh/config` | host alias, hostname, user e IdentityFile corretti; condivisa solo la chiave pubblica |
| B06 | Agente SSH e clone SSH sui tre sistemi | identità corretta con `ssh-add -l` e remote coerente |
| B07 | Working tree, staging, status, diff e commit selettivi | committata soltanto la correzione richiesta; resto del lavoro preservato |
| B08 | HEAD, commit e branching | riferimenti corretti; HEAD normalmente simbolico verso il branch attivo |
| B09 | `switch` e introduzione a `checkout` | passaggio tra attività con lavoro locale preservato o blocco spiegato |
| B10 | `fetch`, `pull`, `push` | distinguere aggiornamento remote-tracking, integrazione e pubblicazione |
| B11 | `.gitignore` | esclusioni corrette; capire perché un file già tracciato resta tale |
| B12 | Prova finale: pubblicare una modifica isolata | identità, branch, contenuto, remote e stato finale corretti |

## Intermedio

| ID | Argomenti e scenario | Evidenza di successo |
| --- | --- | --- |
| M01 | `checkout`, `switch`, `restore`, detached HEAD | consultare un vecchio commit e conservare eventuale nuovo lavoro con un riferimento |
| M02 | `revert`, `reset --soft/--mixed/--hard`, reset di path | distinguere nuovo commit, spostamento riferimenti ed effetti su index/working tree |
| M03 | Merge, fast-forward e merge commit | parent e grafo corretti; fast-forward senza nuovo merge commit |
| M04 | Integrazione automatica di modifiche indipendenti | entrambe le intenzioni conservate; assenza di marker non prova correttezza funzionale |
| M05 | Risoluzione manuale di conflitto | contenuto risolto, marker rimossi, staging e conclusione oppure abort corretti |
| M06 | Merge, squash e rebase sullo stesso scenario | confronto di contenuto, parent e nuovi identificativi |
| M07 | PR GitHub e Azure DevOps con revisione | sorgente/destinazione, descrizione, controlli e discussioni corretti |
| M08 | Remotes e fork GitHub | `origin` sul fork e `upstream` sull'originale; clone/fork/branch distinti |
| M09 | Branching models: trunk-based, GitHub flow e release branch | scegliere in base a frequenza rilasci e versioni mantenute |
| M10 | Policy Azure, protected branches e rulesets GitHub | push vietato rifiutato; PR incompleta bloccata; PR conforme accettata |
| M11 | Tag annotati e release GitHub | commit corretto, tag pubblicato, release con note coerenti |
| M12 | Prova finale: collaborazione, conflitto e release tramite PR | nessuna modifica persa, contenuto e regole rispettati |

## Avanzato

| ID | Argomenti e scenario | Evidenza di successo |
| --- | --- | --- |
| A01 | Interactive rebase: pick, reword, squash, fixup, riordino, drop | storia locale revisionabile con contenuto finale corretto |
| A02 | Reflog e recupero dopo reset/rebase | riferimento di salvataggio creato senza perdere altro lavoro |
| A03 | Rollback tramite revert di merge | parent ispezionati, mainline motivata e revert revisionabile |
| A04 | `.gitattributes`, fine riga, binari e merge driver | normalizzazione separata dalle modifiche funzionali |
| A05 | `rerere` e limiti della risoluzione automatica | controllare, accettare o scartare risoluzioni riutilizzate |
| A06 | Worktree rispetto ai branch | due directory con HEAD/index propri e oggetti condivisi; attività preservate |
| A07 | Dove Git salva file e metadati | working tree, index, blob, tree, commit, refs, HEAD, reflog e packfile distinti |
| A08 | Git hooks e controlli server | controllo locale funziona, ma bypass e mancata distribuzione automatica sono compresi |
| A09 | SSH per account multipli e diagnosi agenti | host alias, `IdentitiesOnly`, binario SSH e chiave corretti |
| A10 | Claude sul codice in cloud | distinguere clone remoto, branch, modifiche, commit, push e revisione umana |
| A11 | Governance avanzata GitHub/Azure | verificare permessi, bypass, automazioni, hotfix e release |
| A12 | Prova finale: regressione durante una release | worktree, recupero, rollback e PR conforme conservano il lavoro |

## Installazione e SSH per sistema

| Sistema | Metodi da confrontare | Configurazione e agente |
| --- | --- | --- |
| Windows | Git for Windows, `winget install --id Git.Git -e --source winget`; WSL come Linux separato; Scoop/Chocolatey opzionali | Windows OpenSSH in `%USERPROFILE%\.ssh\config`; Git Bash e agente di sessione rispetto al servizio `ssh-agent`; comandi amministrativi etichettati PowerShell |
| Linux | APT Debian/Ubuntu, DNF Fedora; sorgenti come approfondimento | `~/.ssh/config`, permessi; `eval "$(ssh-agent -s)"` e `ssh-add`; distinguere sessione shell e integrazione desktop |
| macOS 26+ | Xcode Command Line Tools, Homebrew, MacPorts; confronto binari e PATH | agente integrato, `AddKeysToAgent`, `UseKeychain`, `/usr/bin/ssh-add --apple-use-keychain`; distinguere strumenti Apple e altri OpenSSH |

Non consigliare il vecchio installer macOS come opzione mantenuta. Identificare
sempre gli eseguibili `git` e `ssh` effettivamente utilizzati, soprattutto con WSL,
Git Bash o più package manager. Le guide reali sono facoltative e non chiedono
mai di caricare chiavi private o passphrase nel sito.

GitHub raccomanda Ed25519; la documentazione corrente Azure Repos indica RSA con
negoziazione RSA-SHA2. Insegnare coppie/configurazioni distinte o l'opzione RSA
compatibile. Non riabilitare SHA-1 come soluzione generica agli errori SSH.

## Errori concettuali da prevenire

- `git add` fotografa il file in quel momento: modifiche successive non aggiornano l'index.
- HEAD non coincide sempre con l'ultimo commit di tutta la repository.
- Pull integra dopo fetch secondo opzioni e configurazioni; non è sempre merge.
- Reset di path non sposta il branch; le modalità di reset hanno effetti differenti.
- Rebase ricrea commit; la storia condivisa richiede coordinamento e uso motivato di `--force-with-lease`.
- `git revert -m 1` richiede di verificare il parent mainline; reintrodurre una feature annullata richiede strategia esplicita.
- `-X ours` e strategia `ours` sono diversi; durante rebase ours/theirs richiede spiegazione contestuale.
- Reflog è locale e soggetto a scadenza; non recupera automaticamente file mai registrati.
- `.git` può essere directory o file di collegamento; le worktree condividono parte dei metadati.
- PR, fork e release appartengono alla piattaforma. Nomi remote `origin` e `upstream` sono convenzioni.
- Gli agenti cloud non vedono automaticamente il computer locale e non usano necessariamente worktree.

## Valutazione e aggiornamenti

Durate ipotizzate da validare nel pilota: Base 3–4 ore, Intermedio 4–5, Avanzato
5–6, suddivise in sessioni brevi. Non costituiscono promesse o dati misurati.
Ogni modulo dovrà specificare seed, obiettivi, azioni disponibili, evidenza e feedback.
Punteggio e tempo sono ancora decisioni aperte; nessuna penalità implicita per
lettura, accessibilità o una soluzione corretta alternativa.
Fonti di piattaforma e schermate avranno data di revisione e versione del corso.

## Fonti primarie

- [Git Windows](https://git-scm.com/install/win) e [Git macOS](https://git-scm.com/install/mac)
- [Chiavi SSH GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [SSH Azure Repos](https://learn.microsoft.com/en-us/azure/devops/repos/git/use-ssh-keys-to-authenticate?view=azure-devops)
- [Git revert](https://git-scm.com/docs/git-revert), [worktree](https://git-scm.com/docs/git-worktree), [repository layout](https://git-scm.com/docs/gitrepository-layout)
- [Claude Code sul web](https://code.claude.com/docs/en/claude-code-on-the-web)
