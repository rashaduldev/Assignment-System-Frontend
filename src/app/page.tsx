import { redirect } from 'next/navigation';
import { getCurrentUserAction } from '@/actions/auth.actions';

export default async function HomePage() {
  const user = await getCurrentUserAction();

  if (!user) redirect('/login');

  redirect(`/${user.role}/assignments`);
}
