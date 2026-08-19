'use server';

import { apiFetch } from '@/lib/api-client';
import type { User, UserRole } from '@/types';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  classCourse?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  classCourse?: string;
  isActive?: boolean;
}

export async function getUsers(): Promise<User[]> {
  return apiFetch<User[]>('/users');
}

export async function createUser(input: CreateUserInput): Promise<User> {
  return apiFetch<User>('/users', { method: 'POST', body: input });
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  return apiFetch<User>(`/users/${id}`, { method: 'PATCH', body: input });
}

export async function deleteUser(id: string): Promise<void> {
  await apiFetch<void>(`/users/${id}`, { method: 'DELETE' });
}
