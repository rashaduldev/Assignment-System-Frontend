import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAssignments } from '@/actions/assignment.actions';
import { Button } from '@/components/ui/Button';
import { TeacherAssignmentsList } from '@/components/features/TeacherAssignmentsList';

export default async function TeacherAssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between" data-aos="fade-down">
        <div>
          <h1 className="font-display text-2xl text-primary">My Assignments</h1>
          <p className="text-sm text-primary/65">Create, publish, and manage your assignments.</p>
        </div>
        <Link href="/teacher/assignments/new">
          <Button>
            <Plus size={16} /> New assignment
          </Button>
        </Link>
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <TeacherAssignmentsList initialData={assignments} />
      </div>
    </div>
  );
}
