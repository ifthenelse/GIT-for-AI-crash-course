/** Render explicit code spans and recognizable file paths without interpreting HTML. */
export function LessonText({ children }: { children: string }) {
  const pattern = /(`[^`\n]+`|\bgit\s+[a-z-]+(?:\s+--?[\w-]+)*|(?:\.?\/?[\w-]+\/)*\.?[\w-]+\.(?:json|md|txt|ts|js|sh|yml|yaml|gitignore|gitattributes)\b|\.(?:gitignore|gitattributes)\b)/g;
  return <>{children.split(pattern).map((part, index) => index % 2 ? <code key={index}>{part.startsWith('`') ? part.slice(1, -1) : part}</code> : part)}</>;
}
