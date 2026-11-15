/** A deliberately small, non-executing shell grammar. No expansion, pipelines or subprocesses. */
export function tokenize(command: string): string[] {
  if (!command.trim() || command.length > 4096) throw new Error('Command must contain 1–4096 characters.');
  const words: string[] = [];
  let word = '', quote = '', active = false;
  for (let i = 0; i < command.length; i++) {
    const char = command[i];
    if (quote) {
      if (char === quote) { quote = ''; continue; }
      if (char === '\\' && quote === '"' && /["\\]/.test(command[i + 1] ?? '')) word += command[++i];
      else word += char;
      continue;
    }
    if (char === "'" || char === '"') { quote = char; active = true; continue; }
    if (char === '\\') { if (++i >= command.length) throw new Error('Unfinished escape.'); word += command[i]; active = true; continue; }
    if (/\s/.test(char)) { if (active) { words.push(word); word = ''; active = false; } continue; }
    if (';|&`$()<>'.includes(char)) {
      if (char === '>') {
        if (active) { words.push(word); word = ''; active = false; }
        if (command[i + 1] === '>') { words.push('>>'); i++; } else words.push('>');
        continue;
      }
      throw new Error('This simulator does not execute shell operators, expansion or subprocesses.');
    }
    word += char; active = true;
  }
  if (quote) throw new Error('Unclosed quote.');
  if (active) words.push(word);
  if (words.length > 80) throw new Error('Too many command arguments.');
  return words;
}

export function filePath(input: string): string {
  const path = input.replace(/^~\//, '').replace(/^\.\//, '');
  if (!path || path.length > 240 || path.startsWith('/') || path.split('/').some(p => p === '..' || p === '' || p === '.')) throw new Error('Use a relative path inside the simulated repository.');
  if (/[\u0000-\u001f\\]/.test(path) || ['__proto__', 'prototype', 'constructor'].some(p => path.split('/').includes(p))) throw new Error('Invalid file path.');
  return path;
}

export function validRef(name: string): string {
  if (!name || name.length > 120 || /[\s~^:?*\[\\\u0000-\u001f]/.test(name) || name.includes('..') || name.includes('@{') || name.endsWith('/') || name.startsWith('-') || name.startsWith('/') || name.endsWith('.') || name.endsWith('.lock') || name.split('/').some(p => !p || p.startsWith('.') || ['__proto__', 'constructor', 'prototype'].includes(p))) throw new Error('Invalid reference name.');
  return name;
}
