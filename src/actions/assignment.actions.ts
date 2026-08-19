'use server';

import { apiFetch } from '@/lib/api-client';
import type { Assignment, AssignmentStatus } from '@/types';

export interface CreateAssignmentInput {
  title: string;
  description: string;
  subject: string;
  classCourse: string;
  deadline: string; // ISO string
  maxMarks: number;
  status?: AssignmentStatus;
  allowResubmission?: boolean;
}

export type UpdateAssignmentInput = Partial<CreateAssignmentInput>;

export async function getAssignments(): Promise<Assignment[]> {
  return apiFetch<Assignment[]>('/assignments');
}

export async function getAssignment(id: string): Promise<Assignment> {
  return apiFetch<Assignment>(`/assignments/${id}`);
}

export async function createAssignment(input: CreateAssignmentInput): Promise<Assignment> {
  return apiFetch<Assignment>('/assignments', { method: 'POST', body: input });
}

export async function updateAssignment(
  id: string,
  input: UpdateAssignmentInput
): Promise<Assignment> {
  return apiFetch<Assignment>(`/assignments/${id}`, { method: 'PATCH', body: input });
}

export async function deleteAssignment(id: string): Promise<void> {
  await apiFetch<void>(`/assignments/${id}`, { method: 'DELETE' });
}
