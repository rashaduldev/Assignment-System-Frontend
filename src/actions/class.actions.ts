'use server';

import { apiFetch } from '@/lib/api-client';
import type { ClassCourse } from '@/types';

export async function getClasses(): Promise<ClassCourse[]> {
  return apiFetch<ClassCourse[]>('/classes');
}

export async function createClass(input: { name: string; section?: string }): Promise<ClassCourse> {
  return apiFetch<ClassCourse>('/classes', { method: 'POST', body: input });
}

export async function updateClass(
  id: string,
  input: Partial<{ name: string; section: string }>
): Promise<ClassCourse> {
  return apiFetch<ClassCourse>(`/classes/${id}`, { method: 'PATCH', body: input });
}

export async function deleteClass(id: string): Promise<void> {
  await apiFetch<void>(`/classes/${id}`, { method: 'DELETE' });
}
