'use client';

import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface AlertProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  tone?: 'danger' | 'ok';
  children?: ReactNode;
}

export const Alert = ({ tone = 'danger', className, children, ...props }: AlertProps) => {
  const Icon = tone === 'danger' ? AlertCircle : CheckCircle2;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-start gap-2 overflow-hidden rounded-md border px-3 py-2 text-sm',
        tone === 'danger'
          ? 'border-danger/20 bg-danger/10 text-danger'
          : 'border-accent/25 bg-accent/10 text-accent',
        className
      )}
      {...props}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </motion.div>
  );
};
