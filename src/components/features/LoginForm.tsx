'use client';

import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '@/actions/auth.actions';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldError } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => loginAction(values.email, values.password),
    onSuccess: (result) => {
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Login failed');
        return;
      }
      toast.success(`Welcome back, ${result.data.name.split(' ')[0]}!`);
      const next = searchParams.get('next');
      router.replace(next || `/${result.data.role}/assignments`);
      router.refresh();
    },
  });

  const onSubmit = (values: FormValues) => mutation.mutate(values);
  const serverError = mutation.data && !mutation.data.success ? mutation.data.error : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && <Alert tone="danger">{serverError}</Alert>}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@school.com" {...register('email')} />
        <FieldError>{errors.email?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
        <FieldError>{errors.password?.message}</FieldError>
      </div>

      <Button type="submit" className="w-full" isLoading={mutation.isPending}>
        Sign in
      </Button>
    </form>
  );
}
