import { getUsers } from '@/actions/user.actions';
import { getClasses } from '@/actions/class.actions';
import { UsersManager } from '@/components/features/UsersManager';

export default async function AdminUsersPage() {
  const [users, classes] = await Promise.all([getUsers(), getClasses()]);

  return (
    <div>
      <div data-aos="fade-down">
        <h1 className="mb-1 font-display text-2xl text-primary">Users</h1>
        <p className="mb-6 text-sm text-primary/65">Manage Admin, Teacher, and Student accounts.</p>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <UsersManager initialData={users} classes={classes} />
      </div>
    </div>
  );
}
