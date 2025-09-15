'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layouts/AppSideBar';
import { TopHeader } from '@/components/layouts/TopHeader';

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

  const generateBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumb = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumb.push({
        label,
        href: isLast ? undefined : currentPath,
        isActive: isLast,
      });
    });

    return breadcrumb;
  };

  if (!shouldShowSidebar) {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col min-h-screen w-full">
        <TopHeader breadcrumb={generateBreadcrumb()} />
        <main className="bg-slate-900 min-h-screen w-full flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
