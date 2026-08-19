import { cn } from '@/lib/utils';
import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto rounded-lg border border-primary/10">
    <table className={cn('w-full text-left text-sm', className)} {...props} />
  </div>
);

export const Thead = (props: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-primary/5 text-xs uppercase tracking-wide text-primary/65" {...props} />
);

export const Tbody = (props: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="divide-y divide-primary/10" {...props} />
);

export const Tr = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('transition-colors duration-150 hover:bg-primary/5', className)} {...props} />
);

export const Th = ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('px-4 py-3 font-medium', className)} {...props} />
);

export const Td = ({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-4 py-3 text-primary/85', className)} {...props} />
);

export const EmptyState = ({ message }: { message: string }) => (
  <div className="py-10 text-center text-sm text-primary/50">{message}</div>
);
