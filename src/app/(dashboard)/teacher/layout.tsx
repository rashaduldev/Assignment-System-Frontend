import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (user.role !== 'teacher') redirect(`/${user.role}/assignments`);
  return <>{children}</>;
}
