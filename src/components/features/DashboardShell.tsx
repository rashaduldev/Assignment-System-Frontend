'use client';

import Link from 'next/link';
import { BookOpen, ClipboardList, GraduationCap, LayoutGrid, Link2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User, UserRole } from '@/types';
import { LogoutButton } from './LogoutButton';
import { PageTransition } from '@/components/ui/PageTransition';

const NAV: Record<UserRole, { href: string; label: string; icon: React.ElementType }[]> = {
  admin: [
    { href: '/admin/teachers', label: 'Teachers', icon: Users },
    { href: '/admin/students', label: 'Students', icon: GraduationCap },
    { href: '/admin/classes', label: 'Classes', icon: LayoutGrid },
    { href: '/admin/subjects', label: 'Subjects', icon: BookOpen },
    { href: '/admin/teacher-mapping', label: 'Teacher Mapping', icon: Link2 },
    { href: '/admin/assignments', label: 'Assignments', icon: ClipboardList },
    { href: '/admin/submissions', label: 'Submissions', icon: GraduationCap },
  ],
  teacher: [
    { href: '/teacher/assignments', label: 'My Assignments', icon: ClipboardList },
  ],
  student: [
    { href: '/student/assignments', label: 'Assignments', icon: ClipboardList },
    { href: '/student/submissions', label: 'My Submissions', icon: GraduationCap },
  ],
};

export function DashboardShell({ user, children }: { user: User; children: React.ReactNode }) {
  const links = NAV[user.role];

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-primary text-paper md:flex">
        <motion.div
          className="px-5 py-6"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="font-display text-xl">Ledger</h1>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-white/60">{user.role}</p>
        </motion.div>
        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ href, label, icon: Icon }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Link
                href={href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon size={16} />
                {label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="border-t border-white/10 px-3 py-3">
          <p className="truncate px-3 text-xs text-white/60">{user.name}</p>
          <p className="truncate px-3 pb-2 text-xs text-white/40">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <main className="md:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
