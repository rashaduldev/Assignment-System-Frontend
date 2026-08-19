'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Search, Trash2 } from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useAdminData';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Label, Select, FieldError } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import { classLabel } from '@/lib/populated';
import type { ClassCourse, User } from '@/types';

const createSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
  role: z.enum(['admin', 'teacher', 'student']),
  classCourse: z.string().optional(),
});
const editSchema = createSchema.omit({ password: true }).extend({
  isActive: z.boolean(),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

const roleTone = { admin: 'gold', teacher: 'ok', student: 'neutral' } as const;

export function UsersManager({ initialData, classes, roleFilter }: { initialData: User[]; classes: ClassCourse[]; roleFilter?: User['role'] }) {
  const { data: users = [] } = useUsers(roleFilter, initialData);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const [editing, setEditing] = useState<User | 'new' | null>(null);
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: 'student' },
  });
  const editForm = useForm<EditValues>({ resolver: zodResolver(editSchema) });

  const role = editing === 'new' ? createForm.watch('role') : editForm.watch('role');

  const openNew = () => {
    createForm.reset({ name: '', email: '', password: '', role: roleFilter ?? 'student', classCourse: '' });
    setEditing('new');
  };
  const openEdit = (u: User) => {
    editForm.reset({
      name: u.name,
      email: u.email,
      role: u.role,
      classCourse: typeof u.classCourse === 'string' ? u.classCourse : u.classCourse?._id ?? '',
      isActive: u.isActive,
    });
    setEditing(u);
  };
  const close = () => setEditing(null);

  const onCreate = (values: CreateValues) => createMutation.mutate(values, { onSuccess: close });
  const onEdit = (values: EditValues) => {
    if (editing === 'new' || !editing) return;
    updateMutation.mutate({ id: editing._id, input: values }, { onSuccess: close });
  };

  const mutation = editing === 'new' ? createMutation : updateMutation;
  const visibleUsers = users.filter((user) => {
    const matchesText = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
    const userClass = typeof user.classCourse === 'string' ? user.classCourse : user.classCourse?._id;
    return matchesText && (!classFilter || userClass === classFilter);
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openNew}>
          <Plus size={16} /> New user
        </Button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="relative"><Search size={16} className="absolute left-3 top-2.5 text-primary/40" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or email" className="pl-9" /></div>
        <Select value={classFilter} onChange={(event) => setClassFilter(event.target.value)}><option value="">All classes</option>{classes.map((c) => <option key={c._id} value={c._id}>{classLabel(c)}</option>)}</Select>
      </div>

      {visibleUsers.length === 0 ? (
        <EmptyState message="No users yet." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Class</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {visibleUsers.map((u) => (
              <Tr key={u._id}>
                <Td className="font-medium text-primary">{u.name}</Td>
                <Td>{u.email}</Td>
                <Td>
                  <Badge tone={roleTone[u.role]}>{u.role}</Badge>
                </Td>
                <Td>{u.role === 'student' && u.classCourse ? classLabel(u.classCourse) : '—'}</Td>
                <Td>
                  <Badge tone={u.isActive ? 'ok' : 'danger'}>
                    {u.isActive ? 'active' : 'inactive'}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(u)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete "${u.name}"?`)) deleteMutation.mutate(u._id);
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

      <Modal open={editing !== null} onClose={close} title={editing === 'new' ? 'New user' : 'Edit user'}>
        {editing === 'new' ? (
          <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-4">
            {mutation.isError && <Alert tone="danger">{(mutation.error as Error).message}</Alert>}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...createForm.register('name')} />
              <FieldError>{createForm.formState.errors.name?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...createForm.register('email')} />
              <FieldError>{createForm.formState.errors.email?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...createForm.register('password')} />
              <FieldError>{createForm.formState.errors.password?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select id="role" {...createForm.register('role')}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
            {role === 'student' && (
              <div>
                <Label htmlFor="classCourse">Class</Label>
                <Select id="classCourse" {...createForm.register('classCourse')}>
                  <option value="">Select a class</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {classLabel(c)}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <Button type="submit" className="w-full" isLoading={mutation.isPending}>
              Create user
            </Button>
          </form>
        ) : (
          <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
            {mutation.isError && <Alert tone="danger">{(mutation.error as Error).message}</Alert>}
            <div>
              <Label htmlFor="e-name">Name</Label>
              <Input id="e-name" {...editForm.register('name')} />
            </div>
            <div>
              <Label htmlFor="e-email">Email</Label>
              <Input id="e-email" type="email" {...editForm.register('email')} />
            </div>
            <div>
              <Label htmlFor="e-role">Role</Label>
              <Select id="e-role" {...editForm.register('role')}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
            {role === 'student' && (
              <div>
                <Label htmlFor="e-classCourse">Class</Label>
                <Select id="e-classCourse" {...editForm.register('classCourse')}>
                  <option value="">Select a class</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {classLabel(c)}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-primary/85">
              <input type="checkbox" className="h-4 w-4" {...editForm.register('isActive')} />
              Active account
            </label>
            <Button type="submit" className="w-full" isLoading={mutation.isPending}>
              Save changes
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
