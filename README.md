# Git Practice Lab

Collaborate with Git knowing what changes and how to recover your work.

An independent public course for engineers, architects and business professionals with practical technical experience. The lab simulates a repository through a Bash terminal, commit graph, editor and GitHub/Azure DevOps portal. It includes 36 modules in Italian and English across Beginner, Intermediate and Advanced levels.

Local implementation was approved on 15 November 2026. Publishing and configuring live services are separate steps: starting the project does not create cloud resources or OAuth registrations.

## Local setup

You need Node.js 24.15+ from the 24.x release line or Node.js 26+, npm and Git. The version specified in `.node-version` is 26. Local checks use Node.js 24.22.1; CI has also passed on Node.js 26.

```bash
npm ci
cp .env.example .env
npm run dev:api
```

In a second terminal:

```bash
npm run dev
```

Open `http://127.0.0.1:5173`. The **local development** provider lets you try saving progress without external credentials. It uses a mock identity available only in the development server. Data is stored in `.tmp/progress.sqlite`; the application token stays in memory, so you must sign in again after a refresh. The same test identity retrieves previously confirmed progress.

The simulator runs only the command subset covered by the course. Guides for installing Git and configuring SSH on your computer are separate from the browser exercises.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite frontend with a proxy to the local API |
| `npm run dev:api` | local API and persistent SQLite storage |
| `scripts/verify` | type checking and automated tests |
| `npm run build` | static build and prerendered public IT/EN pages |
| `npm run preview` | preview the build |
| `node scripts/render-gtm-docs.mjs` | regenerate the English HTML GTM documents from canonical Markdown |
| `npm run test:e2e` | browser flows and axe checks; uses system Chromium when available |

For a Pages build, explicitly set `PUBLIC_BASE_PATH` and `SITE_URL`; use `VITE_API_URL` for the public API URL. Local builds are intentionally `noindex`. See [docs/deployment.md](docs/deployment.md) for details and release conditions.

## Structure

- `apps/web`: React, Vite, i18next, Zustand and Zundo; windows and local persistence.
- `packages/git-engine`: deterministic engine shared by the browser and validator.
- `packages/course-content`: scenarios, objectives, solutions and IT/EN text.
- `packages/contracts`: shared versioned contracts.
- `services/progress-api`: authentication, replay, permanent progress and an opt-in leaderboard.
- `gtm-plan`: approved product plan and roadmap.

Undo and reset affect the scenario. Server-confirmed completions remain recorded. Official durations use the server-recorded start; pauses estimated from visibility and focus are shown separately.

## Documentation

[Architecture](docs/architecture.md), [tests and verification limits](docs/testing.md), [analysis and decisions](docs/analysis/README.md), [security](SECURITY.md), [contributing](CONTRIBUTING.md) and [agent instructions](AGENTS.md).

Service costs must remain zero. The frontend is prepared for GitHub Pages, and the API includes an adapter for the proposed public runtime. Live OAuth, free-tier quotas, deployment and recovery require verification in the configured environment before launch.

Learner-facing UI and course material remain fully bilingual. Product promise examples:

- **IT:** «Collabora con Git sapendo cosa cambia e come recuperare il lavoro.»
- **EN:** “Collaborate with Git knowing what changes and how to recover your work.”
