'use client';

import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNavigation({
  items,
  className,
}: BreadcrumbNavigationProps) {
  return (
    <nav className={cn('flex items-center space-x-2', className)}>
      <div className="flex items-center space-x-2">
        <FileText className="h-4 w-4 text-slate-400" />
        <div className="h-4 w-px bg-slate-600" />
      </div>

      <div className="flex items-center space-x-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {index > 0 && <ChevronRight className="h-4 w-4 text-slate-500" />}

            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'text-sm font-medium',
                  item.isActive ? 'text-slate-200' : 'text-slate-400'
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
