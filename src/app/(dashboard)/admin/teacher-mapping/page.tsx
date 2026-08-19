import { getTeacherAssignments } from '@/actions/teacherAssignment.actions';
import { getUsers } from '@/actions/user.actions';
import { getSubjects } from '@/actions/subject.actions';
import { getClasses } from '@/actions/class.actions';
import { TeacherMappingManager } from '@/components/features/TeacherMappingManager';

export default async function TeacherMappingPage() {
  const [mappings, users, subjects, classes] = await Promise.all([
    getTeacherAssignments(),
    getUsers(),
    getSubjects(),
    getClasses(),
  ]);
  const teachers = users.filter((u) => u.role === 'teacher');

  return (
    <div>
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">Teacher Mapping</h1>
        <p className="mb-6 text-sm text-primary/65">
          Assign a teacher to a subject within a specific class. Teachers can only create
          assignments for pairs they're mapped to here.
        </p>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <TeacherMappingManager
          initialData={mappings}
          teachers={teachers}
          subjects={subjects}
          classes={classes}
        />
      </div>
    </div>
  );
}
