'use server';

import { apiFetch } from '@/lib/api-client';
import type { AssignmentSubmissionProgress, Submission, SubmissionStatus } from '@/types';

export async function getMySubmissions(): Promise<Submission[]> {
  return apiFetch<Submission[]>('/submissions/mine');
}

export async function getSubmissionsForAssignment(assignmentId: string): Promise<Submission[]> {
  return apiFetch<Submission[]>(`/submissions/assignment/${assignmentId}`);
}

export async function getAssignmentSubmissionProgress(assignmentId: string): Promise<AssignmentSubmissionProgress[]> {
  return apiFetch<AssignmentSubmissionProgress[]>(`/submissions/assignment/${assignmentId}/progress`);
}

export async function submitAnswer(
  assignmentId: string,
  input: { answerText?: string; fileUrl?: string }
): Promise<Submission> {
  return apiFetch<Submission>(`/submissions/assignment/${assignmentId}`, {
    method: 'POST',
    body: input,
  });
}

export async function gradeSubmission(
  submissionId: string,
  input: { marks: number; feedback?: string }
): Promise<Submission> {
  return apiFetch<Submission>(`/submissions/${submissionId}/grade`, {
    method: 'PATCH',
    body: input,
  });
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: SubmissionStatus
): Promise<Submission> {
  return apiFetch<Submission>(`/submissions/${submissionId}/status`, {
    method: 'PATCH',
    body: { status },
  });
}
