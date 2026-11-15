import { mkdir, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

// Reset only this suite's disposable database. Never inspect a production DB env.
const database = resolve('.tmp/e2e.sqlite');
await mkdir(dirname(database), { recursive: true });
for (const suffix of ['', '-wal', '-shm', '-journal']) {
  await rm(`${database}${suffix}`, { force: true });
}
