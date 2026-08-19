import 'server-only';
import { cache } from 'react';
import { apiFetch } from './api-client';
import { getAccessToken } from './session';
import type { User } from '@/types';

/**
 * Wrapped in React's `cache()` so multiple layouts/pages in the same
 * request (e.g. (dashboard)/layout.tsx + admin/layout.tsx) can call this
 * without triggering duplicate network requests to the backend.
 */
export const getSessionUser = cache(async (): Promise<User | null> => {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    return await apiFetch<User>('/auth/me');
  } catch {
    return null;
  }
});
