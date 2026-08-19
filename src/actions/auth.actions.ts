'use server';

import { apiFetch, ApiClientError } from '@/lib/api-client';
import { setSession, clearSession } from '@/lib/session';
import { getSessionUser } from '@/lib/auth';
import type { LoginResponse, User } from '@/types';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function loginAction(email: string, password: string): Promise<ActionResult<User>> {
  try {
    const result = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      skipAuth: true,
    });

    await setSession(result.accessToken, result.refreshToken);
    return { success: true, data: result.user };
  } catch (err) {
    if (err instanceof ApiClientError) {
      return { success: false, error: err.message };
    }
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function logoutAction(): Promise<void> {
  await clearSession();
}

export async function getCurrentUserAction(): Promise<User | null> {
  return getSessionUser();
}
