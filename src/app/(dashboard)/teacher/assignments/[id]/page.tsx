import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAssignment } from '@/actions/assignment.actions';
import { ApiClientError } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils';
import { nameOf } from '@/lib/populated';
import { EditAssignmentPanel } from '@/components/features/EditAssignmentPanel';

export default async function TeacherAssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let assignment;
  try {
    assignment = await getAssignment(id);
  } catch (err) {
    if (err instanceof ApiClientError && err.statusCode === 404) notFound();
    throw err;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between" data-aos="fade-down">
        <div>
          <h1 className="font-display text-2xl text-primary">{assignment.title}</h1>
          <p className="text-sm text-primary/65">
            {nameOf(assignment.subject)} · {nameOf(assignment.classCourse)}
          </p>
        </div>
        <Link href={`/teacher/assignments/${id}/submissions`}>
          <Button variant="secondary">View submissions</Button>
        </Link>
      </div>

      <Card className="mb-6" data-aos="fade-up">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Overview</CardTitle>
          <StatusBadge status={assignment.status} />
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-primary/85">{assignment.description}</p>
          <div className="grid grid-cols-2 gap-3 text-primary/65">
            <div>
              <span className="block text-xs uppercase text-primary/50">Deadline</span>
              {formatDateTime(assignment.deadline)}
            </div>
            <div>
              <span className="block text-xs uppercase text-primary/50">Max marks</span>
              {assignment.maxMarks}
            </div>
            <div>
              <span className="block text-xs uppercase text-primary/50">Resubmission</span>
              {assignment.allowResubmission ? 'Allowed before deadline' : 'Not allowed'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div data-aos="fade-up" data-aos-delay="100">
        <EditAssignmentPanel assignment={assignment} />
      </div>
    </div>
  );
}
