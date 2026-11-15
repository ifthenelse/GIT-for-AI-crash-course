export type SqlValue = string | number | null;
export interface Statement { sql: string; values?: SqlValue[]; }
export interface SqlDatabase {
  get<T>(sql: string, values?: SqlValue[]): Promise<T | undefined>;
  all<T>(sql: string, values?: SqlValue[]): Promise<T[]>;
  run(sql: string, values?: SqlValue[]): Promise<void>;
  /** All statements commit together or roll back together. */
  batch(statements: Statement[]): Promise<void>;
}

export const schema = [
  'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, provider TEXT NOT NULL, subject TEXT NOT NULL, display_name TEXT NOT NULL, alias TEXT, leaderboard_opt_in INTEGER NOT NULL DEFAULT 0, UNIQUE(provider, subject))',
  'CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_ms INTEGER NOT NULL)',
  'CREATE TABLE IF NOT EXISTS attempts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), lesson_id TEXT NOT NULL, course_version TEXT NOT NULL, started_ms INTEGER NOT NULL, completed_ms INTEGER)',
  'CREATE UNIQUE INDEX IF NOT EXISTS one_active_attempt ON attempts(user_id, lesson_id, course_version) WHERE completed_ms IS NULL',
  'CREATE TABLE IF NOT EXISTS submissions (user_id TEXT NOT NULL, idempotency_key TEXT NOT NULL, attempt_id TEXT NOT NULL UNIQUE, payload_hash TEXT NOT NULL, result_json TEXT NOT NULL, visibility_json TEXT, PRIMARY KEY(user_id, idempotency_key))',
  'CREATE TABLE IF NOT EXISTS lesson_results (user_id TEXT NOT NULL, course_version TEXT NOT NULL, lesson_id TEXT NOT NULL, tier TEXT NOT NULL, score INTEGER NOT NULL, elapsed_ms INTEGER NOT NULL, completed_at TEXT NOT NULL, PRIMARY KEY(user_id, course_version, lesson_id))',
  'CREATE TABLE IF NOT EXISTS tier_completions (user_id TEXT NOT NULL, course_version TEXT NOT NULL, tier TEXT NOT NULL, score INTEGER NOT NULL, elapsed_ms INTEGER NOT NULL, completed_at TEXT NOT NULL, PRIMARY KEY(user_id, course_version, tier))',
  'CREATE TABLE IF NOT EXISTS oauth_requests (id TEXT PRIMARY KEY, challenge TEXT NOT NULL, app_state TEXT NOT NULL, expires_ms INTEGER NOT NULL)',
  'CREATE TABLE IF NOT EXISTS handoffs (code_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, challenge TEXT NOT NULL, app_state TEXT NOT NULL, expires_ms INTEGER NOT NULL)',
  'CREATE INDEX IF NOT EXISTS leaderboard_lookup ON tier_completions(course_version, tier, score DESC, elapsed_ms)',
];

export async function initializeDatabase(db: SqlDatabase) {
  for (const sql of schema) await db.run(sql);
}

interface D1Statement {
  bind(...values: SqlValue[]): D1Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<unknown>;
}
/** Structural subset of a Cloudflare D1 binding; no Cloudflare runtime dependency. */
export interface D1Binding {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown>;
}
export function createD1Database(binding: D1Binding): SqlDatabase {
  const prepare = (sql: string, values: SqlValue[] = []) => binding.prepare(sql).bind(...values);
  return {
    async get<T>(sql: string, values?: SqlValue[]) { return (await prepare(sql, values).first<T>()) ?? undefined; },
    async all<T>(sql: string, values?: SqlValue[]) { return (await prepare(sql, values).all<T>()).results; },
    async run(sql, values) { await prepare(sql, values).run(); },
    async batch(statements) { await binding.batch(statements.map(({ sql, values }) => prepare(sql, values))); },
  };
}
