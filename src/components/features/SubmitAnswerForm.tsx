'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitAnswer } from '@/hooks/useSubmissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label, Textarea, FieldError } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import { StatusBadge } from '@/components/ui/Badge';
import type { Submission } from '@/types';

const schema = z.object({
  answerText: z.string().min(1, 'Write your answer before submitting'),
});
type FormValues = z.infer<typeof schema>;

export function SubmitAnswerForm({
  assignmentId,
  existing,
  deadlinePassed,
  allowResubmission,
}: {
  assignmentId: string;
  existing?: Submission;
  deadlinePassed: boolean;
  allowResubmission: boolean;
}) {
  const mutation = useSubmitAnswer(assignmentId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { answerText: existing?.answerText ?? '' },
  });

  const canEdit = !deadlinePassed && (!existing || allowResubmission);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{existing ? 'Your submission' : 'Submit your answer'}</CardTitle>
        {existing && <StatusBadge status={existing.status} />}
      </CardHeader>
      <CardContent>
        {deadlinePassed && !existing && (
          <Alert tone="danger">The deadline has passed. Submissions are closed.</Alert>
        )}
        {existing && !allowResubmission && (
          <Alert tone="ok" className="mb-4">
            Submitted on {new Date(existing.submittedAt).toLocaleString()}. Resubmission is not
            allowed for this assignment.
          </Alert>
        )}

        {canEdit ? (
          <form
            onSubmit={handleSubmit((values) =>
              mutation.mutate({ answerText: values.answerText })
            )}
            className="space-y-4"
          >
            {mutation.isError && <Alert tone="danger">{(mutation.error as Error).message}</Alert>}
            {mutation.isSuccess && <Alert tone="ok">Submitted successfully.</Alert>}

            <div>
              <Label htmlFor="answerText">Your answer</Label>
              <Textarea id="answerText" rows={8} {...register('answerText')} />
              <FieldError>{errors.answerText?.message}</FieldError>
            </div>

            <Button type="submit" isLoading={mutation.isPending}>
              {existing ? 'Update submission' : 'Submit'}
            </Button>
          </form>
        ) : (
          existing && (
            <p className="whitespace-pre-wrap text-sm text-primary/85">{existing.answerText}</p>
          )
        )}
      </CardContent>
    </Card>
  );
}
