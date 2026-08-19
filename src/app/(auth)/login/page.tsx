import { redirect } from 'next/navigation';
import { getCurrentUserAction } from '@/actions/auth.actions';
import { LoginForm } from '@/components/features/LoginForm';

export default async function LoginPage() {
  const user = await getCurrentUserAction();
  if (user) redirect(`/${user.role}/assignments`);

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-sm" data-aos="fade-up" data-aos-duration="600">
        <div className="mb-8 text-center" data-aos="fade-down" data-aos-delay="100">
          <h1 className="font-display text-3xl text-paper">Ledger</h1>
          <p className="mt-1 text-sm text-white/70">
            Assignment &amp; Submission Management System
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-xl" data-aos="zoom-in" data-aos-delay="150">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
