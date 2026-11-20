# Changelog

User-visible and operationally material changes. Generate entries from the agreed release process
rather than editing several version sources by hand. Format: [Keep a Changelog](https://keepachangelog.com), [SemVer](https://semver.org).

## [Unreleased]

### Added
- A skippable, restartable interface tour and persistent Light/Dark/System appearance preferences.
- Sequential practical lessons with concepts above the lab, explicit previous/next navigation, and device-local practice completion.
- Local IT/EN React/Vite application: 36 modules, a simulated Git terminal, DAG,
  editor and GitHub/Azure DevOps portal in accessible, stackable windows.
- Zustand/Zundo state, IndexedDB drafts and final submissions with retries and idempotency.
- Fetch/SQLite API, Worker/D1 entrypoint, configurable GitHub OAuth and a mock
  development provider, permanent progress and an opt-in leaderboard.
- Transparent SVG logo for light/dark themes, icons, IT/EN social cards and self-hosted fonts.
- Catalog, engine and API tests, browser flows, and SEO/accessibility/copy reports.
- Preliminary Git course analysis: proposed architecture, three-level curriculum,
  design, verification criteria, GTM intake and open decisions.
- Inventory of local skills and consulted upstream sources.
- Confirmed market map, IT/EN positioning and demand plan; roadmap, consolidated GTM Plan and local scope approved after QA, with persistent journey state.

### Changed
- Learner-facing levels are presented as three courses: Git foundations, Git collaboration, and Advanced Git and recovery.
- Replaced sidebar quizzes with observable lab exercises; the API enforces preceding-lesson completion at start and submission.
- Course cards scroll to their lesson lists, and the main timer is labelled Elapsed time.
- Developer documentation and GTM HTML companions now use English; contributor and agent instructions require English PR metadata, comments, identifiers and commit messages. Learner content remains IT/EN.
- Documentation and agent instructions dedicated exclusively to the independent public course.
- Updated requirements: zero service costs, complete IT/EN content at launch, stackable windows and browser-estimated study pauses.
- Developer documentation, code comments, identifiers, pull requests and commits must use English; learner-facing content remains fully IT/EN.

### Removed
- 88 unused skill directories, two Wrangler symlinks and the root SKILL.md template,
  at the user's request. The analysis lists the removed skills and explains which skills were retained.

### Window clarity and beginner introduction
- Add window shadows, active/background distinction and animated layout changes with reduced-motion support.
- Align desktop header controls and render technical lesson fragments in monospace.
- Explain Git fundamentals in Italian and English for learners without programming experience; record the audience review in `docs/analysis/beginner-audience-copy.md`.
