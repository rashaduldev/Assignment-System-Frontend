'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateAssignment } from '@/hooks/useAssignments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea, FieldError } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import type { Assignment } from '@/types';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  deadline: z.string().min(1),
  maxMarks: z.coerce.number().min(1),
  allowResubmission: z.boolean(),
  status: z.enum(['draft', 'published']),
});

type FormValues = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditAssignmentPanel({ assignment }: { assignment: Assignment }) {
  const updateMutation = useUpdateAssignment();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: assignment.title,
      description: assignment.description,
      deadline: toLocalInput(assignment.deadline),
      maxMarks: assignment.maxMarks,
      allowResubmission: assignment.allowResubmission,
      status: assignment.status,
    },
  });

  const onSubmit = (values: FormOutput) => {
    updateMutation.mutate({
      id: assignment._id,
      input: { ...values, deadline: new Date(values.deadline).toISOString() },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {updateMutation.isError && (
            <Alert tone="danger">{(updateMutation.error as Error).message}</Alert>
          )}
          {updateMutation.isSuccess && <Alert tone="ok">Assignment updated.</Alert>}

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

          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </div>

          <label className="flex items-center gap-2 text-sm text-primary/85">
            <input type="checkbox" {...register('allowResubmission')} className="h-4 w-4" />
            Allow students to resubmit before the deadline
          </label>

          <Button type="submit" isLoading={updateMutation.isPending} disabled={!isDirty}>
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
