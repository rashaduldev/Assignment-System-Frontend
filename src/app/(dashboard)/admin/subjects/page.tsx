import { getSubjects } from '@/actions/subject.actions';
import { getClasses } from '@/actions/class.actions';
import { SubjectsManager } from '@/components/features/SubjectsManager';

export default async function AdminSubjectsPage() {
  const [subjects, classes] = await Promise.all([getSubjects(), getClasses()]);

  return (
    <div>
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">Subjects</h1>
        <p className="mb-6 text-sm text-primary/65">Manage subjects and which class/course they belong to.</p>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <SubjectsManager initialData={subjects} classes={classes} />
      </div>
    </div>
  );
}
