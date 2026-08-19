import { notFound } from 'next/navigation';
import { getAssignment } from '@/actions/assignment.actions';
import { getMySubmissions } from '@/actions/submission.actions';
import { ApiClientError } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDateTime, isPast } from '@/lib/utils';
import { nameOf } from '@/lib/populated';
import { SubmitAnswerForm } from '@/components/features/SubmitAnswerForm';

export default async function StudentAssignmentDetailPage({
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

  const mySubmissions = await getMySubmissions();
  const existing = mySubmissions.find((s) => {
    const aId = typeof s.assignment === 'string' ? s.assignment : s.assignment._id;
    return aId === id;
  });

  const deadlinePassed = isPast(assignment.deadline);

  return (
    <div className="max-w-2xl">
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">{assignment.title}</h1>
        <p className="mb-6 text-sm text-primary/65">
          {nameOf(assignment.subject)} · Deadline {formatDateTime(assignment.deadline)}
        </p>
      </div>

      <Card className="mb-6" data-aos="fade-up">
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-primary/85">
          <p className="whitespace-pre-wrap">{assignment.description}</p>
          <p className="text-primary/65">Max marks: {assignment.maxMarks}</p>
        </CardContent>
      </Card>

      {existing?.status === 'reviewed' ? (
        <Card data-aos="fade-up" data-aos-delay="100">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Your grade</CardTitle>
            <StatusBadge status={existing.status} />
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-2xl font-display text-primary">
              {existing.marks} <span className="text-sm text-primary/50">/ {assignment.maxMarks}</span>
            </p>
            {existing.feedback && <p className="text-primary/75">“{existing.feedback}”</p>}
            {existing.reviewedFileUrl && <a href={existing.reviewedFileUrl} target="_blank" rel="noreferrer" className="inline-block text-sm font-medium text-primary underline">View teacher's marked PDF</a>}
          </CardContent>
        </Card>
      ) : (
        <div data-aos="fade-up" data-aos-delay="100">
          <SubmitAnswerForm
            assignmentId={id}
            existing={existing}
            deadlinePassed={deadlinePassed}
            allowResubmission={assignment.allowResubmission}
          />
        </div>
      )}
    </div>
  );
}
