import { getTeacherAssignments } from '@/actions/teacherAssignment.actions';
import { NewAssignmentForm } from '@/components/features/NewAssignmentForm';

export default async function NewAssignmentPage() {
  const mappings = await getTeacherAssignments();

  return (
    <div className="max-w-xl">
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">New Assignment</h1>
        <p className="mb-6 text-sm text-primary/65">
          You can only create assignments for subject/class pairs an admin has assigned to you.
        </p>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <NewAssignmentForm mappings={mappings} />
      </div>
    </div>
  );
}
