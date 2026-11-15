import { DatabaseSync } from 'node:sqlite';
import type { SqlDatabase, Statement, SqlValue } from './database.ts';

export function createSqliteDatabase(path = ':memory:'): SqlDatabase & { close(): void } {
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  if (path !== ':memory:') db.exec('PRAGMA journal_mode = WAL;');
  return {
    async get<T>(sql: string, values: SqlValue[] = []) { return db.prepare(sql).get(...values) as T | undefined; },
    async all<T>(sql: string, values: SqlValue[] = []) { return db.prepare(sql).all(...values) as T[]; },
    async run(sql: string, values: SqlValue[] = []) { db.prepare(sql).run(...values); },
    async batch(statements: Statement[]) {
      db.exec('BEGIN IMMEDIATE');
      try {
        for (const { sql, values = [] } of statements) db.prepare(sql).run(...values);
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    close() { db.close(); },
  };
}
