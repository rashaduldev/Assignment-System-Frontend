'use client';

import Link from 'next/link';
import { useMySubmissions } from '@/hooks/useSubmissions';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { assignmentRef } from '@/lib/populated';
import type { Submission } from '@/types';

export function MySubmissionsList({ initialData }: { initialData: Submission[] }) {
  const { data: submissions = [] } = useMySubmissions(initialData);

  if (submissions.length === 0) {
    return <EmptyState message="You haven't submitted anything yet." />;
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Assignment</Th>
          <Th>Submitted</Th>
          <Th>Status</Th>
          <Th>Marks</Th>
          <Th>Feedback</Th>
        </Tr>
      </Thead>
      <Tbody>
        {submissions.map((s) => {
          const { id, title } = assignmentRef(s.assignment);
          return (
            <Tr key={s._id}>
              <Td className="font-medium text-primary">
                <Link href={`/student/assignments/${id}`} className="hover:underline">
                  {title}
                </Link>
              </Td>
              <Td>{formatDateTime(s.submittedAt)}</Td>
              <Td>
                <StatusBadge status={s.status} />
              </Td>
              <Td>{s.marks ?? '—'}</Td>
              <Td className="max-w-xs text-primary/75">{s.feedback ?? '—'}</Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
