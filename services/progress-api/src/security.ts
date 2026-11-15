export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}
export function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}
export async function hash(value: string) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return btoa(String.fromCharCode(...digest)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}
export function object(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value); }
export function canonicalJSON(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(',')}]`;
  if (object(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJSON(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export async function jsonBody(request: Request, maxBytes = 256_000): Promise<Record<string, unknown>> {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new ApiError(415, 'JSON_REQUIRED', 'Send a JSON request.');
  if (Number(request.headers.get('content-length')) > maxBytes) throw new ApiError(413, 'PAYLOAD_TOO_LARGE', 'The request is too large.');
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'INVALID_JSON', 'A JSON object is required.');
  let total = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) { await reader.cancel(); throw new ApiError(413, 'PAYLOAD_TOO_LARGE', 'The request is too large.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let position = 0;
  for (const chunk of chunks) { bytes.set(chunk, position); position += chunk.length; }
  let parsed: unknown;
  try { parsed = JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new ApiError(400, 'INVALID_JSON', 'Invalid JSON.'); }
  if (!object(parsed)) throw new ApiError(400, 'INVALID_JSON', 'A JSON object is required.');
  return parsed;
}

/** Best-effort per-isolate abuse limiter; hosting-level controls remain a release gate. */
export function createRateLimiter(limit = 120, intervalMs = 60_000) {
  const buckets = new Map<string, { count: number; until: number }>();
  return (key: string, now: number) => {
    if (buckets.size > 4096) {
      for (const [id, bucket] of buckets) if (bucket.until <= now) buckets.delete(id);
      if (buckets.size > 4096) throw new ApiError(429, 'RATE_LIMITED', 'Please try again shortly.');
    }
    let bucket = buckets.get(key);
    if (!bucket || bucket.until <= now) { bucket = { count: 0, until: now + intervalMs }; buckets.set(key, bucket); }
    if (++bucket.count > limit) throw new ApiError(429, 'RATE_LIMITED', 'Please try again shortly.');
  };
}
