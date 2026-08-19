'use client';

import Link from 'next/link';
import { useAssignments, useDeleteAssignment, useUpdateAssignment } from '@/hooks/useAssignments';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateTime, isPast } from '@/lib/utils';
import { nameOf } from '@/lib/populated';
import type { Assignment } from '@/types';

export function TeacherAssignmentsList({ initialData }: { initialData: Assignment[] }) {
  const { data: assignments = [] } = useAssignments(initialData);
  const updateMutation = useUpdateAssignment();
  const deleteMutation = useDeleteAssignment();

  if (assignments.length === 0) {
    return <EmptyState message="You haven't created any assignments yet." />;
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Subject / Class</Th>
          <Th>Deadline</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {assignments.map((a) => (
          <Tr key={a._id}>
            <Td className="font-medium text-primary">
              <Link href={`/teacher/assignments/${a._id}`} className="hover:underline">
                {a.title}
              </Link>
            </Td>
            <Td>
              {nameOf(a.subject)} · {nameOf(a.classCourse)}
            </Td>
            <Td className={isPast(a.deadline) ? 'text-danger' : undefined}>
              {formatDateTime(a.deadline)}
            </Td>
            <Td>
              <StatusBadge status={a.status} />
            </Td>
            <Td>
              <div className="flex gap-2">
                {a.status === 'draft' && (
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={updateMutation.isPending}
                    onClick={() =>
                      updateMutation.mutate({ id: a._id, input: { status: 'published' } })
                    }
                  >
                    Publish
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Delete "${a.title}"? This cannot be undone.`)) {
                      deleteMutation.mutate(a._id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
