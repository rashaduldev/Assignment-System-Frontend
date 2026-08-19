import { getClasses } from '@/actions/class.actions';
import { ClassesManager } from '@/components/features/ClassesManager';

export default async function AdminClassesPage() {
  const classes = await getClasses();

  return (
    <div>
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">Classes / Courses</h1>
        <p className="mb-6 text-sm text-primary/65">Manage the classes or courses in your institution.</p>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <ClassesManager initialData={classes} />
      </div>
    </div>
  );
}
