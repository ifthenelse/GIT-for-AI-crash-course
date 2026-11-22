import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getHeadCommit, getStatus } from '@gitcourse/engine';
import { useLab } from './store';
import { Icon } from './icons';
export function Terminal() {
  const {
    t
  } = useTranslation();
  const [command, setCommand] = useState('');
  const [cursor, setCursor] = useState(-1);
  const commands = useRef<string[]>([]);
  const {
    repo,
    lines,
    act
  } = useLab();
  const output = useRef<HTMLDivElement>(null);
  useEffect(() => {
    output.current?.scrollTo(0, output.current.scrollHeight);
  }, [lines]);
  return <div className="terminal-shell">
<div className="terminal-output" data-testid="terminal-output" ref={output} role="log" aria-label={t('terminal')}>
<p className="terminal-welcome">Git by doing · Bash simulator<br />{t('terminalHelp')}</p>{lines.map(line => <div key={line.id}>{line.command && <p className="prompt-line">
<span>❯</span> {line.command}</p>}<pre className={line.error ? 'terminal-error' : ''}>{line.output}</pre>
</div>)}</div>
<form className="terminal-form" onSubmit={e => {
      e.preventDefault();
      if (!command.trim()) return;
      act({
        type: 'command',
        command
      });
      commands.current.push(command);
      setCursor(-1);
      setCommand('');
    }}>
<span aria-hidden="true">❯</span>
<label className="sr-only" htmlFor="command">{t('command')}</label>
<input id="command" data-testid="terminal-input" autoComplete="off" spellCheck={false} value={command} placeholder={t('commandPlaceholder')} onChange={e => setCommand(e.target.value)} onKeyDown={e => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const next = cursor < 0 ? commands.current.length - 1 : Math.max(0, cursor - 1);
          setCursor(next);
          setCommand(commands.current[next] ?? '');
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = cursor + 1;
          setCursor(next);
          setCommand(commands.current[next] ?? '');
        }
      }} />
<button aria-label={t('run')} type="submit">
<Icon name="arrow" size={18} />
</button>
</form>
<div className="terminal-status">{repo.head.kind === 'branch' ? repo.head.name : 'detached HEAD'} <span>bash · simulated</span>
</div>
</div>;
}
export function Graph() {
  const {
    t
  } = useTranslation();
  const repo = useLab(s => s.repo);
  const head = getHeadCommit(repo);
  const commits = [...repo.commits].reverse();
  const lanes = new Map<string, number>();
  let lane = 0;
  for (const [, tip] of Object.entries(repo.branches).sort(([a], [b]) => a === 'main' ? -1 : b === 'main' ? 1 : a.localeCompare(b))) {
    let cursor = tip;
    while (cursor && !lanes.has(cursor)) {
      lanes.set(cursor, lane);
      cursor = repo.commits.find(c => c.id === cursor)?.parents[0] ?? '';
    }
    lane++;
  }
  for (const commit of commits) if (!lanes.has(commit.id)) lanes.set(commit.id, lane++);
  const x = (id: string) => 12 + (lanes.get(id) ?? 0) % 4 * 14;
  const y = (id: string) => commits.findIndex(c => c.id === id) * 100 + 26;
  return <div className="graph-panel">
<div className="panel-subhead">
<span className="branch-pill">
<Icon name="branch" size={14} />{repo.head.kind === 'branch' ? repo.head.name : 'detached HEAD'}</span>
<span>{commits.length} commits</span>
</div>
<div className="graph-body">
<svg className="graph-edges" width="70" height={commits.length * 100} viewBox={`0 0 70 ${commits.length*100||1}`} preserveAspectRatio="none" style={{height:`${commits.length*6.25}em`}} aria-hidden="true">{commits.flatMap(c => c.parents.filter(id => commits.some(p => p.id === id)).map(parent => <path key={`${c.id}:${parent}`} d={`M ${x(c.id)} ${y(c.id)} C ${x(c.id)} ${y(c.id) + 40}, ${x(parent)} ${y(parent) - 40}, ${x(parent)} ${y(parent)}`} fill="none" stroke={c.parents.length > 1 ? 'var(--accent)' : 'var(--muted)'} strokeWidth="1.5" />))}{commits.map(c => <circle key={c.id} cx={x(c.id)} cy={y(c.id)} r="4" fill={c.id === head?.id ? 'var(--accent)' : 'var(--panel)'} stroke="var(--accent)" strokeWidth="2" />)}</svg>
<ol className="commit-graph" aria-label={t('commitList')}>{commits.map((commit, i) => <li key={commit.id} className={head?.id === commit.id ? 'current-commit' : ''}>
<span className="graph-node" aria-hidden="true" />
<div className="commit-main">
<div className="commit-refs">{head?.id === commit.id && <b>HEAD</b>}{Object.entries(repo.branches).filter(([, id]) => id === commit.id).map(([name]) => <span key={name}>{name}</span>)}{Object.entries(repo.tags).filter(([, id]) => id === commit.id).map(([name]) => <span key={name}>{name}</span>)}</div>
<strong>{commit.message}</strong>
<code>{commit.id.slice(0, 7)}</code>
<small>{t('parents')}: {commit.parents.map(id => id.slice(0, 7)).join(', ') || '—'}</small>{commit.parents.length > 1 && <span className="merge-edges" aria-hidden="true">╲ ╱ merge</span>}</div>
<span className="commit-index">{String(commits.length - i).padStart(2, '0')}</span>
</li>)}</ol>
</div>{!commits.length && <p>{t('noCommits')}</p>}<details>
<summary>{t('remote')}</summary>{Object.entries(repo.remotes).map(([name, r]) => <p key={name}>
<strong>{name}</strong>
<br />
<code>{r.url}</code>
<br />{Object.entries(r.branches).map(([b, id]) => <small key={b}>{name}/{b} → {id.slice(0, 7)} </small>)}</p>)}</details>
</div>;
}
export function Editor() {
  const {
    t
  } = useTranslation();
  const {
    repo,
    act
  } = useLab();
  const paths = Object.keys(repo.files).sort();
  const [path, setPath] = useState(paths.includes('README.md') ? 'README.md' : paths[0] ?? 'README.md');
  const [name, setName] = useState('');
  const [value, setValue] = useState(repo.files[path] ?? '');
  const current = repo.files[path] ?? '';
  const status = getStatus(repo);
  useEffect(() => {
    setValue(current);
  }, [current, path]);
  const save = () => {
    if (value !== current) act({
      type: 'edit',
      path,
      content: value
    });
  };
  return <div className="editor-shell">
<div className="file-tree">
<div className="small-label">EXPLORER</div>{paths.map(p => <button key={p} className={p === path ? 'selected' : ''} onClick={() => {
        save();
        setPath(p);
      }} title={p}>
<Icon name="editor" size={14} />
<span>{p}</span>{status.modified.includes(p) && <b>M</b>}{status.untracked.includes(p) && <b>U</b>}</button>)}<form onSubmit={e => {
        e.preventDefault();
        if (!name.trim()) return;
        save();
        act({
          type: 'edit',
          path: name,
          content: ''
        });
        setPath(name);
        setName('');
      }}>
<label className="sr-only" htmlFor="new-file">{t('fileName')}</label>
<input id="new-file" value={name} placeholder={t('fileName')} onChange={e => setName(e.target.value)} />
<button type="submit" title={t('newFile')} aria-label={t('newFile')}>+</button>
</form>
</div>
<div className="editor-main">
<div className="editor-tab">
<Icon name="editor" size={14} />{path}<span>{value !== current ? '●' : '×'}</span>
</div>
<label className="sr-only" htmlFor="editor-content">{t('fileContent')}</label>
<textarea id="editor-content" data-testid="editor-content" value={value} spellCheck={false} onChange={e => setValue(e.target.value)} onBlur={save} />
<div className="editor-tools">
<button onClick={() => {
          save();
          act({
            type: 'command',
            command: `git add "${path.replace(/["\\]/g, '\\$&')}"`
          });
        }}>{t('stage')}</button>
<button onClick={() => {
          save();
          act({
            type: 'command',
            command: `git restore --staged "${path.replace(/["\\]/g, '\\$&')}"`
          });
        }}>{t('unstage')}</button>
</div>
<details className="editor-diff">
<summary>{t('diff')} · {status.modified.length + status.untracked.length}</summary>
<pre>{current === repo.index[path] ? t('noChanges') : `--- ${path}\n${repo.index[path] ?? ''}\n+++ ${path}\n${current}`}</pre>
</details>
<p className="editor-status">{status.staged.length} staged · {status.modified.length} modified <span>UTF-8</span>
</p>
</div>
</div>;
}
export function Portal() {
  const {
    t
  } = useTranslation();
  const {
    repo,
    act
  } = useLab();
  const p = repo.platform;
  const [source, setSource] = useState('feature');
  const [target, setTarget] = useState('main');
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('v1.0.0');
  const [release, setRelease] = useState('');
  return <div className="portal-panel">
<label>{t('provider')}<select value={p.provider} onChange={e => act({
        type: 'platform',
        operation: 'switch-provider',
        payload: {
          provider: e.target.value
        }
      })}>
<option value="github">GitHub</option>
<option value="azure">Azure DevOps</option>
</select>
</label>
<div className="portal-repo">
<Icon name="book" />
<strong>example / git-lab</strong>
<span className="pill">simulation</span>
</div>
<details open>
<summary>{t('pullRequests')}</summary>{p.pullRequests.map(pr => <article className="pr" key={pr.id}>
<strong>#{pr.id} {pr.title}</strong>
<small>{pr.source} → {pr.target}</small>
<span>{t(pr.merged ? 'prMerged' : pr.approved ? 'prApproved' : 'prOpen')}</span>{!pr.merged && <div>
<button onClick={() => act({
            type: 'platform',
            operation: 'approve-pr',
            payload: {
              id: String(pr.id)
            }
          })}>{t('approvePr')}</button>
<button onClick={() => act({
            type: 'platform',
            operation: 'merge-pr',
            payload: {
              id: String(pr.id)
            }
          })}>{t('mergePr')}</button>
</div>}</article>)}{!p.pullRequests.length && <p className="muted">{t('noPrs')}</p>}<form className="portal-form" onSubmit={e => {
        e.preventDefault();
        act({
          type: 'platform',
          operation: 'open-pr',
          payload: {
            source,
            target,
            title
          }
        });
      }}>
<div className="form-row">
<label>{t('branchFrom')}<input value={source} onChange={e => setSource(e.target.value)} />
</label>
<label>{t('branchTo')}<input value={target} onChange={e => setTarget(e.target.value)} />
</label>
</div>
<label>{t('prTitle')}<input value={title} onChange={e => setTitle(e.target.value)} required />
</label>
<button className="button button-small" type="submit">{t('openPr')}</button>
</form>
</details>
<details>
<summary>{t('policies')}</summary>
<p>{t('policyDescription')}</p>
<button onClick={() => act({
        type: 'platform',
        operation: 'enable-policy',
        payload: {
          reviewRequired: 'true',
          blockDirectPush: 'true'
        }
      })}>{t('enablePolicy')}</button>{p.reviewRequired && p.blockDirectPush && <p className="success">{t('policyEnabled')}</p>}</details>
<details>
<summary>{t('releases')}</summary>{p.releases.map(r => <p key={r.tag}>{r.tag} · {r.title}</p>)}<form className="portal-form" onSubmit={e => {
        e.preventDefault();
        act({
          type: 'platform',
          operation: 'create-release',
          payload: {
            tag,
            title: release
          }
        });
      }}>
<label>{t('releaseTag')}<input value={tag} onChange={e => setTag(e.target.value)} />
</label>
<label>{t('releaseTitle')}<input value={release} onChange={e => setRelease(e.target.value)} required />
</label>
<button>{t('publishRelease')}</button>
</form>
</details>
<details>
<summary>{t('fork')} / AI</summary>
<button onClick={() => act({
        type: 'platform',
        operation: 'fork',
        payload: {
          url: 'https://github.com/learner/git-lab.git'
        }
      })} disabled={p.forked}>{t(p.forked ? 'forked' : 'fork')}</button>
<button onClick={() => act({
        type: 'platform',
        operation: 'agent-change',
        payload: {
          path: 'README.md',
          content: '# Git by doing\nAgent-reviewed guide\n',
          branch: 'agent/catalog'
        }
      })}>{t('agentChange')}</button>
</details>
</div>;
}
