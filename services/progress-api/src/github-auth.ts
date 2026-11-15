import { Auth, type AuthConfig } from '@auth/core';
import GitHub from '@auth/core/providers/github';
import type { Session, User } from '../../../packages/contracts/src/index.ts';
import type { SqlDatabase } from './database.ts';
import { ApiError, hash, jsonBody, randomToken } from './security.ts';

interface GithubConfig {
  db: SqlDatabase;
  appOrigin: string;
  now: () => number;
  authSecret?: string;
  githubClientId?: string;
  githubClientSecret?: string;
  sessionLifetimeMs?: number;
  createUser(subject: string, name: string): Promise<User>;
  issueSession(userId: string): Promise<Session>;
}
const cookieName = 'gitcourse_oauth_request';
function cookieValue(request: Request, name: string) {
  return request.headers.get('cookie')?.split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`))?.slice(name.length + 1);
}
function appendCookies(response: Response, cookies: string[]) {
  const headers = new Headers(response.headers);
  for (const cookie of cookies) headers.append('Set-Cookie', cookie);
  return new Response(response.body, { status: response.status, headers });
}

export function createGithubAuth(config: GithubConfig) {
  const enabled = !!(config.authSecret && config.githubClientId && config.githubClientSecret);
  const authOptions = (origin: string): AuthConfig => ({
    secret: config.authSecret,
    trustHost: true,
    basePath: '/auth',
    session: { strategy: 'jwt', maxAge: 30 * 60 },
    providers: [GitHub({
      clientId: config.githubClientId,
      clientSecret: config.githubClientSecret,
      checks: ['pkce', 'state'],
      authorization: { url: 'https://github.com/login/oauth/authorize', params: { scope: '' } },
      userinfo: {
        url: 'https://api.github.com/user',
        async request({ tokens }: { tokens: { access_token?: string } }) {
          const response = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${tokens.access_token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'git-practice-lab' } });
          if (!response.ok) throw new Error('GitHub identity lookup failed');
          return response.json();
        },
      },
    })],
    pages: { error: '/auth/failure' },
    callbacks: {
      async jwt({ token, account, user }) {
        if (account?.provider === 'github') {
          const member = await config.createUser(account.providerAccountId, user.name ?? 'GitHub learner');
          token.appUserId = member.id;
        }
        // Keep only app identity in the encrypted Auth.js session; no provider token.
        return { sub: token.sub, appUserId: token.appUserId };
      },
      async session({ session, token }) {
        if (session.user && typeof token.appUserId === 'string') (session.user as typeof session.user & { id: string }).id = token.appUserId;
        return session;
      },
      async redirect({ url }) {
        const parsed = new URL(url, origin);
        return parsed.origin === origin && parsed.pathname === '/auth/handoff' ? parsed.href : `${origin}/auth/failure`;
      },
    },
    // Never emit provider errors/tokens into application logs or responses.
    logger: { error() {}, warn() {}, debug() {} },
  });

  return { enabled, async handle(request: Request): Promise<Response | undefined> {
    const url = new URL(request.url);
    const origin = url.origin;
    const fail = () => { const destination = new URL(config.appOrigin); destination.searchParams.set('auth_error', 'oauth_failed'); return Response.redirect(destination, 303); };
    if (url.pathname === '/auth/exchange' && request.method === 'POST') {
      const body = await jsonBody(request, 4096);
      if (typeof body.code !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(body.code) || typeof body.codeVerifier !== 'string' || !/^[A-Za-z0-9._~-]{43,128}$/.test(body.codeVerifier) || typeof body.state !== 'string') throw new ApiError(400, 'INVALID_HANDOFF', 'Invalid sign-in handoff.');
      const token = randomToken();
      const tokenHash = await hash(token);
      const codeHash = await hash(body.code);
      const challenge = await hash(body.codeVerifier);
      const currentTime = config.now();
      await config.db.batch([
        { sql: 'INSERT INTO sessions(token_hash, user_id, expires_ms) SELECT ?, user_id, ? FROM handoffs WHERE code_hash = ? AND challenge = ? AND app_state = ? AND expires_ms > ?', values: [tokenHash, currentTime + (config.sessionLifetimeMs ?? 30 * 60_000), codeHash, challenge, body.state, currentTime] },
        { sql: 'DELETE FROM handoffs WHERE code_hash = ? AND challenge = ? AND app_state = ? AND expires_ms > ?', values: [codeHash, challenge, body.state, currentTime] },
      ]);
      const user = await config.db.get<{ id: string; displayName: string; provider: string }>('SELECT users.id AS id, display_name AS displayName, provider FROM users JOIN sessions ON users.id = sessions.user_id WHERE token_hash = ?', [tokenHash]);
      if (!user) throw new ApiError(401, 'HANDOFF_EXPIRED', 'Sign-in expired. Please try again.');
      return Response.json({ token, user } satisfies Session);
    }
    if (url.pathname === '/auth/failure') return fail();
    if (!enabled) return undefined;
    const options = authOptions(origin);
    if (url.pathname === '/auth/github' && request.method === 'GET') {
      const challenge = url.searchParams.get('code_challenge');
      const appState = url.searchParams.get('state');
      if (!challenge || !/^[A-Za-z0-9_-]{43}$/.test(challenge) || !appState || !/^[A-Za-z0-9_-]{16,128}$/.test(appState)) throw new ApiError(400, 'INVALID_CHALLENGE', 'Start sign-in from the course.');
      const id = randomToken();
      await config.db.run('DELETE FROM oauth_requests WHERE expires_ms < ?', [config.now()]);
      await config.db.run('DELETE FROM handoffs WHERE expires_ms < ?', [config.now()]);
      await config.db.run('INSERT INTO oauth_requests(id, challenge, app_state, expires_ms) VALUES (?, ?, ?, ?)', [id, challenge, appState, config.now() + 10 * 60_000]);
      // Obtain and submit Auth.js's own CSRF token; Auth.js also owns provider state and PKCE.
      const csrf = await Auth(new Request(`${origin}/auth/csrf`, { headers: request.headers }), options);
      const csrfBody = await csrf.json() as { csrfToken?: string };
      if (!csrfBody.csrfToken) return fail();
      const csrfCookies = csrf.headers.getSetCookie();
      const headers = new Headers(request.headers);
      headers.set('content-type', 'application/x-www-form-urlencoded');
      headers.set('cookie', [request.headers.get('cookie'), ...csrfCookies.map(cookie => cookie.split(';')[0])].filter(Boolean).join('; '));
      headers.delete('content-length');
      const response = await Auth(new Request(`${origin}/auth/signin/github`, { method: 'POST', headers, body: new URLSearchParams({ csrfToken: csrfBody.csrfToken, callbackUrl: `${origin}/auth/handoff?request=${id}` }) }), options);
      return appendCookies(response, [...csrfCookies, `${cookieName}=${id}; Path=/auth; HttpOnly; SameSite=Lax; Max-Age=600${url.protocol === 'https:' ? '; Secure' : ''}`]);
    }
    if (url.pathname === '/auth/callback/github' && request.method === 'GET') return Auth(request, options);
    if (url.pathname === '/auth/handoff' && request.method === 'GET') {
      const id = url.searchParams.get('request');
      if (!id || cookieValue(request, cookieName) !== id) return fail();
      const pending = await config.db.get<{ challenge: string; app_state: string }>('SELECT challenge, app_state FROM oauth_requests WHERE id = ? AND expires_ms > ?', [id, config.now()]);
      if (!pending) return fail();
      const authResponse = await Auth(new Request(`${origin}/auth/session`, { headers: request.headers }), options);
      const session = await authResponse.json() as { user?: { id?: string } };
      if (!session.user?.id) return fail();
      const code = randomToken();
      const codeHash = await hash(code);
      await config.db.batch([
        { sql: 'INSERT INTO handoffs(code_hash, user_id, challenge, app_state, expires_ms) SELECT ?, ?, challenge, app_state, ? FROM oauth_requests WHERE id = ? AND expires_ms > ?', values: [codeHash, session.user.id, config.now() + 60_000, id, config.now()] },
        { sql: 'DELETE FROM oauth_requests WHERE id = ?', values: [id] },
      ]);
      const destination = new URL(config.appOrigin);
      destination.searchParams.set('auth_code', code);
      destination.searchParams.set('auth_state', pending.app_state);
      return appendCookies(Response.redirect(destination, 303), [...authResponse.headers.getSetCookie(), `${cookieName}=; Path=/auth; HttpOnly; SameSite=Lax; Max-Age=0`]);
    }
    return undefined;
  } };
}
