'use client';

import { useEffect } from 'react';
import { toast } from '@/lib/toast';

export function ToastInit() {
  useEffect(() => {
    toast.configure({
      position: 'bottom-right',
      duration: 3500,
      maxVisible: 4,
      theme: 'light',
      gap: 10,
    });
  }, []);

  return null;
}
