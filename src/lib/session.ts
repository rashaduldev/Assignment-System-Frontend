import 'server-only';
import { cookies } from 'next/headers';

const ACCESS_COOKIE = 'as_access_token';
const REFRESH_COOKIE = 'as_refresh_token';

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function setSession(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, { ...baseCookieOptions, maxAge: 60 * 15 }); // 15 min
  store.set(REFRESH_COOKIE, refreshToken, { ...baseCookieOptions, maxAge: 60 * 60 * 24 * 7 }); // 7 days
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value;
}
