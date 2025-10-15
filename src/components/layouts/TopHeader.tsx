'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { BreadcrumbNavigation } from '@/components/custom/BreadcrumbNavigation';
import { UserMenu } from '@/components/custom/UserMenu';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface TopHeaderProps {
  breadcrumb: BreadcrumbItem[];
  className?: string;
}

export function TopHeader({ breadcrumb, className }: TopHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-900/95 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-slate-400 hover:text-slate-200" />
          <BreadcrumbNavigation items={breadcrumb} />
        </div>

        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
