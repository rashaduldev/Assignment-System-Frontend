import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type Tone = 'neutral' | 'gold' | 'ok' | 'warn' | 'danger';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-primary/10 text-primary/85',
  gold: 'bg-accent/15 text-accent',
  ok: 'bg-accent/10 text-accent',
  warn: 'bg-danger/10 text-danger/75',
  danger: 'bg-danger/10 text-danger',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export const Badge = ({ tone = 'neutral', className, ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
      toneClasses[tone],
      className
    )}
    {...props}
  />
);

const STATUS_TONE: Record<string, Tone> = {
  draft: 'neutral',
  published: 'ok',
  submitted: 'gold',
  resubmitted: 'gold',
  late: 'warn',
  reviewed: 'ok',
};

export const StatusBadge = ({ status }: { status: string }) => (
  <Badge tone={STATUS_TONE[status] ?? 'neutral'}>{status}</Badge>
);
