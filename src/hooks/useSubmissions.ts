'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMySubmissions,
  getSubmissionsForAssignment,
  getAssignmentSubmissionProgress,
  submitAnswer,
  gradeSubmission,
  updateSubmissionStatus,
} from '@/actions/submission.actions';
import { toast } from '@/lib/toast';
import type { AssignmentSubmissionProgress, Submission, SubmissionStatus } from '@/types';

export function useMySubmissions(initialData?: Submission[]) {
  return useQuery({ queryKey: ['submissions', 'mine'], queryFn: () => getMySubmissions(), initialData });
}

export function useAssignmentSubmissions(assignmentId: string, initialData?: Submission[]) {
  return useQuery({
    queryKey: ['submissions', 'assignment', assignmentId],
    queryFn: () => getSubmissionsForAssignment(assignmentId),
    initialData,
  });
}

export function useAssignmentSubmissionProgress(assignmentId: string, initialData?: AssignmentSubmissionProgress[]) {
  return useQuery({
    queryKey: ['submissions', 'assignment', assignmentId, 'progress'],
    queryFn: () => getAssignmentSubmissionProgress(assignmentId),
    initialData,
  });
}

export function useSubmitAnswer(assignmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { answerText?: string; fileUrl?: string }) =>
      submitAnswer(assignmentId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['submissions', 'mine'] });
      qc.invalidateQueries({ queryKey: ['submissions', 'assignment', assignmentId] });
      qc.invalidateQueries({ queryKey: ['submissions', 'assignment', assignmentId, 'progress'] });
      toast.success('Submission saved');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useGradeSubmission(assignmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { marks: number; feedback?: string } }) =>
      gradeSubmission(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['submissions', 'assignment', assignmentId] });
      qc.invalidateQueries({ queryKey: ['submissions', 'assignment', assignmentId, 'progress'] });
      toast.success('Grade saved');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSubmissionStatus(assignmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SubmissionStatus }) =>
      updateSubmissionStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['submissions', 'assignment', assignmentId] });
      toast.success('Submission status updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
