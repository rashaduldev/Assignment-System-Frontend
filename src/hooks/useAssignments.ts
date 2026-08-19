'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
} from '@/actions/assignment.actions';
import { toast } from '@/lib/toast';
import type { Assignment } from '@/types';

const KEY = ['assignments'];

export function useAssignments(initialData?: Assignment[]) {
  return useQuery({ queryKey: KEY, queryFn: () => getAssignments(), initialData });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssignmentInput) => createAssignment(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success(data.status === 'published' ? 'Assignment published' : 'Draft saved');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAssignmentInput }) =>
      updateAssignment(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Assignment updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAssignment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Assignment deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
