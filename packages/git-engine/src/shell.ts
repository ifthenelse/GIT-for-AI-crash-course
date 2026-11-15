import type { RepositoryState } from '../../contracts/src/index.ts';
import { checkedTree, clone, getHeadCommit, hash, isIgnored, resolve } from './model.ts';
import { filePath, tokenize } from './parser.ts';
import { gitCommand } from './git.ts';

export const HELP = `Simulated Bash/Git subset — no system commands, network or subprocesses are executed.
git init/clone/config/status/add/commit/diff/log/branch/switch/checkout/restore
git fetch/pull/push/remote/reset/revert/merge/rebase/tag/reflog/worktree
git show/rev-parse/ls-files/check-ignore/check-attr/rm/cat-file
pwd, ls, cat, echo [-n] text [> or >> file], touch, rm, chmod +x, code --clone
ssh-keygen, ssh-agent, ssh-add, ssh -T; simulated installation via winget/brew/apt/dnf/xcode-select.
Unsupported arguments return an explicit error. Edit files with the editor; use .git/rebase-todo for interactive rebase.`;

export function editFile(state: RepositoryState, input: string, content: string): string {
  const path = filePath(input);
  if (path.startsWith('.git/') && !/^\.git\/(hooks\/[\w-]+|rebase-todo|rebase-message)$/.test(path)) throw new Error('Git internals are read-only. Use Git commands to change them.');
  state.files[path] = content; checkedTree(state.files);
  if (path === '.ssh/config') state.flags.sshConfig = /^\s*Host\s+\S+/m.test(content) && /^\s*IdentityFile\s+\S+/m.test(content);
  return `Saved ${path} in the simulated filesystem.`;
}
function virtualFile(state: RepositoryState, path: string): string | undefined {
  if (path === '.git/HEAD') return state.head.kind === 'branch' ? `ref: refs/heads/${state.head.name}\n` : `${state.head.commit}\n`;
  if (path === '.git/config') return Object.entries(state.config.local).map(([k, v]) => `${k}=${v}`).join('\n');
  if (path === '.git/config.worktree') return Object.entries(state.config.worktree).map(([k, v]) => `${k}=${v}`).join('\n');
  if (path === '.git/index') return `[simulated binary index — readable teaching view]\n${Object.keys(state.index).sort().join('\n')}`;
  if (path === '.git/logs/HEAD') return state.reflog.map(r => `${r.commit} ${r.message}`).join('\n');
  if (path.startsWith('.git/refs/heads/')) return state.branches[path.slice('.git/refs/heads/'.length)];
  if (path.startsWith('.git/refs/tags/')) return state.tags[path.slice('.git/refs/tags/'.length)];
  if (path === '.git/MERGE_HEAD') return state.operation?.kind === 'merge' ? state.operation.target : undefined;
  return undefined;
}
function catObject(state: RepositoryState, args: string[]): string {
  const mode = args[0], ref = args[1];
  if (!['-p', '-t'].includes(mode) || !ref || args.length !== 2) throw new Error('Usage: git cat-file -p|-t <commit or blob reference>.');
  const separator = ref.indexOf(':');
  if (separator >= 0) { const commit = resolve(state, ref.slice(0, separator)), path = filePath(ref.slice(separator + 1)); if (!(path in commit.tree)) throw new Error('Blob path does not exist.'); state.flags.internalsInspected = true; return mode === '-t' ? 'blob' : commit.tree[path]; }
  const commit = resolve(state, ref); state.flags.internalsInspected = true;
  return mode === '-t' ? 'commit' : `tree ${hash(JSON.stringify(commit.tree))}\n${commit.parents.map(p => `parent ${p}\n`).join('')}\n${commit.message}\n`;
}
function install(state: RepositoryState, words: string[]): string | undefined {
  const cmd = words[0] === 'sudo' ? words.slice(1) : words;
  const supported =
    cmd[0] === 'winget' && cmd[1] === 'install' && (cmd.includes('Git.Git')) && cmd.every((x, i) => i < 2 || ['--id', 'Git.Git', '-e', '--source', 'winget'].includes(x)) ||
    cmd[0] === 'brew' && cmd.length === 3 && cmd[1] === 'install' && cmd[2] === 'git' ||
    ['apt', 'apt-get', 'dnf'].includes(cmd[0]) && cmd[1] === 'install' && cmd.includes('git') && cmd.every((x, i) => i < 2 || ['git', '-y'].includes(x)) ||
    cmd[0] === 'xcode-select' && cmd[1] === '--install' && cmd.length === 2 ||
    cmd[0] === 'port' && cmd[1] === 'install' && cmd[2] === 'git' && cmd.length === 3;
  if (!supported) return undefined;
  state.flags.gitInstalled = true; state.flags.installMethod = cmd[0];
  return `Installation simulated using ${cmd[0]}. Nothing was installed on your computer. Verify a real installation separately with git --version.`;
}
function sshCommand(state: RepositoryState, words: string[]): string {
  const [command, ...args] = words;
  if (command === 'ssh-agent') {
    if (args.some(arg => arg !== '-s')) throw new Error('Supported: ssh-agent [-s].');
    state.flags.sshAgent = true; return 'SSH agent started in the simulated session. No system process was started.';
  }
  if (command === 'ssh-keygen') {
    let type = 'ed25519', path = '', bits = 3072, passphrase: string | undefined;
    for (let i = 0; i < args.length; i++) {
      if (!['-t', '-f', '-b', '-N', '-C'].includes(args[i]) || args[i + 1] === undefined) throw new Error('Supported: ssh-keygen -t ed25519|rsa -f <path> -N "fictional passphrase" [-b 3072] [-C label].');
      const option = args[i], value = args[++i];
      if (option === '-t') type = value; if (option === '-f') path = filePath(value); if (option === '-b') bits = Number(value); if (option === '-N') passphrase = value;
    }
    if (!['ed25519', 'rsa'].includes(type)) throw new Error('This course models Ed25519 for GitHub and RSA for Azure Repos.');
    if (type === 'rsa' && (!Number.isInteger(bits) || bits < 3072 || bits > 8192)) throw new Error('Use an RSA size between 3072 and 8192 bits.');
    path ||= `.ssh/id_${type}`;
    if (!path.startsWith('.ssh/')) throw new Error('Store simulated keys inside .ssh/.');
    if (state.files[path]) throw new Error('Key file already exists; it will not be overwritten.');
    if (!passphrase) throw new Error('Supply a fictional non-empty passphrase using -N. Never enter a real secret in this training simulator.');
    state.files[path] = `SIMULATED PRIVATE KEY — ${type}; not a cryptographic key\n`;
    state.files[path + '.pub'] = `SIMULATED PUBLIC KEY — ${type}; not usable for authentication\n`;
    state.flags[`sshKeyType:${path}`] = type; state.flags[`sshPassphrase:${path}`] = true; state.flags.sshKeyGenerated = true;
    return `Created fictional ${type} key pair at ${path}. The provided fictional passphrase is not stored. This key cannot authenticate to any service.`;
  }
  if (command === 'ssh-add') {
    if (!state.flags.sshAgent) throw new Error('Start the simulated SSH agent first: ssh-agent -s.');
    if (args[0] === '-l' && args.length === 1) return state.flags.sshKeyAdded ? `Identity loaded: ${String(state.flags.sshIdentity)}` : 'The agent has no identities.';
    const keychain = args[0] === '--apple-use-keychain'; const value = args[keychain ? 1 : 0];
    if (!value || args.length !== (keychain ? 2 : 1)) throw new Error('Usage: ssh-add [--apple-use-keychain] <simulated-private-key-path>');
    const path = filePath(value);
    if (!path.startsWith('.ssh/') || !state.files[path] || path.endsWith('.pub') || path.endsWith('/config')) throw new Error('Choose an existing simulated private key, not a public key.');
    state.flags.sshKeyAdded = true; state.flags.sshIdentity = path; if (keychain) state.flags.sshKeychain = true;
    return 'Identity added to the simulated agent. No system credential was changed.';
  }
  if (command === 'ssh') {
    if (args.length !== 2 || args[0] !== '-T' || !/^(git@)?[\w.-]+$/.test(args[1])) throw new Error('Supported: ssh -T git@github.com or ssh -T <configured-host-alias>.');
    if (!state.flags.sshKeyAdded) throw new Error('Add a simulated key to the SSH agent first.');
    const host = args[1].replace(/^git@/, '');
    if (!['github.com', 'ssh.dev.azure.com'].includes(host) && !(state.files['.ssh/config'] ?? '').includes(`Host ${host}`)) throw new Error('Unknown host alias. Add it to .ssh/config.');
    const identity = String(state.flags.sshIdentity);
    if (host.includes('azure') && state.flags[`sshKeyType:${identity}`] === 'ed25519') throw new Error('The Azure Repos lesson requires an RSA key with RSA-SHA2 signatures.');
    state.flags.sshAuthenticated = true; return `Simulated authentication to ${host} succeeded. No network connection was opened; real host fingerprints must be verified separately.`;
  }
  throw new Error('Unsupported SSH operation.');
}
export function shellCommand(state: RepositoryState, command: string): string {
  // This exact instructional idiom is recognized without evaluating its shell expansion.
  if (/^eval\s+["']?\$\(ssh-agent -s\)["']?$/.test(command.trim())) return sshCommand(state, ['ssh-agent', '-s']);
  const words = tokenize(command), [program, ...args] = words;
  if (program !== 'echo' && words.some(w => w === '>' || w === '>>')) throw new Error('Only echo redirection is supported; no arbitrary shell execution is available.');
  const installation = install(state, words); if (installation !== undefined) return installation;
  if (program === 'git') {
    if (!args.length) return HELP;
    if (args[0] === 'cat-file') return catObject(state, args.slice(1));
    return gitCommand(state, args[0], args.slice(1));
  }
  if (program === 'help') return HELP;
  if (program === 'pwd') { if (args.length) throw new Error('pwd takes no arguments in this simulator.'); return '/workspace/project'; }
  if (program === 'ls') {
    if (args.some(a => a.startsWith('-') && !['-a', '-l', '-la', '-al'].includes(a))) throw new Error('Supported ls flags: -a, -l, -la.');
    const pathArg = args.find(a => !a.startsWith('-')), path = pathArg && pathArg !== '.' ? filePath(pathArg).replace(/\/$/, '') : '';
    const internals = ['.git/HEAD', '.git/config', '.git/index', '.git/objects', '.git/refs', '.git/logs'];
    const pool = [...Object.keys(state.files), ...(args.some(a => a.includes('a')) || path.startsWith('.git') ? internals : [])];
    const names = new Set(pool.filter(p => !path || p.startsWith(path + '/')).map(p => (path ? p.slice(path.length + 1) : p).split('/')[0]).filter(p => p && (path || args.some(a => a.includes('a')) || !p.startsWith('.'))));
    state.flags.filesInspected = true; if (path.startsWith('.git')) state.flags.internalsInspected = true;
    return [...names].sort().join('\n') || '(empty directory)';
  }
  if (program === 'cat') {
    if (!args.length) throw new Error('Specify a file.');
    return args.map(input => { const path = filePath(input); const content = virtualFile(state, path) ?? state.files[path]; if (content === undefined) throw new Error(`File not found: ${path}`); if (path.startsWith('.git/')) state.flags.internalsInspected = true; return content; }).join('\n');
  }
  if (program === 'echo') {
    const at = args.findIndex(a => a === '>' || a === '>>'), noNewline = args[0] === '-n';
    const text = args.slice(noNewline ? 1 : 0, at >= 0 ? at : undefined).join(' ') + (noNewline ? '' : '\n');
    if (at < 0) return text;
    if (at !== args.length - 2) throw new Error('Usage: echo [-n] "text" >|>> <file>');
    const path = filePath(args[at + 1]); return editFile(state, path, (args[at] === '>>' ? state.files[path] ?? '' : '') + text);
  }
  if (program === 'touch') {
    if (!args.length || args.some(a => a.startsWith('-'))) throw new Error('Usage: touch <relative-file>');
    for (const input of args) { const path = filePath(input); if (!(path in state.files)) editFile(state, path, ''); } return 'Created simulated file(s).';
  }
  if (program === 'rm') {
    if (!args.length || args.some(a => a.startsWith('-'))) throw new Error('Usage: rm <relative-file>. Recursive shell deletion is not supported.');
    for (const input of args) { const path = filePath(input); if (!(path in state.files)) throw new Error(`File not found: ${path}`); if (path.startsWith('.git/')) throw new Error('Git internals are read-only.'); delete state.files[path]; } return 'Removed simulated file(s); use git add to stage tracked deletions.';
  }
  if (program === 'chmod') {
    if (args.length !== 2 || args[0] !== '+x') throw new Error('Supported: chmod +x .git/hooks/<hook>.');
    const path = filePath(args[1]); if (!path.startsWith('.git/hooks/') || !state.files[path]) throw new Error('Choose an existing simulated hook.');
    state.flags[`executable:${path}`] = true; return `Marked ${path} executable in the simulation.`;
  }
  if (['ssh-keygen', 'ssh-agent', 'ssh-add', 'ssh'].includes(program)) return sshCommand(state, words);
  if (program === 'code' && args[0] === '--clone' && args.length === 2) { const output = gitCommand(state, 'clone', [args[1]]); state.flags.clonedWithVSCode = true; return `VS Code clone flow simulated. ${output}`; }
  if ((program === 'which' || program === 'where.exe') && args.length === 1 && ['git', 'ssh'].includes(args[0])) return `/simulated/bin/${args[0]} (teaching fixture, not your computer)`;
  if (program === 'clear' && !args.length) return '';
  throw new Error(`Unsupported command: ${program}. Type help for the implemented simulation commands.`);
}
