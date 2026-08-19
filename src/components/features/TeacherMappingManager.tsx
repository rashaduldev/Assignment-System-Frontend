'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import {
  useTeacherAssignments,
  useCreateTeacherAssignment,
  useDeleteTeacherAssignment,
} from '@/hooks/useAdminData';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Label, Select, FieldError } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import { idOf, nameOf } from '@/lib/populated';
import type { ClassCourse, Subject, TeacherAssignment, User } from '@/types';

const schema = z.object({
  teacher: z.string().min(1, 'Select a teacher'),
  classCourse: z.string().min(1, 'Select a class'),
  subject: z.string().min(1, 'Select a subject'),
});
type FormValues = z.infer<typeof schema>;

export function TeacherMappingManager({
  initialData,
  teachers,
  subjects,
  classes,
}: {
  initialData: TeacherAssignment[];
  teachers: User[];
  subjects: Subject[];
  classes: ClassCourse[];
}) {
  const { data: mappings = [] } = useTeacherAssignments(initialData);
  const createMutation = useCreateTeacherAssignment();
  const deleteMutation = useDeleteTeacherAssignment();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const selectedClass = watch('classCourse');
  const subjectsForClass = useMemo(
    () =>
      subjects.filter(
        (s) => idOf(s.classCourse as string | { _id: string }) === selectedClass
      ),
    [subjects, selectedClass]
  );

  const openNew = () => {
    reset({ teacher: '', classCourse: '', subject: '' });
    setOpen(true);
  };
  const close = () => setOpen(false);

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, { onSuccess: close });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openNew} disabled={teachers.length === 0 || subjects.length === 0}>
          <Plus size={16} /> New mapping
        </Button>
      </div>

      {(teachers.length === 0 || subjects.length === 0) && (
        <Alert tone="danger" className="mb-4">
          You need at least one teacher account and one subject before creating mappings.
        </Alert>
      )}

      {mappings.length === 0 ? (
        <EmptyState message="No teacher mappings yet." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Teacher</Th>
              <Th>Subject</Th>
              <Th>Class</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mappings.map((m) => (
              <Tr key={m._id}>
                <Td className="font-medium text-primary">{nameOf(m.teacher)}</Td>
                <Td>{nameOf(m.subject)}</Td>
                <Td>{nameOf(m.classCourse)}</Td>
                <Td>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm('Remove this mapping?')) deleteMutation.mutate(m._id);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal open={open} onClose={close} title="New teacher mapping">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {createMutation.isError && (
            <Alert tone="danger">{(createMutation.error as Error).message}</Alert>
          )}
          <div>
            <Label htmlFor="teacher">Teacher</Label>
            <Select id="teacher" {...register('teacher')}>
              <option value="">Select a teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </Select>
            <FieldError>{errors.teacher?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="classCourse">Class</Label>
            <Select id="classCourse" {...register('classCourse')}>
              <option value="">Select a class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.section ? `${c.name} - ${c.section}` : c.name}
                </option>
              ))}
            </Select>
            <FieldError>{errors.classCourse?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select id="subject" {...register('subject')} disabled={!selectedClass}>
              <option value="">Select a subject</option>
              {subjectsForClass.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <FieldError>{errors.subject?.message}</FieldError>
          </div>
          <Button type="submit" className="w-full" isLoading={createMutation.isPending}>
            Create mapping
          </Button>
        </form>
      </Modal>
    </div>
  );
}
