# Proposed curriculum

Approved analysis curriculum. The implemented catalog and verified solutions are
in `packages/course-content/src/`; this document retains the initial map. Complete
Italian and English are required at launch: every module, OS guide, hint and
message must be available in both languages.
Each module alternates explanation, prediction, action and verification.
The narrative repository is a portal with a README, JSON catalog, YAML
configuration and HTML page: exercises require no application-development knowledge.
Checks evaluate objectives and state, accepting correct equivalent sequences.

## Base

| ID | Topics and scenario | Success evidence |
| --- | --- | --- |
| B01 | What Git is, its purpose, distributed model and history since 2005; reconstruct catalog versions | distinguish snapshots, working files, Git and platforms |
| B02 | Common installation methods on Windows/Linux/macOS 26+ | interpret version, executable path and update channel |
| B03 | System/global/local configuration and file precedence | correct identity and value origins shown with `--show-origin --show-scope` |
| B04 | HTTPS and VS Code cloning | correct content, history and `origin`; recognize that VS Code is not a protocol |
| B05 | SSH keys with a passphrase and `.ssh/config` | correct host alias, hostname, user and IdentityFile; only the public key is shared |
| B06 | SSH agent and SSH cloning on all three systems | correct identity shown by `ssh-add -l` and a consistent remote |
| B07 | Working tree, staging, status, diff and selective commits | only the requested fix is committed; other work is preserved |
| B08 | HEAD, commits and branching | correct references; HEAD normally points symbolically to the active branch |
| B09 | `switch` and introduction to `checkout` | switch activities while preserving local work or explaining why switching is blocked |
| B10 | `fetch`, `pull`, `push` | distinguish remote-tracking updates, integration and publishing |
| B11 | `.gitignore` | correct exclusions; understand why an already tracked file remains tracked |
| B12 | Final challenge: publish an isolated change | correct identity, branch, content, remote and final state |

## Intermediate

| ID | Topics and scenario | Success evidence |
| --- | --- | --- |
| M01 | `checkout`, `switch`, `restore`, detached HEAD | inspect an old commit and retain any new work with a reference |
| M02 | `revert`, `reset --soft/--mixed/--hard`, path reset | distinguish a new commit, reference movement and effects on the index/working tree |
| M03 | Merge, fast-forward and merge commits | correct parents and graph; fast-forward without a new merge commit |
| M04 | Automatic integration of independent changes | both intentions preserved; absence of conflict markers does not prove functional correctness |
| M05 | Manual conflict resolution | resolved content, removed markers, staging and correct completion or abort |
| M06 | Merge, squash and rebase in the same scenario | compare content, parents and new identifiers |
| M07 | GitHub and Azure DevOps PRs with review | correct source/target, description, checks and discussions |
| M08 | Remotes and GitHub forks | `origin` points to the fork and `upstream` to the original; distinguish clone/fork/branch |
| M09 | Branching models: trunk-based, GitHub flow and release branches | choose based on release frequency and maintained versions |
| M10 | Azure policies, protected branches and GitHub rulesets | prohibited push rejected; incomplete PR blocked; compliant PR accepted |
| M11 | Annotated tags and GitHub releases | correct commit, published tag and release with consistent notes |
| M12 | Final challenge: collaboration, conflict and release through a PR | no lost changes; content and rules respected |

## Advanced

| ID | Topics and scenario | Success evidence |
| --- | --- | --- |
| A01 | Interactive rebase: pick, reword, squash, fixup, reorder, drop | reviewable local history with correct final content |
| A02 | Reflog and recovery after reset/rebase | create a recovery reference without losing other work |
| A03 | Rollback by reverting a merge | inspect parents, justify the mainline and create a reviewable revert |
| A04 | `.gitattributes`, line endings, binaries and merge drivers | normalization kept separate from functional changes |
| A05 | `rerere` and limits of automatic resolution | inspect, accept or discard reused resolutions |
| A06 | Worktrees versus branches | two directories with their own HEAD/index and shared objects; activities preserved |
| A07 | Where Git stores files and metadata | distinguish working tree, index, blob, tree, commit, refs, HEAD, reflog and packfiles |
| A08 | Git hooks and server checks | local check works; bypass and lack of automatic distribution are understood |
| A09 | SSH for multiple accounts and agent diagnosis | correct host alias, `IdentitiesOnly`, SSH executable and key |
| A10 | Claude working on code in the cloud | distinguish remote clone, branch, changes, commit, push and human review |
| A11 | Advanced GitHub/Azure governance | verify permissions, bypass, automation, hotfixes and releases |
| A12 | Final challenge: regression during a release | worktree, recovery, rollback and a compliant PR preserve the work |

## Installation and SSH by system

| System | Methods to compare | Configuration and agent |
| --- | --- | --- |
| Windows | Git for Windows, `winget install --id Git.Git -e --source winget`; WSL as a separate Linux environment; optional Scoop/Chocolatey | Windows OpenSSH in `%USERPROFILE%\.ssh\config`; Git Bash and a session agent versus the `ssh-agent` service; administrative commands labeled PowerShell |
| Linux | APT on Debian/Ubuntu, DNF on Fedora; building from source as further study | `~/.ssh/config`, permissions; `eval "$(ssh-agent -s)"` and `ssh-add`; distinguish shell session and desktop integration |
| macOS 26+ | Xcode Command Line Tools, Homebrew, MacPorts; compare executables and PATH | built-in agent, `AddKeysToAgent`, `UseKeychain`, `/usr/bin/ssh-add --apple-use-keychain`; distinguish Apple tools and other OpenSSH distributions |

Do not recommend the old macOS installer as a maintained option. Always identify
the `git` and `ssh` executables actually used, especially with WSL, Git Bash or
multiple package managers. Real-machine guides are optional and never ask users
to upload private keys or passphrases to the site.

GitHub recommends Ed25519; current Azure Repos documentation specifies RSA with
RSA-SHA2 negotiation. Teach separate key pairs/configurations or the compatible
RSA option. Do not re-enable SHA-1 as a general fix for SSH errors.

## Conceptual errors to prevent

- `git add` snapshots a file at that moment: later edits do not update the index.
- HEAD is not always the latest commit across the entire repository.
- Pull integrates after fetch according to options and configuration; it is not always a merge.
- Path reset does not move the branch; reset modes have different effects.
- Rebase recreates commits; shared history requires coordination and justified use of `--force-with-lease`.
- `git revert -m 1` requires checking the mainline parent; reintroducing a reverted feature requires an explicit strategy.
- `-X ours` and the `ours` strategy differ; ours/theirs during rebase needs contextual explanation.
- Reflog is local and expires; it does not automatically recover files that were never recorded.
- `.git` may be a directory or a linking file; worktrees share some metadata.
- PRs, forks and releases belong to the platform. Remote names `origin` and `upstream` are conventions.
- Cloud agents do not automatically see the local computer and do not necessarily use worktrees.

## Assessment and updates

Estimated durations to validate in the pilot: Base 3–4 hours, Intermediate 4–5,
Advanced 5–6, divided into short sessions. These are neither promises nor measured data.
Every module must specify its seed, objectives, available actions, evidence and feedback.
Scoring and time remained open decisions at this analysis stage; no implicit
penalties for reading, accessibility or a correct alternative solution.
Platform sources and screenshots will carry a review date and course version.

## Primary sources

- [Git Windows](https://git-scm.com/install/win) and [Git macOS](https://git-scm.com/install/mac)
- [GitHub SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [Azure Repos SSH](https://learn.microsoft.com/en-us/azure/devops/repos/git/use-ssh-keys-to-authenticate?view=azure-devops)
- [Git revert](https://git-scm.com/docs/git-revert), [worktree](https://git-scm.com/docs/git-worktree), [repository layout](https://git-scm.com/docs/gitrepository-layout)
- [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)
