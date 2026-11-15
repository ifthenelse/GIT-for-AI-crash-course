export const COURSE_VERSION = '1.0.0';
export const ENGINE_VERSION = '1';
export type Locale = 'it' | 'en';
export type Tier = 'base' | 'intermediate' | 'advanced';
export type Text = Record<Locale, string>;
export interface Commit { id: string; parents: string[]; message: string; tree: Record<string, string>; }
export interface Remote { url: string; branches: Record<string, string>; }
export interface Conflict { base: string; ours: string; theirs: string; }
export interface RepositoryState {
  files: Record<string, string>;
  index: Record<string, string>;
  commits: Commit[];
  head: { kind: 'branch'; name: string } | { kind: 'detached'; commit: string };
  branches: Record<string, string>;
  tags: Record<string, string>;
  remotes: Record<string, Remote>;
  config: Record<'system' | 'global' | 'local' | 'worktree', Record<string, string>>;
  reflog: { commit: string; message: string }[];
  conflicts: Record<string, Conflict>;
  operation: null | { kind: 'merge' | 'rebase'; target: string; originalHead: string; remaining?: string[] };
  worktrees: Record<string, { branch: string; files: Record<string, string> }>;
  flags: Record<string, boolean | string | number>;
  answers: Record<string, string>;
  platform: { provider: 'github' | 'azure'; pullRequests: { id: number; source: string; target: string; title: string; approved: boolean; merged: boolean }[]; reviewRequired: boolean; blockDirectPush: boolean; releases: { tag: string; title: string }[]; forked: boolean };
}
export interface RepoSeed {
  files?: Record<string, string>;
  trackedFiles?: Record<string, string>;
  commits?: Commit[];
  branches?: Record<string, string>;
  currentBranch?: string;
  remotes?: Record<string, Remote>;
  tags?: Record<string, string>;
  config?: Partial<RepositoryState['config']>;
  flags?: RepositoryState['flags'];
  platform?: Partial<RepositoryState['platform']>;
  conflicts?: Record<string, Conflict>;
  operation?: RepositoryState['operation'];
}
export type Action =
  | { type: 'command'; command: string }
  | { type: 'edit'; path: string; content: string }
  | { type: 'answer'; questionId: string; value: string }
  | { type: 'platform'; operation: 'open-pr' | 'approve-pr' | 'merge-pr' | 'enable-policy' | 'create-release' | 'fork' | 'agent-change' | 'switch-provider'; payload?: Record<string, string> }
  | { type: 'undo' | 'redo' | 'reset' };
export type Objective =
  | { type: 'file'; path: string; content?: string; includes?: string; tracked?: boolean }
  | { type: 'commit'; messageIncludes?: string; file?: string; contains?: string }
  | { type: 'branch'; name: string; current?: boolean }
  | { type: 'clean' }
  | { type: 'config'; key: string; value: string; scope?: 'system' | 'global' | 'local' | 'worktree' }
  | { type: 'remote'; name: string; urlIncludes?: string }
  | { type: 'tag'; name: string }
  | { type: 'operation-complete' | 'no-conflicts' }
  | { type: 'flag'; name: string; value?: boolean | string | number }
  | { type: 'answer'; questionId: string; value: string }
  | { type: 'platform'; key: 'pullRequestOpen' | 'pullRequestApproved' | 'pullRequestMerged' | 'reviewRequired' | 'blockDirectPush' | 'releasePublished' | 'forked' | 'provider'; value: boolean | string }
  | { type: 'worktree'; path: string }
  | { type: 'history'; minimum?: number; parentCount?: number }
  | { type: 'ignore'; path: string }
  | { type: 'attributes'; path: string; includes: string }
  | { type: 'hook'; name: string };
export interface Quiz { id: string; prompt: Text; choices: { id: string; label: Text }[]; correct: string; }
export interface Lesson {
  id: string; tier: Tier; order: number; title: Text; summary: Text;
  concepts: { title: Text; body: Text }[];
  task: Text; hints: Text[]; seed: RepoSeed; objectives: Objective[];
  solution: Action[]; quiz?: Quiz; reference: { label: string; url: string }[];
  estimatedMinutes: number;
}
export interface ObjectiveResult { objective: Objective; passed: boolean; }
export interface EngineResult { state: RepositoryState; output: string; error?: boolean; }
export interface PublicConfig { courseVersion: string; development: boolean; providers: { id: string; name: string; authorizeUrl: string }[]; }
export interface User { id: string; displayName: string; provider: string; }
export interface Session { token: string; user: User; }
export interface LessonResult { lessonId: string; score: number; elapsedMs: number; completedAt: string; }
export interface TierCompletion { tier: Tier; score: number; elapsedMs: number; completedAt: string; }
export interface Progress { courseVersion: string; completedLessons: string[]; results: LessonResult[]; completions: TierCompletion[]; unlockedTiers: Tier[]; }
export interface Attempt { id: string; lessonId: string; startedAt: string; courseVersion: string; }
export interface VisibilityEvent { sequence: number; offsetMs: number; cause: string; visibility: 'visible' | 'hidden'; focused: boolean; persisted?: boolean; }
export interface VisibilityLedger { version: 1; coverage: 'complete' | 'partial' | 'truncated'; droppedEvents: number; segments: { documentId: string; events: VisibilityEvent[] }[]; }
export interface CompleteRequest { courseVersion: string; actions: Action[]; idempotencyKey: string; visibility?: VisibilityLedger; }
export interface CompleteResponse { result: LessonResult; progress: Progress; visibility?: { focusedMs: number; hiddenMs: number; unfocusedMs: number; changes: number; coverage: string }; }
export interface LeaderboardEntry { rank: number; alias: string; tier: Tier; score: number; elapsedMs: number; completedAt: string; }
export interface Leaderboard { entries: LeaderboardEntry[]; }
