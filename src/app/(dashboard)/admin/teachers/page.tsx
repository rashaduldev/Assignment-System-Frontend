import { getUsers } from '@/actions/user.actions';
import { getClasses } from '@/actions/class.actions';
import { UsersManager } from '@/components/features/UsersManager';

export default async function AdminTeachersPage() {
  const [teachers, classes] = await Promise.all([getUsers('teacher'), getClasses()]);
  return <div><h1 className="mb-1 font-display text-2xl text-primary">Teachers</h1><p className="mb-6 text-sm text-primary/65">Search, manage, and assign teacher accounts.</p><UsersManager initialData={teachers} classes={classes} roleFilter="teacher" /></div>;
}
