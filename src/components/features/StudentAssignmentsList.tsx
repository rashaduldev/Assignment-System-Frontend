'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAssignments } from '@/hooks/useAssignments';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Field';
import { formatDateTime, isPast } from '@/lib/utils';
import { nameOf } from '@/lib/populated';
import type { Assignment } from '@/types';

export function StudentAssignmentsList({ initialData }: { initialData: Assignment[] }) {
  const { data: assignments = [] } = useAssignments(initialData);
  const [query, setQuery] = useState('');
  const visibleAssignments = assignments.filter((assignment) => `${assignment.title} ${nameOf(assignment.subject)}`.toLowerCase().includes(query.toLowerCase()));

  if (assignments.length === 0) {
    return <EmptyState message="No assignments have been published for your class yet." />;
  }

  return (<>
    <div className="relative mb-4 max-w-md"><Search size={16} className="absolute left-3 top-2.5 text-primary/40" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assignment or subject" className="pl-9" /></div>
    {visibleAssignments.length === 0 ? <EmptyState message="No assignments match your search." /> : <Table>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Subject</Th>
          <Th>Deadline</Th>
          <Th>Max marks</Th>
        </Tr>
      </Thead>
      <Tbody>
        {visibleAssignments.map((a) => {
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
    </Table>}
  </>);
}
