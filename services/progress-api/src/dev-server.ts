import { createServer } from 'node:http';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createApp } from './app.ts';
import { createSqliteDatabase } from './sqlite.ts';

const port = Number(process.env.PORT ?? 8787);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be between 1024 and 65535.');
const databasePath = resolve(process.env.DATABASE_PATH ?? '.tmp/progress.sqlite');
mkdirSync(dirname(databasePath), { recursive: true });
const db = createSqliteDatabase(databasePath);
const app = createApp({
  db,
  development: process.env.NODE_ENV !== 'production',
  appOrigin: process.env.APP_ORIGIN ?? 'http://127.0.0.1:5173',
  allowOrigins: (process.env.ALLOW_ORIGINS ?? 'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:4173,http://localhost:4173').split(',').map(value => value.trim()),
  authSecret: process.env.AUTH_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
});
const server = createServer(async (incoming, outgoing) => {
  try {
    const url = new URL(incoming.url ?? '/', `http://127.0.0.1:${port}`);
    const headers = new Headers();
    for (const [key, value] of Object.entries(incoming.headers)) if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of incoming) {
      const bytes = Buffer.from(chunk);
      size += bytes.length;
      if (size > 256_000) { outgoing.writeHead(413, { 'Content-Type': 'application/json' }); outgoing.end(JSON.stringify({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'The request is too large.' } })); return; }
      chunks.push(bytes);
    }
    const method = incoming.method ?? 'GET';
    const request = new Request(url, { method, headers, ...(method !== 'GET' && method !== 'HEAD' ? { body: Buffer.concat(chunks) } : {}) });
    const response = await app.fetch(request);
    outgoing.statusCode = response.status;
    response.headers.forEach((value, key) => { if (key !== 'set-cookie') outgoing.setHeader(key, value); });
    if (response.headers.getSetCookie().length) outgoing.setHeader('set-cookie', response.headers.getSetCookie());
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch { outgoing.writeHead(500, { 'Content-Type': 'application/json' }); outgoing.end(JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Request failed.' } })); }
});
server.listen(port, '127.0.0.1', () => process.stdout.write(`Local progress API: http://127.0.0.1:${port}\n`));
for (const signal of ['SIGTERM', 'SIGINT'] as const) process.on(signal, () => server.close(() => { db.close(); process.exit(0); }));
