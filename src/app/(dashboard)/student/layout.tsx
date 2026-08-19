import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (user.role !== 'student') redirect(`/${user.role}/assignments`);
  return <>{children}</>;
}
