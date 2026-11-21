import { c, cmd, commit, diverged, edit, FEATURE, files, gitRef, lesson, linear, MAIN, MERGE, platform, refs, ROOT, seed, t } from './helpers.ts';
const mergeTree = {
  ...files,
  'README.md': '# Git Practice Lab\nReviewed catalog\n',
  'catalog.json': '{"items":["tea","coffee"]}\n'
};
const mergedSeed = seed({
  files: mergeTree,
  trackedFiles: mergeTree,
  commits: [...diverged().commits!, commit(MERGE, [MAIN, FEATURE], 'Merge catalog feature', mergeTree)],
  branches: {
    main: MERGE,
    feature: FEATURE
  }
});
export const advancedLessons = [lesson({
  id: 'A01',
  title: t('Rebase: cambiare la base', 'Rebase: change the base'),
  summary: t('Riapplica una modifica locale sopra main e osserva nuovi identificativi.', 'Replay a local change on main and observe new identifiers.'),
  concepts: [c('Riapplicare non sposta oggetti esistenti', 'Replaying does not move existing objects', 'Rebase ricrea i commit della linea corrente sopra una nuova base. I nuovi parent e metadati producono nuovi identificativi; gli oggetti originali possono restare nel database locale. Prima di iniziare verifica working tree pulita, branch corrente e storia condivisa.', 'Rebase recreates commits from the current line on a new base. New parents and metadata produce new identifiers; original objects may remain in the local database. Before starting, check a clean working tree, current branch, and shared history.'), c('Pubblicare una storia riscritta', 'Publishing rewritten history', 'Evita di riscrivere branch condivisi senza coordinamento. --force-with-lease controlla un riferimento remoto atteso, ma un fetch automatico può aggiornarlo: non è una garanzia assoluta contro sovrascritture. In questo scenario feature è locale e le modifiche interessano file distinti.', 'Avoid rewriting shared branches without coordination. --force-with-lease checks an expected remote reference, but an automatic fetch may refresh it: it is not an absolute guarantee against overwrites. Here feature is local and changes affect different files.')],
  task: t("Passa a feature ed esegui rebase su main. Conserva coffee e Reviewed catalog, lasciando la repository pulita.\n\n\nPassi nel laboratorio:\n\n1. Nel terminale, esegui:\n```bash\ngit switch feature\n```\n\n2. Nel terminale, esegui:\n```bash\ngit rebase main\n```\n\nRisultato atteso: `README.md` contiene `Reviewed catalog`; `catalog.json` contiene `coffee`; non ci sono modifiche da registrare.", "Switch to feature and rebase onto main. Retain coffee and Reviewed catalog, leaving the repository clean.\n\n\nSteps in the laboratory:\n\n1. In the terminal, run:\n```bash\ngit switch feature\n```\n\n2. In the terminal, run:\n```bash\ngit rebase main\n```\n\nExpected result: `README.md` contains `Reviewed catalog`; `catalog.json` contains `coffee`; there are no uncommitted changes."),
  hints: [t('git switch feature, poi git rebase main.', 'git switch feature, then git rebase main.')],
  seed: diverged(),
  objectives: [{
    type: 'flag',
    name: 'rebased'
  }, {
    type: 'file',
    path: 'README.md',
    includes: 'Reviewed catalog'
  }, {
    type: 'file',
    path: 'catalog.json',
    includes: 'coffee'
  }, {
    type: 'clean'
  }],
  solution: [cmd('git switch feature'), cmd('git rebase main')],
  reference: refs(gitRef('rebase'))
}), lesson({
  id: 'A02',
  title: t('Interactive rebase: fixup', 'Interactive rebase: fixup'),
  summary: t('Combina due commit locali modificando la lista delle operazioni.', 'Combine two local commits by editing the operation list.'),
  concepts: [c('Una lista esplicita', 'An explicit list', 'git rebase -i main apre nell’editor una lista dal commit più vecchio al più recente. pick mantiene il commit, reword cambia il messaggio, squash combina anche i messaggi, fixup combina scartando quello successivo, drop omette il commit. In questo simulatore l’editor è il file .git/rebase-todo.', 'git rebase -i main opens an editor list from oldest to newest commit. pick retains a commit, reword changes its message, squash combines messages too, fixup combines while discarding the later message, and drop omits a commit. In this simulator the editor is the .git/rebase-todo file.'), c('Controllare prima del push', 'Inspect before pushing', 'Non eliminare una riga senza capirne il contenuto: potresti perdere una modifica. Dopo il rebase verifica file e storia, quindi testa il codice. --abort ripristina il punto precedente durante l’operazione. Il simulatore non implementa tutte le istruzioni del rebase reale.', 'Do not remove a line without understanding its contents: you might lose a change. After rebase inspect files and history, then test the code. --abort restores the previous point during the operation. The simulator does not implement every real rebase instruction.')],
  task: t("Su feature combina il secondo commit nel primo con fixup, conservando coffee e una storia pulita.\n\n\nPassi nel laboratorio:\n\n1. Nel terminale, esegui:\n```bash\ngit rebase -i main\n```\n\n2. Nell’editor apri `.git/rebase-todo` e sostituisci tutto il contenuto con:\n```\npick b2c3d4e Draft guide\nfixup c3d4e5f Fix catalog\n```\n\n3. Nel terminale, esegui:\n```bash\ngit rebase --continue\n```\n\nRisultato atteso: `catalog.json` contiene `coffee`; non ci sono modifiche da registrare.", "On feature fix up the second commit into the first, preserving coffee and a clean history.\n\n\nSteps in the laboratory:\n\n1. In the terminal, run:\n```bash\ngit rebase -i main\n```\n\n2. In the editor, open `.git/rebase-todo` and replace its entire contents with:\n```\npick b2c3d4e Draft guide\nfixup c3d4e5f Fix catalog\n```\n\n3. In the terminal, run:\n```bash\ngit rebase --continue\n```\n\nExpected result: `catalog.json` contains `coffee`; there are no uncommitted changes."),
  hints: [t('Mantieni pick per b2c3d4e e usa fixup per c3d4e5f. Salva il file e usa --continue.', 'Keep pick for b2c3d4e and use fixup for c3d4e5f. Save the file and use --continue.')],
  seed: linear(),
  objectives: [{
    type: 'flag',
    name: 'interactiveRebase'
  }, {
    type: 'flag',
    name: 'rebased'
  }, {
    type: 'file',
    path: 'catalog.json',
    includes: 'coffee'
  }, {
    type: 'clean'
  }],
  solution: [cmd('git rebase -i main'), edit('.git/rebase-todo', `pick ${MAIN} Draft guide\nfixup ${FEATURE} Fix catalog\n`), cmd('git rebase --continue')],
  reference: refs(gitRef('rebase'))
}), lesson({
  id: 'A03',
  title: t('Conflitto durante un rebase', 'Conflict during a rebase'),
  summary: t('Risolvi una modifica riapplicata e prosegui senza creare un merge.', 'Resolve a replayed change and continue without creating a merge.'),
  concepts: [c('Ours e theirs dipendono dall’operazione', 'Ours and theirs depend on the operation', 'Durante un rebase ours indica la nuova base e i commit già riapplicati; theirs è il commit che stai riapplicando. Il significato può sorprendere se lo ricordi dal merge. Leggi il contenuto e l’intenzione invece di scegliere sempre un lato.', 'During rebase ours means the new base and commits already replayed; theirs is the commit being replayed. This can surprise you if you remember merge terminology. Read the content and intent rather than always choosing one side.'), c('Stage e continue', 'Stage and continue', 'Rimuovi i marker, conserva le intenzioni compatibili e usa git add sul file risolto. git rebase --continue crea il commit riapplicato e passa al successivo. Non usare un normale commit per chiudere un rebase. Il simulatore consente abort per tornare al punto iniziale.', 'Remove markers, preserve compatible intentions, and git add the resolved file. git rebase --continue creates the replayed commit and advances to the next. Do not use an ordinary commit to finish a rebase. The simulator supports abort to return to the starting point.')],
  task: t("Riapplica feature su main e risolvi README.md con “Reviewed and expanded catalog”. Concludi il rebase.\n\n\nPassi nel laboratorio:\n\n1. Nel terminale, esegui:\n```bash\ngit switch feature\n```\n\n2. Nel terminale, esegui:\n```bash\ngit rebase main\n```\n\n3. Nell’editor apri `README.md` e sostituisci tutto il contenuto con:\n```\n# Git Practice Lab\nReviewed and expanded catalog\n```\n\n4. Nel terminale, esegui:\n```bash\ngit add README.md\n```\n\n5. Nel terminale, esegui:\n```bash\ngit rebase --continue\n```\n\nRisultato atteso: `README.md` contiene `Reviewed and expanded catalog`; non restano conflitti; non ci sono modifiche da registrare.", "Rebase feature onto main and resolve README.md with “Reviewed and expanded catalog”. Finish the rebase.\n\n\nSteps in the laboratory:\n\n1. In the terminal, run:\n```bash\ngit switch feature\n```\n\n2. In the terminal, run:\n```bash\ngit rebase main\n```\n\n3. In the editor, open `README.md` and replace its entire contents with:\n```\n# Git Practice Lab\nReviewed and expanded catalog\n```\n\n4. In the terminal, run:\n```bash\ngit add README.md\n```\n\n5. In the terminal, run:\n```bash\ngit rebase --continue\n```\n\nExpected result: `README.md` contains `Reviewed and expanded catalog`; no conflicts remain; there are no uncommitted changes."),
  hints: [t('Dopo il conflitto modifica README.md, git add README.md e git rebase --continue.', 'After the conflict edit README.md, git add README.md, then git rebase --continue.')],
  seed: diverged(true),
  objectives: [{
    type: 'flag',
    name: 'rebased'
  }, {
    type: 'file',
    path: 'README.md',
    includes: 'Reviewed and expanded catalog'
  }, {
    type: 'no-conflicts'
  }, {
    type: 'clean'
  }],
  solution: [cmd('git switch feature'), cmd('git rebase main'), edit('README.md', '# Git Practice Lab\nReviewed and expanded catalog\n'), cmd('git add README.md'), cmd('git rebase --continue')],
  reference: refs(gitRef('rebase'))
}), lesson({
  id: 'A04',
  title: t('Rollback di un merge', 'Roll back a merge'),
  summary: t('Annulla l’effetto di un merge conservando la storia condivisa.', 'Undo a merge’s effect while preserving shared history.'),
  concepts: [c('Scegliere il parent mainline', 'Choose the mainline parent', 'Un merge ha più parent. git revert -m 1 MERGE annulla la differenza rispetto al primo parent; -m 2 conserva come linea principale il secondo. Il numero non indica un nome di branch. Ispeziona i parent e identifica il contenuto da preservare.', 'A merge has multiple parents. git revert -m 1 MERGE reverses its difference relative to the first parent; -m 2 treats the second as the mainline. The number does not name a branch. Inspect parents and identify which content to preserve.'), c('La storia rimane collegata', 'History stays connected', 'Revert aggiunge un commit inverso senza rimuovere il merge. Integrare di nuovo lo stesso branch può non reintrodurre le modifiche: gli antenati risultano già integrati. Per riproporre il lavoro possono servire revert del revert o nuovi commit, con verifica funzionale e accordo del team.', 'Revert adds an inverse commit without removing the merge. Merging the same branch again may not reintroduce changes because its ancestors are already integrated. Reintroducing work may require reverting the revert or adding new commits, with functional verification and team agreement.')],
  task: t("Ispeziona il merge d4e5f6a e annullane il contributo feature preservando il primo parent. Il catalogo deve tornare a tea.\n\n\nPassi nel laboratorio:\n\n1. Nel terminale, esegui:\n```bash\ngit show --format=raw HEAD\n```\n\n2. Nel terminale, esegui:\n```bash\ngit revert -m 1 HEAD\n```\n\nRisultato atteso: `catalog.json` contiene esattamente il testo mostrato sopra; non ci sono modifiche da registrare.", "Inspect merge d4e5f6a and reverse the feature contribution while preserving its first parent. The catalog must return to tea.\n\n\nSteps in the laboratory:\n\n1. In the terminal, run:\n```bash\ngit show --format=raw HEAD\n```\n\n2. In the terminal, run:\n```bash\ngit revert -m 1 HEAD\n```\n\nExpected result: `catalog.json` contains exactly the text shown above; there are no uncommitted changes."),
  hints: [t('Usa git show --format=raw HEAD e poi git revert -m 1 HEAD.', 'Use git show --format=raw HEAD, then git revert -m 1 HEAD.')],
  seed: mergedSeed,
  objectives: [{
    type: 'flag',
    name: 'mergeReverted'
  }, {
    type: 'file',
    path: 'catalog.json',
    content: files['catalog.json']
  }, {
    type: 'history',
    minimum: 5
  }, {
    type: 'clean'
  }],
  solution: [cmd('git show --format=raw HEAD'), cmd('git revert -m 1 HEAD')],
  reference: refs(gitRef('revert'))
}), lesson({
  id: 'A05',
  title: t('Reflog e recupero locale', 'Reflog and local recovery'),
  summary: t('Dai un nome a un commit abbandonato prima che diventi irraggiungibile.', 'Name an abandoned commit before it becomes unreachable.'),
  concepts: [c('Un registro locale dei riferimenti', 'A local record of references', 'Il reflog registra aggiornamenti locali a HEAD e altri riferimenti. HEAD@{1} identifica una voce del registro, non il parent del commit: HEAD~1 e HEAD@{1} possono indicare oggetti diversi. Usa git reflog e git show per verificare prima di recuperare.', 'Reflog records local updates to HEAD and other references. HEAD@{1} identifies a log entry, not a commit parent: HEAD~1 and HEAD@{1} may identify different objects. Use git reflog and git show to inspect before recovering.'), c('Recupero senza promesse illimitate', 'Recovery has limits', 'Reflog e oggetti non referenziati possono scadere ed essere rimossi dalla garbage collection. Il reflog non viene pubblicato dal push e non recupera file mai salvati in un oggetto. Crea un branch di recupero appena trovi il commit corretto; il backup rimane un tema distinto.', 'Reflog and unreferenced objects can expire and be removed by garbage collection. Reflog is not published by push and cannot recover files never stored in an object. Create a recovery branch as soon as you find the right commit; backups remain a separate concern.')],
  task: t("Simula un reset hard ad a1b2c3d, ispeziona il reflog e conserva c3d4e5f nel branch rescue/catalog. Passa al branch recuperato e verifica che catalog.json contenga coffee.\n\n\nPassi nel laboratorio:\n\n1. Nel terminale, esegui:\n```bash\ngit reset --hard a1b2c3d\n```\n\n2. Nel terminale, esegui:\n```bash\ngit reflog\n```\n\n3. Nel terminale, esegui:\n```bash\ngit branch rescue/catalog c3d4e5f\n```\n\n4. Nel terminale, esegui:\n```bash\ngit switch rescue/catalog\n```\n\n5. Nel terminale, esegui:\n```bash\ncat catalog.json\n```\n\nRisultato atteso: il branch `rescue/catalog` esiste ed è selezionato; `catalog.json` contiene `coffee`; non ci sono modifiche da registrare.", "Simulate a hard reset to a1b2c3d, inspect reflog, and preserve c3d4e5f in branch rescue/catalog. Switch to the recovered branch and verify that catalog.json contains coffee.\n\n\nSteps in the laboratory:\n\n1. In the terminal, run:\n```bash\ngit reset --hard a1b2c3d\n```\n\n2. In the terminal, run:\n```bash\ngit reflog\n```\n\n3. In the terminal, run:\n```bash\ngit branch rescue/catalog c3d4e5f\n```\n\n4. In the terminal, run:\n```bash\ngit switch rescue/catalog\n```\n\n5. In the terminal, run:\n```bash\ncat catalog.json\n```\n\nExpected result: branch `rescue/catalog` exists and is selected; `catalog.json` contains `coffee`; there are no uncommitted changes."),
  hints: [t('Il commit c3d4e5f esiste ancora dopo il reset. git branch gli può dare un riferimento.', 'Commit c3d4e5f still exists after reset. git branch can give it a reference.')],
  seed: linear(),
  objectives: [{ type: 'flag', name: 'resetMode', value: 'hard' }, { type: 'branch', name: 'rescue/catalog', current: true }, { type: 'file', path: 'catalog.json', includes: 'coffee', tracked: true }, { type: 'clean' }],
  solution: [cmd(`git reset --hard ${ROOT}`), cmd('git reflog'), cmd(`git branch rescue/catalog ${FEATURE}`), cmd('git switch rescue/catalog'), cmd('cat catalog.json')],

  reference: refs(gitRef('reflog'), gitRef('gc'))
}), lesson({
  id: 'A06',
  title: t('Worktree e branch: oggetti diversi', 'Worktrees and branches: different objects'),
  summary: t('Apri due attività con cartelle di lavoro separate e oggetti condivisi.', 'Open two tasks with separate working directories and shared objects.'),
  concepts: [c('Un riferimento e una cartella di lavoro', 'A reference and a working directory', 'Un branch è un riferimento mobile a un commit. Una worktree è una cartella con propri file, index e HEAD collegata alla stessa repository. Gli oggetti e molti riferimenti sono condivisi. Puoi testare una hotfix mentre mantieni le modifiche non committate dell’attività principale.', 'A branch is a movable reference to a commit. A worktree is a directory with its own files, index, and HEAD linked to the same repository. Objects and many references are shared. You can test a hotfix while keeping uncommitted changes in the main task.'), c('Evitare scritture concorrenti sullo stesso branch', 'Avoid concurrent writes to one branch', 'Git normalmente impedisce che lo stesso branch sia attivo in due worktree. git worktree list mostra le associazioni; git worktree remove rimuove la cartella collegata, senza cancellare necessariamente il branch. Il simulatore rappresenta le cartelle come metadati e snapshot: non cambia directory fisica.', 'Git normally prevents the same branch being checked out in two worktrees. git worktree list shows associations; git worktree remove removes the linked directory without necessarily deleting the branch. The simulator represents directories as metadata and snapshots: it does not change a physical directory.')],
  task: t("Crea la worktree hotfix-worktree sul nuovo branch hotfix/catalog e verifica l’elenco.\n\n\nPassi nel laboratorio:\n\n1. Nel terminale, esegui:\n```bash\ngit worktree add -b hotfix/catalog hotfix-worktree main\n```\n\n2. Nel terminale, esegui:\n```bash\ngit worktree list\n```\n\nRisultato atteso: il branch `hotfix/catalog` esiste.", "Create worktree hotfix-worktree on new branch hotfix/catalog and inspect the list.\n\n\nSteps in the laboratory:\n\n1. In the terminal, run:\n```bash\ngit worktree add -b hotfix/catalog hotfix-worktree main\n```\n\n2. In the terminal, run:\n```bash\ngit worktree list\n```\n\nExpected result: branch `hotfix/catalog` exists."),
  hints: [t('git worktree add -b hotfix/catalog hotfix-worktree main', 'git worktree add -b hotfix/catalog hotfix-worktree main')],
  seed: seed(),
  objectives: [{
    type: 'worktree',
    path: 'hotfix-worktree'
  }, {
    type: 'branch',
    name: 'hotfix/catalog'
  }],
  solution: [cmd('git worktree add -b hotfix/catalog hotfix-worktree main'), cmd('git worktree list')],
  reference: refs(gitRef('worktree'))
}), lesson({
  id: 'A07',
  title: t('Hook locali e controlli condivisi', 'Local hooks and shared checks'),
  summary: t('Collega un controllo al commit senza confonderlo con una policy server.', 'Attach a check to committing without confusing it with server policy.'),
  concepts: [c('Quando vengono eseguiti', 'When hooks run', 'Git cerca gli hook nella directory hooks, normalmente .git/hooks, o nel percorso core.hooksPath. Un pre-commit eseguibile può fermare un commit con codice di uscita diverso da zero. Gli hook non vengono distribuiti automaticamente dal clone e dipendono dagli strumenti presenti sul computer.', 'Git looks for hooks in the hooks directory, normally .git/hooks, or the core.hooksPath location. An executable pre-commit can stop a commit with a nonzero exit code. Hooks are not automatically distributed by clone and depend on tools installed on the computer.'), c('La simulazione usa una whitelist', 'The simulation uses a whitelist', 'Qui sono ammessi soltanto hook dimostrativi con exit 0 o exit 1: nessun codice viene eseguito davvero. Un hook locale può essere saltato e non sostituisce required checks e policy sul server. Prima di usare hook provenienti da altri, leggine il codice e verifica la fonte.', 'Only demonstration hooks with exit 0 or exit 1 are supported here: no code is actually executed. A local hook can be bypassed and does not replace required checks and server policies. Before using hooks from others, read their code and verify the source.')],
  task: t("Crea un pre-commit dimostrativo con exit 0, rendilo eseguibile e registra README.md con “Hook checked”.\n\n\nPassi nel laboratorio:\n\n1. Nell’editor apri `.git/hooks/pre-commit` e sostituisci tutto il contenuto con:\n```\n#!/bin/sh\nexit 0\n```\n\n2. Nel terminale, esegui:\n```bash\nchmod +x .git/hooks/pre-commit\n```\n\n3. Nell’editor apri `README.md` e sostituisci tutto il contenuto con:\n```\n# Git Practice Lab\nHook checked\n```\n\n4. Nel terminale, esegui:\n```bash\ngit add README.md\n```\n\n5. Nel terminale, esegui:\n```bash\ngit commit -m \"Run local hook\"\n```\n\nRisultato atteso: la cronologia contiene un commit con messaggio `Run local hook`.", "Create a demonstration pre-commit with exit 0, make it executable, and commit README.md containing “Hook checked”.\n\n\nSteps in the laboratory:\n\n1. In the editor, open `.git/hooks/pre-commit` and replace its entire contents with:\n```\n#!/bin/sh\nexit 0\n```\n\n2. In the terminal, run:\n```bash\nchmod +x .git/hooks/pre-commit\n```\n\n3. In the editor, open `README.md` and replace its entire contents with:\n```\n# Git Practice Lab\nHook checked\n```\n\n4. In the terminal, run:\n```bash\ngit add README.md\n```\n\n5. In the terminal, run:\n```bash\ngit commit -m \"Run local hook\"\n```\n\nExpected result: history contains a commit with message `Run local hook`."),
  hints: [t('Gli hook restano fuori dallo staging dei file sorgente.', 'Hooks stay outside source-file staging.')],
  seed: seed(),
  objectives: [{
    type: 'hook',
    name: 'pre-commit'
  }, {
    type: 'flag',
    name: 'hookExecuted'
  }, {
    type: 'commit',
    messageIncludes: 'Run local hook'
  }],
  solution: [edit('.git/hooks/pre-commit', '#!/bin/sh\nexit 0\n'), cmd('chmod +x .git/hooks/pre-commit'), edit('README.md', '# Git Practice Lab\nHook checked\n'), cmd('git add README.md'), cmd('git commit -m "Run local hook"')],
  reference: refs(gitRef('hooks'), gitRef('config'))
}), lesson({
  id: 'A08',
  title: t('Dentro .git: oggetti, index e refs', 'Inside .git: objects, index, and refs'),
  summary: t("Ispeziona HEAD e gli oggetti, poi conserva lo snapshot con un riferimento Git.", "Inspect HEAD and its objects, then preserve the snapshot with a Git reference."),
  concepts: [c('I file di lavoro non sono la storia', 'Working files are not history', 'Nella working tree vedi i file correnti. L’index prepara il prossimo snapshot; gli oggetti conservano blob, tree e commit indirizzati dal contenuto. I branch sono riferimenti, HEAD indica il riferimento corrente o un commit direttamente. Compressione e packfile rendono inaffidabile cercare ogni file sorgente come file leggibile in .git/objects.', 'The working tree contains current files. The index prepares the next snapshot; objects store content-addressed blobs, trees, and commits. Branches are references, while HEAD points to a reference or directly to a commit. Compression and packfiles mean you cannot expect each source file to be readable in .git/objects.'), c('Usare i comandi di ispezione', 'Use inspection commands', 'git cat-file e git show leggono gli oggetti; git rev-parse --git-dir trova i metadati. In una linked worktree .git può essere un file che rimanda altrove, e i metadati comuni sono separati. Non correggere manualmente index o oggetti per recuperare il lavoro: usa i comandi Git e conserva prima una copia di sicurezza.', 'git cat-file and git show inspect objects; git rev-parse --git-dir locates metadata. In a linked worktree .git may be a file pointing elsewhere, and common metadata is separate. Do not manually patch index or objects to recover work: use Git commands and preserve a backup first.')],
  task: t("Leggi .git/HEAD e ispeziona tipo e contenuto del commit HEAD con cat-file. Crea inspect/catalog sul commit osservato e verifica che il riferimento esista senza cambiare la working tree.\n\n\nPassi nel laboratorio:\n\n1. Nel terminale, esegui:\n```bash\ncat .git/HEAD\n```\n\n2. Nel terminale, esegui:\n```bash\ngit cat-file -t HEAD\n```\n\n3. Nel terminale, esegui:\n```bash\ngit cat-file -p HEAD\n```\n\n4. Nel terminale, esegui:\n```bash\ngit branch inspect/catalog HEAD\n```\n\n5. Nel terminale, esegui:\n```bash\ngit branch\n```\n\nRisultato atteso: il branch `inspect/catalog` esiste; `catalog.json` contiene esattamente il testo mostrato sopra; non ci sono modifiche da registrare.", "Read .git/HEAD and inspect the type and contents of commit HEAD using cat-file. Create inspect/catalog at the inspected commit and verify the reference without changing the working tree.\n\n\nSteps in the laboratory:\n\n1. In the terminal, run:\n```bash\ncat .git/HEAD\n```\n\n2. In the terminal, run:\n```bash\ngit cat-file -t HEAD\n```\n\n3. In the terminal, run:\n```bash\ngit cat-file -p HEAD\n```\n\n4. In the terminal, run:\n```bash\ngit branch inspect/catalog HEAD\n```\n\n5. In the terminal, run:\n```bash\ngit branch\n```\n\nExpected result: branch `inspect/catalog` exists; `catalog.json` contains exactly the text shown above; there are no uncommitted changes."),
  hints: [t("Usa cat .git/HEAD, git cat-file -t HEAD e git cat-file -p HEAD.", "Use cat .git/HEAD, git cat-file -t HEAD, and git cat-file -p HEAD."), t("git branch inspect/catalog HEAD crea un riferimento senza cambiare branch. Non modificare manualmente i file sotto .git.", "git branch inspect/catalog HEAD creates a reference without switching branches. Do not manually edit files under .git.")],
  seed: seed(),
  objectives: [{ type: 'flag', name: 'internalsInspected', value: true }, { type: 'branch', name: 'inspect/catalog' }, { type: 'file', path: 'catalog.json', content: files['catalog.json'] }, { type: 'clean' }],
  solution: [cmd('cat .git/HEAD'), cmd('git cat-file -t HEAD'), cmd('git cat-file -p HEAD'), cmd('git branch inspect/catalog HEAD'), cmd('git branch')],

  reference: refs(gitRef('cat-file'), ['Git internals', 'https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain'])
}), lesson({
  id: 'A09',
  title: t('Claude e agenti nel cloud', 'Claude and cloud agents'),
  summary: t('Rivedi una modifica prodotta da un checkout remoto isolato.', 'Review a change produced from an isolated remote checkout.'),
  concepts: [c('Un ambiente separato dal computer', 'An environment separate from your computer', 'Quando un agente come Claude lavora nel cloud, usa un ambiente con un checkout della repository disponibile all’avvio e istruzioni del progetto. Non vede automaticamente file locali non committati, credenziali o modifiche non pubblicate. Rete, branch e permessi dipendono dalla configurazione del servizio: verifica la documentazione corrente.', 'When an agent such as Claude works in the cloud, it uses an environment with a repository checkout available at startup and project instructions. It does not automatically see local uncommitted files, credentials, or unpublished edits. Network access, branches, and permissions depend on service configuration: check current documentation.'), c('Rivedere il risultato come contributo', 'Review the result as a contribution', 'Controlla diff, commit, test e dipendenze prima di integrare. Un file AGENTS.md o CLAUDE.md aiuta a fornire contesto, ma non prova che il risultato sia corretto. La simulazione crea un branch agent/catalog: non chiama Claude, non usa token e non accede a un servizio AI.', 'Inspect diffs, commits, tests, and dependencies before integrating. An AGENTS.md or CLAUDE.md file helps provide context but does not prove correctness. This simulation creates an agent/catalog branch: it does not call Claude, use tokens, or access an AI service.')],
  task: t("Simula la modifica dell’agente a README.md su agent/catalog, poi apri e approva una PR verso main.\n\n\nPassi nel laboratorio:\n\n1. Nel portale simulato: agent-change. path: `README.md`; content: `# Git Practice Lab\nAgent-reviewed guide\n`; branch: `agent/catalog`.\n\n2. Nel portale simulato: Apri una pull request. branch di partenza: `agent/catalog`; branch di destinazione: `main`; titolo: `Review agent guide`.\n\n3. Nel portale simulato: Approva la pull request. numero della PR: `1`.\n\nRisultato atteso: la checklist conferma tutte le azioni richieste.", "Simulate an agent change to README.md on agent/catalog, then open and approve a PR to main.\n\n\nSteps in the laboratory:\n\n1. In the simulated portal: agent-change. path: `README.md`; content: `# Git Practice Lab\nAgent-reviewed guide\n`; branch: `agent/catalog`.\n\n2. In the simulated portal: Open a pull request. source branch: `agent/catalog`; target branch: `main`; title: `Review agent guide`.\n\n3. In the simulated portal: Approve the pull request. PR number: `1`.\n\nExpected result: the checklist confirms every required action."),
  hints: [t('Il portale crea il branch dell’agente. Le modifiche locali non salvate restano nella working tree corrente.', 'The portal creates the agent branch. Unsaved local changes remain in the current working tree.')],
  seed: seed(),
  objectives: [{
    type: 'flag',
    name: 'agentChanged'
  }, {
    type: 'platform',
    key: 'pullRequestOpen',
    value: true
  }, {
    type: 'platform',
    key: 'pullRequestApproved',
    value: true
  }],
  solution: [platform('agent-change', {
    path: 'README.md',
    content: '# Git Practice Lab\nAgent-reviewed guide\n',
    branch: 'agent/catalog'
  }), platform('open-pr', {
    source: 'agent/catalog',
    target: 'main',
    title: 'Review agent guide'
  }), platform('approve-pr', {
    id: '1'
  })],
  reference: refs(['Claude Code on the web', 'https://code.claude.com/docs/en/claude-code-on-the-web'])
}), lesson({
  id: 'A10',
  title: t('Risoluzioni riutilizzabili e rerere', 'Reusable resolutions and rerere'),
  summary: t('Abilita la memoria locale delle risoluzioni e controlla il risultato.', 'Enable local resolution reuse and inspect the result.'),
  concepts: [c('Registrare una risoluzione', 'Record a resolution', 'rerere significa reuse recorded resolution. Con rerere.enabled Git può ricordare come hai risolto un conflitto e proporre quella risoluzione quando riconosce un caso simile. È una memoria locale dei conflitti, non una comprensione del prodotto. Controlla sempre il contenuto risultante.', 'rerere means reuse recorded resolution. With rerere.enabled Git can remember how you resolved a conflict and propose that resolution when it recognizes a similar case. It is local conflict memory, not product understanding. Always inspect the resulting content.'), c('Automazione con revisione', 'Automation with review', 'La risoluzione automatica di modifiche indipendenti avviene già nel merge a tre vie. rerere aggiunge riuso delle tue risoluzioni precedenti; merge driver e attributi sono un altro meccanismo ancora. Evita di scegliere ours come soluzione universale: può eliminare modifiche valide. Nel laboratorio registra una prima risoluzione, poi ripeti il merge su un branch di prova. Il contenuto viene riutilizzato, ma devi ancora verificarlo e aggiungerlo allo staging.', 'Independent changes already merge automatically through three-way merging. rerere adds reuse of your previous resolutions; merge drivers and attributes are another mechanism. Avoid choosing ours universally: it can discard valid changes. In this lab record a first resolution, then repeat the merge on a trial branch. Contents are reused, but you must still inspect and stage them.')],
  task: t("Abilita rerere locale. Integra feature e risolvi README.md con “Reviewed and expanded catalog”, poi concludi il merge. Crea retry/merge da b2c3d4e, ripeti il merge di feature e verifica il riuso: aggiungi il file allo staging e concludi.\n\n\nPassi nel laboratorio:\n\n1. Nel terminale, esegui:\n```bash\ngit config --local rerere.enabled true\n```\n\n2. Nel terminale, esegui:\n```bash\ngit merge feature\n```\n\n3. Nell’editor apri `README.md` e sostituisci tutto il contenuto con:\n```\n# Git Practice Lab\nReviewed and expanded catalog\n```\n\n4. Nel terminale, esegui:\n```bash\ngit add README.md\n```\n\n5. Nel terminale, esegui:\n```bash\ngit commit -m \"Record reviewed resolution\"\n```\n\n6. Nel terminale, esegui:\n```bash\ngit switch -c retry/merge b2c3d4e\n```\n\n7. Nel terminale, esegui:\n```bash\ngit merge feature\n```\n\n8. Nel terminale, esegui:\n```bash\ngit add README.md\n```\n\n9. Nel terminale, esegui:\n```bash\ngit commit -m \"Apply reviewed resolution\"\n```\n\nRisultato atteso: `README.md` contiene `Reviewed and expanded catalog`; non ci sono modifiche da registrare.", "Enable local rerere. Merge feature and resolve README.md with “Reviewed and expanded catalog”, then finish the merge. Create retry/merge from b2c3d4e, repeat merging feature, and check reuse: stage the file and finish.\n\n\nSteps in the laboratory:\n\n1. In the terminal, run:\n```bash\ngit config --local rerere.enabled true\n```\n\n2. In the terminal, run:\n```bash\ngit merge feature\n```\n\n3. In the editor, open `README.md` and replace its entire contents with:\n```\n# Git Practice Lab\nReviewed and expanded catalog\n```\n\n4. In the terminal, run:\n```bash\ngit add README.md\n```\n\n5. In the terminal, run:\n```bash\ngit commit -m \"Record reviewed resolution\"\n```\n\n6. In the terminal, run:\n```bash\ngit switch -c retry/merge b2c3d4e\n```\n\n7. In the terminal, run:\n```bash\ngit merge feature\n```\n\n8. In the terminal, run:\n```bash\ngit add README.md\n```\n\n9. In the terminal, run:\n```bash\ngit commit -m \"Apply reviewed resolution\"\n```\n\nExpected result: `README.md` contains `Reviewed and expanded catalog`; there are no uncommitted changes."),
  hints: [t('git config --local rerere.enabled true precede il merge.', 'git config --local rerere.enabled true comes before merging.')],
  seed: diverged(true),
  objectives: [{
    type: 'flag',
    name: 'rerereApplied'
  }, {
    type: 'config',
    key: 'rerere.enabled',
    scope: 'local',
    value: 'true'
  }, {
    type: 'file',
    path: 'README.md',
    includes: 'Reviewed and expanded catalog'
  }, {
    type: 'history',
    parentCount: 2
  }, {
    type: 'clean'
  }],
  solution: [cmd('git config --local rerere.enabled true'), cmd('git merge feature'), edit('README.md', '# Git Practice Lab\nReviewed and expanded catalog\n'), cmd('git add README.md'), cmd('git commit -m "Record reviewed resolution"'), cmd('git switch -c retry/merge b2c3d4e'), cmd('git merge feature'), cmd('git add README.md'), cmd('git commit -m "Apply reviewed resolution"')],
  reference: refs(gitRef('rerere'))
}), lesson({
  id: 'A11',
  title: t('Strategie di branch e permessi', 'Branching strategies and permissions'),
  summary: t('Collega trunk-based development e Gitflow ai controlli applicati dal server.', 'Connect trunk-based development and Gitflow to server-enforced checks.'),
  concepts: [c('Scegliere per ritmo di integrazione', 'Choose for integration cadence', 'Trunk-based development privilegia integrazioni frequenti su una linea principale, con branch brevi e controlli rapidi. Gitflow distingue anche develop, release e hotfix e può adattarsi a cicli di rilascio separati, al costo di più integrazioni. GitHub flow usa branch brevi e PR sulla linea principale. Nessun modello rende superflui test e comunicazione.', 'Trunk-based development favors frequent integration into a main line with short-lived branches and fast checks. Gitflow also distinguishes develop, release, and hotfix and may suit separate release cycles at the cost of more integration. GitHub flow uses short-lived branches and PRs into the main line. No model removes the need for tests and communication.'), c('Policy e bypass', 'Policies and bypass', 'Su GitHub rulesets/protezioni e su Azure Repos branch policies configurano revisioni, build e restrizioni. Disponibilità e bypass dipendono da piano, permessi e tipo di repository. Qui il portale simula review obbligatoria e blocco push su main; non imposta policy reali e non riproduce tutti i permessi dei servizi.', 'GitHub rulesets/protections and Azure Repos branch policies configure reviews, builds, and restrictions. Availability and bypass depend on plan, permissions, and repository type. Here the portal simulates required review and blocked main pushes; it does not configure real policies or reproduce every service permission.')],
  task: t("Nel portale Azure DevOps abilita revisione obbligatoria e blocco push diretto. Crea hotfix/catalog-notes, registra README.md con “Hotfix reviewed”, pubblica il branch e integra la PR approvata “Review catalog hotfix” verso main. Torna a main.\n\n\nPassi nel laboratorio:\n\n1. Nel portale simulato: Seleziona la piattaforma. piattaforma: `azure`.\n\n2. Nel portale simulato: Imposta le regole di protezione. revisione obbligatoria: attivo; blocco del push diretto: attivo.\n\n3. Nel terminale, esegui:\n```bash\ngit switch -c hotfix/catalog-notes\n```\n\n4. Nell’editor apri `README.md` e sostituisci tutto il contenuto con:\n```\n# Git Practice Lab\nHotfix reviewed\n```\n\n5. Nel terminale, esegui:\n```bash\ngit add README.md\n```\n\n6. Nel terminale, esegui:\n```bash\ngit commit -m \"Prepare catalog hotfix\"\n```\n\n7. Nel terminale, esegui:\n```bash\ngit push -u origin hotfix/catalog-notes\n```\n\n8. Nel portale simulato: Apri una pull request. branch di partenza: `hotfix/catalog-notes`; branch di destinazione: `main`; titolo: `Review catalog hotfix`.\n\n9. Nel portale simulato: Approva la pull request. numero della PR: `1`.\n\n10. Nel portale simulato: Integra la pull request. numero della PR: `1`.\n\n11. Nel terminale, esegui:\n```bash\ngit switch main\n```\n\nRisultato atteso: il branch `main` esiste ed è selezionato; `README.md` contiene `Hotfix reviewed`; non ci sono modifiche da registrare.", "In the Azure DevOps portal require review and block direct pushes. Create hotfix/catalog-notes, commit README.md containing “Hotfix reviewed”, push the branch, and merge approved PR “Review catalog hotfix” into main. Return to main.\n\n\nSteps in the laboratory:\n\n1. In the simulated portal: Select platform. platform: `azure`.\n\n2. In the simulated portal: Set protection rules. required review: enabled; block direct pushes: enabled.\n\n3. In the terminal, run:\n```bash\ngit switch -c hotfix/catalog-notes\n```\n\n4. In the editor, open `README.md` and replace its entire contents with:\n```\n# Git Practice Lab\nHotfix reviewed\n```\n\n5. In the terminal, run:\n```bash\ngit add README.md\n```\n\n6. In the terminal, run:\n```bash\ngit commit -m \"Prepare catalog hotfix\"\n```\n\n7. In the terminal, run:\n```bash\ngit push -u origin hotfix/catalog-notes\n```\n\n8. In the simulated portal: Open a pull request. source branch: `hotfix/catalog-notes`; target branch: `main`; title: `Review catalog hotfix`.\n\n9. In the simulated portal: Approve the pull request. PR number: `1`.\n\n10. In the simulated portal: Merge the pull request. PR number: `1`.\n\n11. In the terminal, run:\n```bash\ngit switch main\n```\n\nExpected result: branch `main` exists and is selected; `README.md` contains `Hotfix reviewed`; there are no uncommitted changes."),
  hints: [t("Le protezioni si applicano a main: pubblica il branch hotfix, non un push diretto su main.", "Protections apply to main: publish the hotfix branch rather than pushing directly to main."), t("Il flusso termina con PR approvata e integrata; poi git switch main mostra il contenuto condiviso.", "The workflow ends with an approved and merged PR; git switch main then displays the shared contents.")],
  seed: seed(),
  objectives: [{ type: 'platform', key: 'provider', value: 'azure' }, { type: 'platform', key: 'reviewRequired', value: true }, { type: 'platform', key: 'blockDirectPush', value: true }, { type: 'platform', key: 'pullRequestApproved', value: true }, { type: 'platform', key: 'pullRequestMerged', value: true }, { type: 'branch', name: 'main', current: true }, { type: 'file', path: 'README.md', includes: 'Hotfix reviewed' }, { type: 'clean' }],
  solution: [platform('switch-provider', { provider: 'azure' }), platform('enable-policy', { reviewRequired: 'true', blockDirectPush: 'true' }), cmd('git switch -c hotfix/catalog-notes'), edit('README.md', '# Git Practice Lab\nHotfix reviewed\n'), cmd('git add README.md'), cmd('git commit -m "Prepare catalog hotfix"'), cmd('git push -u origin hotfix/catalog-notes'), platform('open-pr', { source: 'hotfix/catalog-notes', target: 'main', title: 'Review catalog hotfix' }), platform('approve-pr', { id: '1' }), platform('merge-pr', { id: '1' }), cmd('git switch main')],

  reference: refs(['Azure branch policies', 'https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies?view=azure-devops'], ['GitHub rulesets', 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets'])
}), lesson({
  id: 'A12',
  title: t('Prova avanzata: recuperare un rilascio', 'Advanced challenge: recover a release'),
  summary: t('Conserva la storia, prepara un ambiente parallelo e pubblica una correzione tracciabile.', 'Preserve history, prepare a parallel workspace, and publish a traceable correction.'),
  concepts: [c('Prima diagnosticare, poi correggere', 'Diagnose before correcting', 'Il rilascio ha integrato una voce di catalogo da ritirare. La storia è già condivisa: crea un revert del merge anziché spostare main con reset. Ispeziona il primo parent per conservare la correzione al README. Una worktree permette attività parallela senza scartare l’ambiente corrente.', 'The release integrated a catalog item that must be withdrawn. History is already shared: revert the merge rather than resetting main. Inspect the first parent to preserve the README correction. A worktree allows parallel work without discarding the current environment.'), c('Un tag non rende il software corretto', 'A tag does not make software correct', 'Dopo il recupero verifica il contenuto e i controlli del progetto, crea un nuovo tag e una release con note chiare. Non spostare un tag già pubblicato per nascondere il problema: chi lo ha scaricato potrebbe avere un contenuto differente. Nel laboratorio non vengono compilati artefatti né contattati servizi reali.', 'After recovery verify contents and project checks, create a new tag and a release with clear notes. Do not move an already published tag to hide the issue: someone who downloaded it might have different contents. This lab does not build artifacts or contact real services.')],
  task: t("Crea hotfix-worktree con branch hotfix/recovery, annulla il merge su main conservando il primo parent, crea e pubblica v1.0.1 e la release “Catalog recovery”.\n\n\nPassi nel laboratorio:\n\n1. Nel terminale, esegui:\n```bash\ngit worktree add -b hotfix/recovery hotfix-worktree main\n```\n\n2. Nel terminale, esegui:\n```bash\ngit revert -m 1 HEAD\n```\n\n3. Nel terminale, esegui:\n```bash\ngit tag -a v1.0.1 -m \"Recover catalog\"\n```\n\n4. Nel terminale, esegui:\n```bash\ngit push origin v1.0.1\n```\n\n5. Nel portale simulato: Pubblica una release. tag: `v1.0.1`; titolo: `Catalog recovery`.\n\nRisultato atteso: `catalog.json` contiene esattamente il testo mostrato sopra; il tag `v1.0.1` esiste; non ci sono modifiche da registrare.", "Create hotfix-worktree on branch hotfix/recovery, revert the main merge preserving its first parent, create and push v1.0.1, and publish release “Catalog recovery”.\n\n\nSteps in the laboratory:\n\n1. In the terminal, run:\n```bash\ngit worktree add -b hotfix/recovery hotfix-worktree main\n```\n\n2. In the terminal, run:\n```bash\ngit revert -m 1 HEAD\n```\n\n3. In the terminal, run:\n```bash\ngit tag -a v1.0.1 -m \"Recover catalog\"\n```\n\n4. In the terminal, run:\n```bash\ngit push origin v1.0.1\n```\n\n5. In the simulated portal: Publish a release. tag: `v1.0.1`; title: `Catalog recovery`.\n\nExpected result: `catalog.json` contains exactly the text shown above; tag `v1.0.1` exists; there are no uncommitted changes."),
  hints: [t('Mantieni main attivo per il revert; la worktree è un ambiente parallelo.', 'Keep main active for the revert; the worktree is a parallel environment.')],
  seed: mergedSeed,
  objectives: [{
    type: 'worktree',
    path: 'hotfix-worktree'
  }, {
    type: 'flag',
    name: 'mergeReverted'
  }, {
    type: 'file',
    path: 'catalog.json',
    content: files['catalog.json']
  }, {
    type: 'tag',
    name: 'v1.0.1'
  }, {
    type: 'flag',
    name: 'tagsPushed'
  }, {
    type: 'platform',
    key: 'releasePublished',
    value: true
  }, {
    type: 'clean'
  }],
  solution: [cmd('git worktree add -b hotfix/recovery hotfix-worktree main'), cmd('git revert -m 1 HEAD'), cmd('git tag -a v1.0.1 -m "Recover catalog"'), cmd('git push origin v1.0.1'), platform('create-release', {
    tag: 'v1.0.1',
    title: 'Catalog recovery'
  })],
  reference: refs(gitRef('revert'), gitRef('worktree'), gitRef('tag')),
  estimatedMinutes: 35
})];
