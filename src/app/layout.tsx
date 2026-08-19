import type { Metadata } from 'next';
import { QueryProvider } from '@/lib/query-provider';
import { AOSInit } from '@/components/ui/AOSInit';
import { ToastInit } from '@/components/ui/ToastInit';
import './globals.css';

export const metadata: Metadata = {
  title: 'Assignment & Submission Management System',
  description: 'Role-based assignment and submission management for schools and colleges.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AOSInit />
        <ToastInit />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
