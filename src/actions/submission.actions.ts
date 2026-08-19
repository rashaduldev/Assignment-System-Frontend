'use server';

import { apiFetch } from '@/lib/api-client';
import { getAccessToken } from '@/lib/session';
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

export async function uploadSubmissionPdf(file: File): Promise<string> {
  if (file.type !== 'application/pdf') throw new Error('Only PDF files are allowed');
  if (file.size > 10 * 1024 * 1024) throw new Error('PDF must be 10 MB or smaller');
  const token = await getAccessToken();
  const form = new FormData();
  form.append('file', file);
  const response = await fetch(`${process.env.API_BASE_URL ?? 'http://localhost:5000/api/v1'}/uploads/submission-pdf`, {
    method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form, cache: 'no-store',
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) throw new Error(json?.message ?? 'PDF upload failed');
  return json.data.url as string;
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
  input: { marks: number; feedback?: string; reviewedFileUrl?: string }
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
