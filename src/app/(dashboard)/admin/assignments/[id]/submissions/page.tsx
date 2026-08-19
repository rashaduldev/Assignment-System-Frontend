import { getAssignment } from '@/actions/assignment.actions';
import { getSubmissionsForAssignment } from '@/actions/submission.actions';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { userName } from '@/lib/populated';

export default async function AdminAssignmentSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [assignment, submissions] = await Promise.all([
    getAssignment(id),
    getSubmissionsForAssignment(id),
  ]);

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl text-primary">{assignment.title}</h1>
      <p className="mb-6 text-sm text-primary/65">Max marks: {assignment.maxMarks} (read-only view)</p>

      {submissions.length === 0 ? (
        <EmptyState message="No submissions yet." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Student</Th>
              <Th>Submitted</Th>
              <Th>Status</Th>
              <Th>Marks</Th>
              <Th>Feedback</Th>
            </Tr>
          </Thead>
          <Tbody>
            {submissions.map((s) => (
              <Tr key={s._id}>
                <Td className="font-medium text-primary">{userName(s.student)}</Td>
                <Td>{formatDateTime(s.submittedAt)}</Td>
                <Td>
                  <StatusBadge status={s.status} />
                </Td>
                <Td>{s.marks ?? '—'}</Td>
                <Td className="max-w-xs text-primary/75">{s.feedback ?? '—'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
