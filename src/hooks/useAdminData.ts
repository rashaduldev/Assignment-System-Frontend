'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getClasses, createClass, updateClass, deleteClass } from '@/actions/class.actions';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '@/actions/subject.actions';
import {
  getTeacherAssignments,
  createTeacherAssignment,
  deleteTeacherAssignment,
} from '@/actions/teacherAssignment.actions';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type CreateUserInput,
  type UpdateUserInput,
} from '@/actions/user.actions';
import { toast } from '@/lib/toast';
import type { ClassCourse, Subject, TeacherAssignment, User } from '@/types';

function onErr(err: Error) {
  toast.error(err.message);
}

// ----- Classes -----
export function useClasses(initialData?: ClassCourse[]) {
  return useQuery({ queryKey: ['classes'], queryFn: () => getClasses(), initialData });
}
export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; section?: string }) => createClass(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class created');
    },
    onError: onErr,
  });
}
export function useUpdateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<{ name: string; section: string }> }) =>
      updateClass(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class updated');
    },
    onError: onErr,
  });
}
export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClass(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class deleted');
    },
    onError: onErr,
  });
}

// ----- Subjects -----
export function useSubjects(classCourseId?: string, initialData?: Subject[]) {
  return useQuery({
    queryKey: ['subjects', classCourseId ?? 'all'],
    queryFn: () => getSubjects(classCourseId),
    initialData,
  });
}
export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; classCourse: string }) => createSubject(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject created');
    },
    onError: onErr,
  });
}
export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<{ name: string; classCourse: string }> }) =>
      updateSubject(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject updated');
    },
    onError: onErr,
  });
}
export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject deleted');
    },
    onError: onErr,
  });
}

// ----- Teacher Assignments (mappings) -----
export function useTeacherAssignments(initialData?: TeacherAssignment[]) {
  return useQuery({
    queryKey: ['teacher-assignments'],
    queryFn: () => getTeacherAssignments(),
    initialData,
  });
}
export function useCreateTeacherAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { teacher: string; subject: string; classCourse: string }) =>
      createTeacherAssignment(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-assignments'] });
      toast.success('Mapping created');
    },
    onError: onErr,
  });
}
export function useDeleteTeacherAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeacherAssignment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-assignments'] });
      toast.success('Mapping removed');
    },
    onError: onErr,
  });
}

// ----- Users -----
export function useUsers(initialData?: User[]) {
  return useQuery({ queryKey: ['users'], queryFn: () => getUsers(), initialData });
}
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created');
    },
    onError: onErr,
  });
}
export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) => updateUser(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated');
    },
    onError: onErr,
  });
}
export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
    },
    onError: onErr,
  });
}
