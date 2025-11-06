'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import {
  itemsUtente,
  itemsStudio,
  itemsGiocatori,
} from '@/constant/itemsSideBar';
import { UserMenu } from '@/components/custom/UserMenu';
import SplitText from '@/components/bits/SplitText';

interface DropdownItem {
  key: string;
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
  isActive: boolean;
}

function NavDropdown({ label, items, isActive }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg',
          isActive
            ? 'text-cyan-400 bg-slate-800/50'
            : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/30'
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-slate-700 bg-slate-800/95 backdrop-blur-sm shadow-xl z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="p-2">
            {items.map(item => {
              const Icon = item.icon;
              const isItemActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                    isItemActive
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400'
                  )}
                  onClick={item.onClick}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function AppNavbar() {
  const pathname = usePathname();

  const isPrestazioniActive = pathname.startsWith('/fatti_giocatore');
  const isGiocatoriActive =
    pathname.startsWith('/giocatori') || pathname.startsWith('/system/teams');
  const isStudioActive = pathname.startsWith('/studio');
  const isUtenteActive = pathname.startsWith('/utente');

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-900/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/30 backdrop-blur-sm hover:bg-slate-600/40 transition-colors">
              <img src="/logo_white.png" alt="Logo" className="h-8 w-8" />
            </div>
            <div className="hidden sm:block">
              <SplitText
                text="Energy Analytics"
                className="font-sans text-center text-gray-300"
                delay={150}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.3}
                rootMargin="-100px"
                textAlign="center"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavDropdown
              label="Giocatori"
              items={itemsGiocatori}
              isActive={isGiocatoriActive}
            />
            <NavDropdown
              label="Studio"
              items={itemsStudio}
              isActive={isStudioActive}
            />
            <NavDropdown
              label="Utente"
              items={itemsUtente}
              isActive={isUtenteActive}
            />
          </div>
        </div>

        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>

      <div className="md:hidden px-4 pb-4">
        <div className="flex flex-col gap-2">
          <NavDropdown
            label="Giocatori"
            items={itemsGiocatori}
            isActive={isGiocatoriActive}
          />
          <NavDropdown
            label="Studio"
            items={itemsStudio}
            isActive={isStudioActive}
          />
          <NavDropdown
            label="Utente"
            items={itemsUtente}
            isActive={isUtenteActive}
          />
        </div>
      </div>
    </nav>
  );
}


