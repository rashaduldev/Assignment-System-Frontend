import { getAssignment } from '@/actions/assignment.actions';
import { getSubmissionsForAssignment } from '@/actions/submission.actions';
import { GradingTable } from '@/components/features/GradingTable';

export default async function AssignmentSubmissionsPage({
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
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">{assignment.title}</h1>
        <p className="mb-6 text-sm text-primary/65">
          Max marks: {assignment.maxMarks} · Deadline{' '}
          {new Date(assignment.deadline).toLocaleString()}
        </p>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <GradingTable assignmentId={id} maxMarks={assignment.maxMarks} initialData={submissions} />
      </div>
    </div>
  );
}
