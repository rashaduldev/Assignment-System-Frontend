import { getMySubmissions } from '@/actions/submission.actions';
import { MySubmissionsList } from '@/components/features/MySubmissionsList';

export default async function MySubmissionsPage() {
  const submissions = await getMySubmissions();

  return (
    <div>
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">My Submissions</h1>
        <p className="mb-6 text-sm text-primary/65">Status, marks, and feedback for everything you've submitted.</p>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <MySubmissionsList initialData={submissions} />
      </div>
    </div>
  );
}
