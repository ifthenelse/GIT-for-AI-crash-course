export type IllustrationKind = 'security' | 'conflict' | 'branch' | 'remote' | 'staging' | 'history' | 'repository';
/** Language-independent matching keeps the same visual when the reader changes locale. */
export function illustrationKind(text: string): IllustrationKind {
  if (/ssh|key|passphrase|authenticat|permission|secret/i.test(text)) return 'security';
  if (/conflict|recover|rollback|revert|reset|reflog/i.test(text)) return 'conflict';
  if (/branch|merge|rebase|squash|worktree|head/i.test(text)) return 'branch';
  if (/remote|clone|fetch|pull|push|fork|platform|github|devops|cloud/i.test(text)) return 'remote';
  if (/stag|index|add|ignore|attribute|select/i.test(text)) return 'staging';
  if (/commit|history|version|snapshot|tag|release/i.test(text)) return 'history';
  return 'repository';
}
export function ConceptIllustration({ topic }: { topic: string }) {
  const kind = illustrationKind(topic);
  const node = (x: number, y: number) => <circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill="var(--panel)" />;
  return <svg className="concept-illustration" viewBox="0 0 240 160" aria-hidden="true" focusable="false" data-illustration={kind}>
    <rect x="8" y="8" width="224" height="144" rx="24" fill="var(--accent-light)" />
    <circle cx="198" cy="35" r="13" fill="var(--warm)" />
    <g stroke="var(--accent-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {kind === 'history' && <><path d="M40 82h160" />{[45,95,145,195].map(x=>node(x,82))}<path d="M40 111h35m15 0h35m15 0h35" opacity=".4" /></>}
      {kind === 'branch' && <><path d="M42 112h156M77 112c0-52 28-65 58-65h40" />{node(44,112)}{node(78,112)}{node(135,47)}{node(192,112)}{node(179,47)}</>}
      {kind === 'repository' && <><path d="M49 63V48h51l15 16h77v57H49Z" fill="var(--panel)" /><path d="M49 64h143M79 86h44m-44 15h76" /><path d="M150 48v-9h29v25" /></>}
      {kind === 'staging' && <><rect x="33" y="40" width="45" height="65" rx="5" fill="var(--panel)" /><path d="M44 57h22M44 69h15M92 81h41m-9-9 9 9-9 9M149 63h58v57h-58Z" /><path d="m163 91 10 10 20-24" /></>}
      {kind === 'remote' && <><rect x="28" y="79" width="62" height="43" rx="5" fill="var(--panel)" /><path d="M21 129h77m43-76c-8-28 33-40 45-17 25-5 33 32 9 34h-54c-17 0-18-17 0-17ZM106 88l29-22m-12 0h12v12M134 102l-27 20m12 0h-12v-12" /></>}
      {kind === 'security' && <><path d="m91 37 49 15v34c0 25-24 41-49 49-25-8-49-24-49-49V52Z" fill="var(--panel)" /><circle cx="157" cy="82" r="17" /><path d="M174 82h30m-7 0v12m-13-12v8m-116-6 15 15 28-34" /></>}
      {kind === 'conflict' && <><path d="M37 45h42l43 35 43-35h37M37 117h42l43-37 43 37h37" /><circle cx="122" cy="80" r="23" fill="var(--panel)" /><path d="M122 66v17m0 10v1" />{node(39,45)}{node(200,117)}</>}
    </g>
  </svg>;
}
