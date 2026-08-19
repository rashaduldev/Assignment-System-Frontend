'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/auth.actions';
import { toast } from '@/lib/toast';

export function LogoutButton() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      toast.success('Signed out');
      router.replace('/login');
      router.refresh();
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
    >
      <LogOut size={16} />
      {mutation.isPending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
