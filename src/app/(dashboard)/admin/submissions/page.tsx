import Link from 'next/link';
import { getAssignments } from '@/actions/assignment.actions';
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { nameOf } from '@/lib/populated';

export default async function AdminSubmissionsPage() {
  const assignments = await getAssignments();

  return (
    <div>
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">Submissions</h1>
        <p className="mb-6 text-sm text-primary/65">
          Pick an assignment to view its submissions across the system.
        </p>
      </div>

      {assignments.length === 0 ? (
        <EmptyState message="No assignments yet." />
      ) : (
        <div data-aos="fade-up" data-aos-delay="100">
        <Table>
          <Thead>
            <Tr>
              <Th>Assignment</Th>
              <Th>Teacher</Th>
              <Th>Class</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assignments.map((a) => (
              <Tr key={a._id}>
                <Td className="font-medium text-primary">
                  <Link href={`/admin/assignments/${a._id}/submissions`} className="hover:underline">
                    {a.title}
                  </Link>
                </Td>
                <Td>{nameOf(a.teacher)}</Td>
                <Td>{nameOf(a.classCourse)}</Td>
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
