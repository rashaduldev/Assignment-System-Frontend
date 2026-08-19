'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAssignments, useDeleteAssignment, useUpdateAssignment } from '@/hooks/useAssignments';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Field';
import { formatDateTime, isPast } from '@/lib/utils';
import { nameOf } from '@/lib/populated';
import type { Assignment } from '@/types';

export function TeacherAssignmentsList({ initialData }: { initialData: Assignment[] }) {
  const { data: assignments = [] } = useAssignments(initialData);
  const updateMutation = useUpdateAssignment();
  const deleteMutation = useDeleteAssignment();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all');
  const visibleAssignments = assignments.filter((assignment) => {
    const searchable = `${assignment.title} ${nameOf(assignment.subject)} ${nameOf(assignment.classCourse)}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (status === 'all' || assignment.status === status);
  });

  if (assignments.length === 0) {
    return <EmptyState message="You haven't created any assignments yet." />;
  }

  return (<>
    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_10rem]">
      <div className="relative"><Search size={16} className="absolute left-3 top-2.5 text-primary/40" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, subject, or class" className="pl-9" /></div>
      <Select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option></Select>
    </div>
    {visibleAssignments.length === 0 ? <EmptyState message="No assignments match your filters." /> : <Table>
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
        {visibleAssignments.map((a) => (
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
    </Table>}
  </>);
}
