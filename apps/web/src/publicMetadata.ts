import { lessons } from '../../../packages/course-content/src/index.ts';

export const productName = 'Git by doing';
export const publicOrigin = 'https://gitbydoing.com/';
export const publicKinds = ['', 'program/', 'tier/base/', 'tier/intermediate/', 'tier/advanced/'] as const;
export type PublicKind = typeof publicKinds[number];
export type PublicLocale = 'it' | 'en';
export const publicCopy = {
  it: { title: productName, course: 'Programma del corso Git', base: 'Git: le basi', intermediate: 'Collaborare con Git', advanced: 'Git avanzato e recupero', description: 'Impara Git con 36 lezioni ed esercizi interattivi in italiano: commit, branch, pull request e recupero, con scenari GitHub e Azure DevOps simulati.', intro: 'Collabora con Git sapendo cosa cambia e come recuperare il lavoro.', open: 'Apri il laboratorio', program: 'Esplora il programma', home: 'Home', lang: 'English' },
  en: { title: productName, course: 'Git course curriculum', base: 'Git foundations', intermediate: 'Git collaboration', advanced: 'Advanced Git and recovery', description: 'Learn Git with 36 lessons and interactive exercises in English: commits, branches, pull requests and recovery in simulated GitHub and Azure DevOps workflows.', intro: 'Collaborate with Git knowing what changes and how to recover your work.', open: 'Open the lab', program: 'Explore the curriculum', home: 'Home', lang: 'Italiano' }
};
export function getPublicMetadata(locale: PublicLocale, kind: PublicKind) {
  const t = publicCopy[locale];
  const tier = kind.startsWith('tier/') ? kind.split('/')[1] as 'base' | 'intermediate' | 'advanced' : null;
  const selected = tier ? lessons.filter(lesson => lesson.tier === tier) : lessons;
  const heading = tier ? t[tier] : kind ? t.course : locale === 'it' ? 'Impara Git con esercizi interattivi' : 'Learn Git with interactive exercises';
  const title = `${heading} · ${productName}`;
  const tierDescriptions = {
    it: { base: 'Impara le basi di Git: repository, staging, commit, cronologia e configurazione. 12 lezioni con esercizi simulati nel browser e guide per il tuo computer.', intermediate: 'Esercitati con branch, merge, pull request, policy e conflitti Git. 12 lezioni sulla collaborazione con scenari GitHub e Azure DevOps simulati.', advanced: 'Approfondisci rebase, reflog, recupero dei commit, worktree e hook Git. 12 lezioni per osservare gli effetti delle modifiche alla storia condivisa.' },
    en: { base: 'Learn Git foundations: repositories, staging, commits, history and setup. 12 lessons with simulated browser exercises and guides for your own computer.', intermediate: 'Practise Git branches, merges, pull requests, policies and conflicts. 12 collaboration lessons with simulated GitHub and Azure DevOps workflows.', advanced: 'Explore Git rebase, reflog, commit recovery, worktrees and hooks. 12 lessons to understand the effects of changes to shared repository history.' }
  };
  const description = tier ? tierDescriptions[locale][tier] : kind ? locale === 'it' ? 'Esplora il programma di Git by doing: 36 lezioni in tre corsi su basi Git, collaborazione e recupero. Spiegazioni ed esercizi interattivi in italiano.' : 'Explore the Git by doing curriculum: 36 lessons across Git foundations, collaboration and recovery, with explanations and interactive exercises in English.' : t.description;
  return { title, heading, description, selected, tier };
}
