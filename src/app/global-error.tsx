'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where you'd forward to an error-tracking
    // service (Sentry, etc). For now, keep a clear server-side trail via
    // the console so the failure is visible in server logs during dev/demo.
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen items-center justify-center bg-paper px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
              <AlertTriangle size={22} />
            </div>
            <h1 className="font-display text-2xl text-primary">Something went wrong</h1>
            <p className="mt-2 text-sm text-primary/65">
              An unexpected error occurred. You can try again, or head back to the dashboard.
            </p>
            {error.digest && (
              <p className="mt-2 font-mono text-xs text-primary/40">Ref: {error.digest}</p>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/')}>
                Go home
              </Button>
              <Button onClick={() => reset()}>Try again</Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
