'use client';

import Link from 'next/link';
import { useAssignments } from '@/hooks/useAssignments';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime, isPast } from '@/lib/utils';
import { nameOf } from '@/lib/populated';
import type { Assignment } from '@/types';

export function StudentAssignmentsList({ initialData }: { initialData: Assignment[] }) {
  const { data: assignments = [] } = useAssignments(initialData);

  if (assignments.length === 0) {
    return <EmptyState message="No assignments have been published for your class yet." />;
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Subject</Th>
          <Th>Deadline</Th>
          <Th>Max marks</Th>
        </Tr>
      </Thead>
      <Tbody>
        {assignments.map((a) => {
          const overdue = isPast(a.deadline);
          return (
            <Tr key={a._id}>
              <Td className="font-medium text-primary">
                <Link href={`/student/assignments/${a._id}`} className="hover:underline">
                  {a.title}
                </Link>
              </Td>
              <Td>{nameOf(a.subject)}</Td>
              <Td>
                <span className={overdue ? 'text-danger' : undefined}>
                  {formatDateTime(a.deadline)}
                </span>
                {overdue && (
                  <Badge tone="danger" className="ml-2">
                    Closed
                  </Badge>
                )}
              </Td>
              <Td>{a.maxMarks}</Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
