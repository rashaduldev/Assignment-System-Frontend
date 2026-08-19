import { cn } from '@/lib/utils';
import { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

export const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('mb-1.5 block text-sm font-medium text-primary/85', className)} {...props} />
);

const fieldBase =
  'w-full rounded-md border border-primary/10 bg-white px-3 py-2 text-sm text-primary placeholder:text-primary/40 ' +
  'transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  )
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, 'min-h-28 resize-y', className)} {...props} />
  )
);
Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, 'pr-8', className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = 'Select';

export const FieldError = ({ children }: { children?: string }) => {
  if (!children) return null;
  return <p className="mt-1 text-xs text-danger">{children}</p>;
};
