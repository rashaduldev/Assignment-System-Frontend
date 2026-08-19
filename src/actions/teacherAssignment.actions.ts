'use server';

import { apiFetch } from '@/lib/api-client';
import type { TeacherAssignment } from '@/types';

export async function getTeacherAssignments(): Promise<TeacherAssignment[]> {
  return apiFetch<TeacherAssignment[]>('/teacher-assignments');
}

export async function createTeacherAssignment(input: {
  teacher: string;
  subject: string;
  classCourse: string;
}): Promise<TeacherAssignment> {
  return apiFetch<TeacherAssignment>('/teacher-assignments', { method: 'POST', body: input });
}

export async function deleteTeacherAssignment(id: string): Promise<void> {
  await apiFetch<void>(`/teacher-assignments/${id}`, { method: 'DELETE' });
}
