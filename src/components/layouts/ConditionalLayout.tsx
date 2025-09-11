'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layouts/AppSideBar';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  const noSidebarPages = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ];

  const shouldShowSidebar = !noSidebarPages.some(page =>
    pathname.startsWith(page)
  );

  if (!shouldShowSidebar) {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-slate-900 min-h-screen w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
