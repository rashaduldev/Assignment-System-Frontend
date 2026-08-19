import { getAssignments } from '@/actions/assignment.actions';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { nameOf } from '@/lib/populated';

export default async function AdminAssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <div>
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">All Assignments</h1>
        <p className="mb-6 text-sm text-primary/65">System-wide view across every teacher and class.</p>
      </div>

      {assignments.length === 0 ? (
        <EmptyState message="No assignments have been created yet." />
      ) : (
        <div data-aos="fade-up" data-aos-delay="100">
        <Table>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Teacher</Th>
              <Th>Subject / Class</Th>
              <Th>Deadline</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assignments.map((a) => (
              <Tr key={a._id}>
                <Td className="font-medium text-primary">{a.title}</Td>
                <Td>{nameOf(a.teacher)}</Td>
                <Td>
                  {nameOf(a.subject)} · {nameOf(a.classCourse)}
                </Td>
                <Td>{formatDateTime(a.deadline)}</Td>
                <Td>
                  <StatusBadge status={a.status} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        </div>
      )}
    </div>
  );
}
