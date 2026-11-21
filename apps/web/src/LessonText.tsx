import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CodeBlock({ children }: { children: string }) {
  const { i18n } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const italian = i18n.language?.startsWith('it') ?? false;
  const label = status === 'copied' ? (italian ? 'Copiato' : 'Copied') : status === 'failed' ? (italian ? 'Copia non riuscita' : 'Copy failed') : (italian ? 'Copia' : 'Copy');
  return <div className="lesson-code-block"><div className="code-block-toolbar"><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(children); setStatus('copied'); } catch { setStatus('failed'); } }}>{label}</button><span className="sr-only" role="status">{status === 'idle' ? '' : label}</span></div><pre><code>{children}</code></pre></div>;
}
function InlineText({ text }: { text: string }) {
  const pattern = /(`[^`\n]+`|\b(?:Ctrl|Control|Cmd|Command|Alt|Option|Shift|Meta)(?:\s*\+\s*(?:[A-Za-z0-9]+)){1,3}\b|(?:\.?\/?[\w-]+\/)*\.?[\w-]+\.(?:json|md|txt|ts|js|sh|yml|yaml)\b|\.(?:gitignore|gitattributes)\b)/g;
  return <>{text.split(pattern).map((part, index) => {
    if (!(index % 2)) return part;
    const value = part.startsWith('`') ? part.slice(1, -1) : part;
    if (/^(?:git|ssh|ssh-keygen|ssh-agent|ssh-add|sudo|winget|brew|cat|chmod|which)\s/.test(value)) return <CodeBlock key={index}>{value}</CodeBlock>;
    return /^(?:Ctrl|Control|Cmd|Command|Alt|Option|Shift|Meta)\s*\+/.test(value) ? <kbd key={index}>{value}</kbd> : <code key={index}>{value}</code>;
  })}</>;
}
/** A small safe text format: fenced code, inline identifiers and keyboard chords. */
export function LessonText({ children }: { children: string }) {
  return <>{children.split(/(```[^\n]*\n[\s\S]*?```)/g).map((part, index) => part.startsWith('```') ? <CodeBlock key={index}>{part.replace(/^```[^\n]*\n/, '').replace(/\n?```$/, '')}</CodeBlock> : <InlineText key={index} text={part} />)}</>;
}
