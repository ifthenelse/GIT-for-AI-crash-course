import type { Session } from '@gitcourse/contracts';

const base = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public retryAfterMs = 0) { super(message); }
}
export async function request<T>(path: string, token?: string, body?: unknown, method?: string): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    method: method ?? (body === undefined ? 'GET' : 'POST'),
    headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}), cache: 'no-store',
  });
  const data = await response.json().catch(() => null) as { error?: { code?: string; message?: string } } | null;
  if (!response.ok) {
    const after = response.headers.get('Retry-After');
    const retryAfterMs = after ? (/^\d+$/.test(after) ? Number(after) * 1000 : Math.max(0, Date.parse(after) - Date.now())) : 0;
    throw new ApiError(response.status, data?.error?.code ?? 'request_failed', data?.error?.message ?? 'Request failed', retryAfterMs);
  }
  return data as T;
}
function base64url(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
export async function beginOAuth(authorizeUrl: string) {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const state = base64url(crypto.getRandomValues(new Uint8Array(24)));
  const challenge = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
  sessionStorage.setItem('gitcourse:oauth', JSON.stringify({ verifier, state }));
  const url = new URL(authorizeUrl, base || location.origin);
  url.searchParams.set('code_challenge', challenge); url.searchParams.set('state', state);
  location.assign(url.toString());
}
export async function exchangeOAuth(): Promise<Session | null> {
  const url = new URL(location.href);
  const code = url.searchParams.get('auth_code'); const state = url.searchParams.get('auth_state'); const error = url.searchParams.get('auth_error');
  if (!code && !error) return null;
  url.searchParams.delete('auth_code'); url.searchParams.delete('auth_state'); url.searchParams.delete('auth_error');
  history.replaceState(history.state, '', url.toString());
  const saved = sessionStorage.getItem('gitcourse:oauth'); sessionStorage.removeItem('gitcourse:oauth');
  if (error || !saved) throw new Error('oauth_failed');
  const challenge = JSON.parse(saved) as { verifier: string; state: string };
  if (!state || state !== challenge.state || !code) throw new Error('oauth_failed');
  return request<Session>('/auth/exchange', undefined, { code, codeVerifier: challenge.verifier, state });
}
