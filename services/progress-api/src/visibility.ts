import type { CompleteResponse } from '../../../packages/contracts/src/index.ts';
import { object } from './security.ts';

/** Client estimates only: malformed observations never invalidate a verified exercise. */
export function aggregateVisibility(input: unknown, elapsedMs: number): CompleteResponse['visibility'] {
  try {
    if (!object(input) || input.version !== 1 || !['complete', 'partial', 'truncated'].includes(String(input.coverage)) || !Number.isSafeInteger(input.droppedEvents) || Number(input.droppedEvents) < 0 || !Array.isArray(input.segments) || input.segments.length > 64 || JSON.stringify(input).length > 32_768) return undefined;
    let focusedMs = 0, hiddenMs = 0, unfocusedMs = 0, changes = 0, count = 0;
    const documentIds = new Set<string>();
    for (const segment of input.segments) {
      if (!object(segment) || typeof segment.documentId !== 'string' || segment.documentId.length > 128 || documentIds.has(segment.documentId) || !Array.isArray(segment.events)) return undefined;
      documentIds.add(segment.documentId);
      let previous: { offsetMs: number; visibility: string; focused: boolean; sequence: number } | undefined;
      for (const event of segment.events) {
        if (++count > 512 || !object(event) || !Number.isSafeInteger(event.sequence) || Number(event.sequence) < 0 || typeof event.offsetMs !== 'number' || !Number.isFinite(event.offsetMs) || event.offsetMs < 0 || !['visible', 'hidden'].includes(String(event.visibility)) || typeof event.focused !== 'boolean' || typeof event.cause !== 'string' || event.cause.length > 32 || (event.persisted !== undefined && typeof event.persisted !== 'boolean')) return undefined;
        const current = { offsetMs: event.offsetMs, visibility: String(event.visibility), focused: event.focused, sequence: Number(event.sequence) };
        if (previous) {
          const duration = current.offsetMs - previous.offsetMs;
          if (duration < 0 || current.sequence <= previous.sequence) return undefined;
          if (previous.visibility === 'hidden') hiddenMs += duration;
          else if (previous.focused) focusedMs += duration;
          else unfocusedMs += duration;
          if (current.visibility !== previous.visibility || current.focused !== previous.focused) changes++;
        }
        previous = current;
      }
    }
    // Multiple tabs or forged offsets must never produce more estimated time than elapsed.
    if (focusedMs + hiddenMs + unfocusedMs > elapsedMs + 2000) return undefined;
    return { focusedMs: Math.floor(focusedMs / 100) * 100, hiddenMs: Math.floor(hiddenMs / 100) * 100, unfocusedMs: Math.floor(unfocusedMs / 100) * 100, changes, coverage: input.droppedEvents ? 'truncated' : String(input.coverage) };
  } catch { return undefined; }
}
