'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from '@/hooks/useAdminData';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Label, Select, FieldError } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import { classLabel } from '@/lib/populated';
import type { ClassCourse, Subject } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  classCourse: z.string().min(1, 'Select a class'),
});
type FormValues = z.infer<typeof schema>;

export function SubjectsManager({
  initialData,
  classes,
}: {
  initialData: Subject[];
  classes: ClassCourse[];
}) {
  const { data: subjects = [] } = useSubjects(undefined, initialData);
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();
  const [editing, setEditing] = useState<Subject | 'new' | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const openNew = () => {
    reset({ name: '', classCourse: '' });
    setEditing('new');
  };
  const openEdit = (s: Subject) => {
    reset({ name: s.name, classCourse: typeof s.classCourse === 'string' ? s.classCourse : s.classCourse._id });
    setEditing(s);
  };
  const close = () => setEditing(null);

  const onSubmit = (values: FormValues) => {
    if (editing === 'new') {
      createMutation.mutate(values, { onSuccess: close });
    } else if (editing) {
      updateMutation.mutate({ id: editing._id, input: values }, { onSuccess: close });
    }
  };

  const mutation = editing === 'new' ? createMutation : updateMutation;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openNew} disabled={classes.length === 0}>
          <Plus size={16} /> New subject
        </Button>
      </div>

      {classes.length === 0 && (
        <Alert tone="danger" className="mb-4">
          Create at least one class before adding subjects.
        </Alert>
      )}

      {subjects.length === 0 ? (
        <EmptyState message="No subjects yet." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Class</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subjects.map((s) => (
              <Tr key={s._id}>
                <Td className="font-medium text-primary">{s.name}</Td>
                <Td>{classLabel(s.classCourse)}</Td>
                <Td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete "${s.name}"?`)) deleteMutation.mutate(s._id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal open={editing !== null} onClose={close} title={editing === 'new' ? 'New subject' : 'Edit subject'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mutation.isError && <Alert tone="danger">{(mutation.error as Error).message}</Alert>}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Mathematics" {...register('name')} />
            <FieldError>{errors.name?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="classCourse">Class</Label>
            <Select id="classCourse" {...register('classCourse')}>
              <option value="">Select a class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {classLabel(c)}
                </option>
              ))}
            </Select>
            <FieldError>{errors.classCourse?.message}</FieldError>
          </div>
          <Button type="submit" className="w-full" isLoading={mutation.isPending}>
            {editing === 'new' ? 'Create' : 'Save changes'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
