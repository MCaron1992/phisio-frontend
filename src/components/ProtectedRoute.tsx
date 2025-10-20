'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from './custom/Loader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoadingUser) {
      if (!user && pathname !== '/auth/login') {
        router.push(`/auth/login`);
      }
    }
  }, [user, isLoadingUser, router, pathname]);

  if (isLoadingUser || (!user && pathname !== '/auth/login')) {
    return (
      <Loader />
    );
  }

  return <>{children}</>;
}