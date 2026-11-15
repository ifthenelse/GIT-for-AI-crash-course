import type {Locale} from '../../contracts/src/index.ts';
const english:Record<string,string>={
 'Pro Git: storia':'Pro Git: a short history',
 'Pro Git: che cos’è Git':'Pro Git: what is Git?',
 'Installazione ufficiale':'Official installation',
 'Git su MacPorts':'Git on MacPorts',
 'Setup iniziale':'First-time setup',
 'Chiavi GitHub':'GitHub SSH keys',
 'SSH Azure Repos':'Azure Repos SSH',
 'Agente GitHub':'GitHub SSH agent',
 'SSH Azure':'Azure SSH',
 'Conflitti GitHub':'GitHub merge conflicts',
 'Pull request GitHub':'GitHub pull requests',
 'Pull request Azure':'Azure pull requests',
 'Fork GitHub':'GitHub forks',
 'Strategia branch Azure':'Azure branching strategy',
 'Rulesets GitHub':'GitHub rulesets',
 'Branch policy Azure':'Azure branch policies',
 'Release GitHub':'GitHub releases',
};
export const referenceLabel=(label:string,locale:Locale)=>locale==='en'?english[label]??label:label;
