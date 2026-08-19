import { getAssignments } from '@/actions/assignment.actions';
import { StudentAssignmentsList } from '@/components/features/StudentAssignmentsList';

export default async function StudentAssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <div>
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">Assignments</h1>
        <p className="mb-6 text-sm text-primary/65">Assignments published for your class.</p>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <StudentAssignmentsList initialData={assignments} />
      </div>
    </div>
  );
}
