'use server';

import { apiFetch } from '@/lib/api-client';
import type { Subject } from '@/types';

export async function getSubjects(classCourseId?: string): Promise<Subject[]> {
  const query = classCourseId ? `?classCourse=${classCourseId}` : '';
  return apiFetch<Subject[]>(`/subjects${query}`);
}

export async function createSubject(input: { name: string; classCourse: string }): Promise<Subject> {
  return apiFetch<Subject>('/subjects', { method: 'POST', body: input });
}

export async function updateSubject(
  id: string,
  input: Partial<{ name: string; classCourse: string }>
): Promise<Subject> {
  return apiFetch<Subject>(`/subjects/${id}`, { method: 'PATCH', body: input });
}

export async function deleteSubject(id: string): Promise<void> {
  await apiFetch<void>(`/subjects/${id}`, { method: 'DELETE' });
}
