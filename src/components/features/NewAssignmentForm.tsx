'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCreateAssignment } from '@/hooks/useAssignments';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea, FieldError } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import { idOf, nameOf } from '@/lib/populated';
import type { TeacherAssignment, ClassCourse, Subject } from '@/types';

const schema = z.object({
  classCourse: z.string().min(1, 'Select a class'),
  subject: z.string().min(1, 'Select a subject'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Please add a short description'),
  deadline: z.string().min(1, 'Deadline is required'),
  maxMarks: z.coerce.number().min(1, 'Must be at least 1'),
  allowResubmission: z.boolean(),
  status: z.enum(['draft', 'published']),
});

type FormValues = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function NewAssignmentForm({ mappings }: { mappings: TeacherAssignment[] }) {
  const router = useRouter();
  const createMutation = useCreateAssignment();
  const [selectedClass, setSelectedClass] = useState('');

  const classOptions = useMemo(() => {
    const seen = new Map<string, string>();
    mappings.forEach((m) => {
      const cc = m.classCourse as ClassCourse;
      seen.set(idOf(m.classCourse as string | { _id: string }), nameOf(cc));
    });
    return Array.from(seen.entries());
  }, [mappings]);

  const subjectOptions = useMemo(() => {
    return mappings
      .filter((m) => idOf(m.classCourse as string | { _id: string }) === selectedClass)
      .map((m) => [idOf(m.subject as string | { _id: string }), nameOf(m.subject as Subject | string)] as const);
  }, [mappings, selectedClass]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { allowResubmission: true, status: 'draft' },
  });

  const submitWithStatus = (status: 'draft' | 'published') =>
    handleSubmit((values: FormOutput) => {
      createMutation.mutate(
        { ...values, status, deadline: new Date(values.deadline).toISOString() },
        { onSuccess: () => router.push('/teacher/assignments') }
      );
    });

  if (mappings.length === 0) {
    return (
      <Alert tone="danger">
        You are not yet assigned to teach any subject/class. Ask an admin to map you to one
        before creating assignments.
      </Alert>
    );
  }

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {createMutation.isError && (
        <Alert tone="danger">{(createMutation.error as Error).message}</Alert>
      )}

      <div>
        <Label htmlFor="classCourse">Class</Label>
        <Select
          id="classCourse"
          {...register('classCourse')}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select a class</option>
          {classOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
        <FieldError>{errors.classCourse?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Select id="subject" {...register('subject')} disabled={!selectedClass}>
          <option value="">Select a subject</option>
          {subjectOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
        <FieldError>{errors.subject?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
        <FieldError>{errors.title?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        <FieldError>{errors.description?.message}</FieldError>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="datetime-local" {...register('deadline')} />
          <FieldError>{errors.deadline?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="maxMarks">Max marks</Label>
          <Input id="maxMarks" type="number" min={1} {...register('maxMarks')} />
          <FieldError>{errors.maxMarks?.message}</FieldError>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-primary/85">
        <input type="checkbox" {...register('allowResubmission')} className="h-4 w-4" />
        Allow students to resubmit before the deadline
      </label>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          isLoading={createMutation.isPending}
          onClick={submitWithStatus('draft')}
        >
          Save as draft
        </Button>
        <Button type="button" isLoading={createMutation.isPending} onClick={submitWithStatus('published')}>
          Publish now
        </Button>
      </div>
    </form>
  );
}
