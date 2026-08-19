'use client';

import { useState } from 'react';
import { useAssignmentSubmissions, useGradeSubmission } from '@/hooks/useSubmissions';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import { formatDateTime } from '@/lib/utils';
import { userName } from '@/lib/populated';
import type { Submission } from '@/types';

function GradeRow({ submission, maxMarks, assignmentId }: { submission: Submission; maxMarks: number; assignmentId: string }) {
  const gradeMutation = useGradeSubmission(assignmentId);
  const [marks, setMarks] = useState(submission.marks?.toString() ?? '');
  const [feedback, setFeedback] = useState(submission.feedback ?? '');
  const error = gradeMutation.isError ? (gradeMutation.error as Error).message : undefined;

  return (
    <Tr>
      <Td className="font-medium text-primary">{userName(submission.student)}</Td>
      <Td>{formatDateTime(submission.submittedAt)}</Td>
      <Td className="max-w-xs whitespace-pre-wrap text-primary/75">
        {submission.answerText || (
          <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="text-primary/65 underline">
            View file
          </a>
        )}
      </Td>
      <Td>
        <StatusBadge status={submission.status} />
      </Td>
      <Td>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={maxMarks}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="w-20"
            />
            <span className="text-xs text-primary/50">/ {maxMarks}</span>
          </div>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Feedback (optional)"
            className="min-h-16 w-56 text-xs"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <Button
            size="sm"
            isLoading={gradeMutation.isPending}
            onClick={() =>
              gradeMutation.mutate({
                id: submission._id,
                input: { marks: Number(marks), feedback: feedback || undefined },
              })
            }
          >
            Save grade
          </Button>
        </div>
      </Td>
    </Tr>
  );
}

export function GradingTable({
  assignmentId,
  maxMarks,
  initialData,
}: {
  assignmentId: string;
  maxMarks: number;
  initialData: Submission[];
}) {
  const { data: submissions = [] } = useAssignmentSubmissions(assignmentId, initialData);

  if (submissions.length === 0) {
    return <EmptyState message="No submissions yet." />;
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Student</Th>
          <Th>Submitted</Th>
          <Th>Answer</Th>
          <Th>Status</Th>
          <Th>Grade</Th>
        </Tr>
      </Thead>
      <Tbody>
        {submissions.map((s) => (
          <GradeRow key={s._id} submission={s} maxMarks={maxMarks} assignmentId={assignmentId} />
        ))}
      </Tbody>
    </Table>
  );
}
