'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass } from '@/hooks/useAdminData';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Label, FieldError } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import type { ClassCourse } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  section: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function ClassesManager({ initialData }: { initialData: ClassCourse[] }) {
  const { data: classes = [] } = useClasses(initialData);
  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();
  const [editing, setEditing] = useState<ClassCourse | 'new' | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const openNew = () => {
    reset({ name: '', section: '' });
    setEditing('new');
  };
  const openEdit = (c: ClassCourse) => {
    reset({ name: c.name, section: c.section ?? '' });
    setEditing(c);
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
        <Button onClick={openNew}>
          <Plus size={16} /> New class
        </Button>
      </div>

      {classes.length === 0 ? (
        <EmptyState message="No classes yet." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Section</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {classes.map((c) => (
              <Tr key={c._id}>
                <Td className="font-medium text-primary">{c.name}</Td>
                <Td>{c.section ?? '—'}</Td>
                <Td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete "${c.name}"?`)) deleteMutation.mutate(c._id);
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

      <Modal open={editing !== null} onClose={close} title={editing === 'new' ? 'New class' : 'Edit class'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mutation.isError && <Alert tone="danger">{(mutation.error as Error).message}</Alert>}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Class 10" {...register('name')} />
            <FieldError>{errors.name?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="section">Section (optional)</Label>
            <Input id="section" placeholder="A" {...register('section')} />
          </div>
          <Button type="submit" className="w-full" isLoading={mutation.isPending}>
            {editing === 'new' ? 'Create' : 'Save changes'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
