import 'server-only';
import { getAccessToken, getRefreshToken, setSession, clearSession } from './session';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:5000/api/v1';
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Thrown for every failure this client produces — both real HTTP error
 * responses (4xx/5xx from the backend) and client-side failures (network
 * unreachable, timeout, malformed response) so callers only ever need to
 * handle one error type. `statusCode` is 0 for failures that never got an
 * HTTP response at all, which lets the UI distinguish "the server said no"
 * from "we couldn't reach the server."
 */
export class ApiClientError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.details = details;
  }

  get isNetworkError() {
    return this.statusCode === 0;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Explicit token override — used only by the auth actions during refresh. */
  token?: string;
  /** Skip attaching any Authorization header (e.g. the login call itself). */
  skipAuth?: boolean;
  cache?: RequestCache;
}

/**
 * Every backend call in the app goes through this function. It attaches the
 * bearer token from the session cookie, normalizes the `{ success, message,
 * data }` response envelope, retries once with a refreshed token on 401,
 * enforces a request timeout, and converts every possible failure mode
 * (HTTP error, network failure, timeout, malformed JSON) into a single
 * `ApiClientError` so callers never need to guard against raw exceptions.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.skipAuth ? undefined : (options.token ?? (await getAccessToken()));

  let res: Response;
  try {
    res = await doFetch(path, options, token);
  } catch (err) {
    throw toNetworkError(err);
  }

  if (res.status === 401 && !options.skipAuth && !options.token) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      let retryRes: Response;
      try {
        retryRes = await doFetch(path, options, refreshed);
      } catch (err) {
        throw toNetworkError(err);
      }
      return parseOrThrow<T>(retryRes);
    }
    await clearSession();
  }

  return parseOrThrow<T>(res);
}

function doFetch(path: string, options: RequestOptions, token?: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  return fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? 'no-store',
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
}

async function parseOrThrow<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      json?.message ?? `Request failed with status ${res.status}`,
      json?.error
    );
  }

  if (json === null) {
    throw new ApiClientError(res.status, 'The server returned an unreadable response');
  }

  return json.data as T;
}

/** Normalizes fetch-level failures (network down, DNS, timeout/abort) into ApiClientError. */
function toNetworkError(err: unknown): ApiClientError {
  if (err instanceof Error && err.name === 'AbortError') {
    return new ApiClientError(0, 'The request took too long and timed out. Please try again.');
  }
  return new ApiClientError(0, "Couldn't reach the server. Please check your connection and try again.");
}

async function tryRefresh(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    await setSession(json.data.accessToken, json.data.refreshToken);
    return json.data.accessToken as string;
  } catch {
    return null;
  }
}
