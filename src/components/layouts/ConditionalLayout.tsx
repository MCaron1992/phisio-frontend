'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layouts/AppSideBar';
import { AppNavbar } from '@/components/layouts/AppNavbar';
import { TopHeader } from '@/components/layouts/TopHeader';
import { useAuth } from '@/hooks/useAuth';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { user, isLoadingUser } = useAuth();

  const noSidebarPages = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ];

  const shouldShowLayout = !noSidebarPages.some(page =>
    pathname.startsWith(page)
  );

  const generateBreadcrumb = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumb: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

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

  // Pagine di autenticazione
  if (!shouldShowLayout) {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  // Loading state mentre carica l'utente
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  // Determina il ruolo dell'utente
  const userRole = user?.data?.ruolo || user?.role || '';
  const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'super_admin' || userRole === 'admin';

  // Layout con SIDEBAR per Super Admin
  if (isSuperAdmin) {
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

  // Layout con NAVBAR per Dottore Assistente e altri ruoli
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-900">
      <AppNavbar />
      <main className="flex-1 w-full">
        <div className="px-4 lg:px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
