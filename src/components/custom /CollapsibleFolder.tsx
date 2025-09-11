'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

export type FolderItem = {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  extra?: ReactNode;
};

type Props = {
  id: string;
  label: string;
  isExpanded: (id: string) => boolean;
  onToggle: (id: string) => void;
  items?: FolderItem[];
  children?: ReactNode;
  className?: string;
  iconClosed?: React.ComponentType<{ className?: string }>;
  iconOpen?: React.ComponentType<{ className?: string }>;
};

export function CollapsibleFolder({
  id,
  label,
  isExpanded,
  onToggle,
  items,
  children,
  className,
  iconClosed: IconClosed = Folder,
  iconOpen: IconOpen = FolderOpen,
}: Props) {
  const open = isExpanded(id);

  return (
    <section className={className} aria-labelledby={`folder-${id}-label`}>
      <Button
        variant="ghost"
        className="w-full justify-start p-2 h-auto hover:bg-slate-800/50 text-slate-400"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        aria-controls={`section-${id}`}
      >
        {open ? (
          <ChevronDown className="h-4 w-4 mr-2 text-slate-500" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2 text-slate-500" />
        )}
        {open ? (
          <IconOpen className="h-4 w-4 mr-2 text-slate-500" />
        ) : (
          <IconClosed className="h-4 w-4 mr-2 text-slate-500" />
        )}
        <span
          id={`folder-${id}-label`}
          className="text-sm group-data-[collapsible=icon]:hidden"
        >
          {label}
        </span>
      </Button>
      <ul
        id={`section-${id}`}
        hidden={!open}
        className="pl-6 space-y-1"
        role="region"
        aria-label={label}
      >
        {items?.map(item => {
          const Icon = item.icon;
          const content = (
            <span className="flex items-center gap-2 text-slate-400 hover:text-slate-200">
              {Icon && <Icon className="h-3 w-3 text-slate-500" />}
              <span className="text-xs">{item.label}</span>
              {item.extra}
            </span>
          );
          return (
            <li key={item.key}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="block cursor-pointer px-2 py-1"
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="w-full text-left px-2 py-1"
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}

        {children}
      </ul>
    </section>
  );
}
