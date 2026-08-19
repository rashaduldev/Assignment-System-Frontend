import { getUsers } from '@/actions/user.actions';
import { getClasses } from '@/actions/class.actions';
import { UsersManager } from '@/components/features/UsersManager';

export default async function AdminStudentsPage() {
  const [students, classes] = await Promise.all([getUsers('student'), getClasses()]);
  return <div><h1 className="mb-1 font-display text-2xl text-primary">Students</h1><p className="mb-6 text-sm text-primary/65">Manage students by class, with quick search and filters.</p><UsersManager initialData={students} classes={classes} roleFilter="student" /></div>;
}
