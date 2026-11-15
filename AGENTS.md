# GIT-for-AI-crash-course: instructions for AI coding agents

## Scope
- This file is the canonical contract for coding agents (Claude Code, Codex, Copilot, Aider).
  Tool adapters (`CLAUDE.md`, `.github/copilot-instructions.md`) only point here.
- Purpose and non-goals: `intent.md`. Architecture: `docs/architecture.md`. Decisions: `docs/adr/`.

## Stack and current phase
- Local implementation approved by the user on 2026-11-15, following docs/analysis/implementation-proposal.md. The user authorized commits, pushing feature branches and opening pull requests on 2026-11-15. Public account setup, secrets, infrastructure, publishing and merging remain separate actions.
- Frontend: React, Vite, TypeScript, Zustand, Zundo, i18next. Use the approved dependency candidates and generated lockfile.
- Product context and unresolved decisions: `docs/analysis/README.md` and `docs/analysis/decision-tree.md`.
- This repository is exclusively for the public, independent course. Do not introduce company-specific references, private deployment profiles or corporate infrastructure plans.
- Hard constraints: zero service cost, complete Italian and English content at launch, GitHub Pages frontend and phased social providers that fit the free setup.
- The window manager must support accessible stacking, arranging, minimizing and maximizing across viewports. Page visibility and focus telemetry only estimate study pauses and must not alter server elapsed time or penalize window switching.
- Retained local skills and consulted upstream skills: `docs/analysis/skills.md`.
- Do not describe a proposed design, an unconfirmed GTM step or an unrun audit as completed implementation.
- Zundo history must never undo server-confirmed completions. Git simulation must not execute arbitrary shell commands.

## Commands
- Verify everything: `scripts/verify`

## Verification
- Run `scripts/verify` before handing work back; it must pass. CI runs the same command and is the authoritative gate.
- Add or update tests for behaviour you change. Live or state-changing tests must be opt-in.

## Constraints
- Commit messages follow Conventional Commits (see `.gitmessage.txt`). Keep changes small and focused.
- Do not reformat unrelated code. Do not edit generated files, lockfiles by hand, or the single version source.
- Never commit secrets or `.env` files. `.env.example` holds names and safe placeholders only.

## Approval boundaries
Ask the user before: adding or upgrading a dependency, changing CI/CD or infrastructure, changing a data
schema or public contract, deleting files, touching secrets or credentials, pushing or opening a PR.

## Hand-off
Summarise what changed and why, which checks you ran with their result, and any open risk or follow-up.
