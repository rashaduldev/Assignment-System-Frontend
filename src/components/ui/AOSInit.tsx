'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40,
    });
  }, []);

  // Re-scan the DOM for new [data-aos] elements after every client-side navigation.
  useEffect(() => {
    AOS.refreshHard();
  }, [pathname]);

  return null;
}
