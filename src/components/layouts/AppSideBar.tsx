'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Activity,
  Stethoscope,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  User,
  Clock,
  BarChart3,
  Settings,
  Heart,
  Zap,
  Target,
  TrendingUp,
  ClipboardList,
  BookOpen,
  TestTube,
  UserIcon,
} from 'lucide-react';
import SplitText from '@/components/bits/SplitText';

import Link from 'next/link';
import { useExpandedFolders } from '@/hooks/useExpandedFolders';
import { CollapsibleFolder } from '@/components/custom /CollapsibleFolder';
import {
  itemsAnatomia,
  itemsSportStrumenti,
  itemsStudio,
  itemsTerapiaProblema,
  itemsTestMetriche,
  itemsUtente,
  itemsUtenteRuoli,
} from '@/constant/itemsSideBar';
import { useAuth } from '@/hooks/useAuth';

export function AppSidebar() {
  const { toggleSidebar, state } = useSidebar();
  const [activeTestTab, setActiveTestTab] = useState<string>('strength');
  const { user, isLoadingUser } = useAuth();

  console.log('user : ', user);
  const { isExpanded, toggle, hydrated } = useExpandedFolders([], {
    storageKey: 'ea:sidebar:expanded',
  });

  if (!hydrated) {
    return null;
  }

  /*  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    'utente',
    'studio',
  ]);
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };*/

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-slate-800/70 text-slate-300';
      case 'completed':
        return 'bg-slate-800/50 text-slate-400';
      case 'pending':
        return 'bg-slate-800/60 text-slate-300';
      default:
        return 'bg-slate-800/50 text-slate-400';
    }
  };

  return (
    <Sidebar className="scrollbar-hidden">
      <SidebarHeader className="border-b border-slate-800/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/30 backdrop-blur-sm group-hover:bg-slate-600/40 transition-colors">
            <img src="/logo_white.png" alt="Logo" className="h-8 w-8" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
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
      </SidebarHeader>

      <SidebarContent className="space-y-2 p-2 ">
        <SidebarGroup className="rounded-xl backdrop-blur-sm border border-amber-50/50">
          <SidebarGroupLabel className="font-semibold text-xs uppercase tracking-wider group-data-[collapsible=icon]:hidden text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text">
            Gestione Utente
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <CollapsibleFolder
              id="utente"
              label="Utente"
              isExpanded={isExpanded}
              onToggle={toggle}
              items={itemsUtente}
            />
            <CollapsibleFolder
              id="studio"
              label="Studio"
              isExpanded={isExpanded}
              onToggle={toggle}
              items={itemsStudio}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="rounded-xl backdrop-blur-sm border border-amber-50/50">
          <SidebarGroupLabel className="font-semibold text-xs uppercase tracking-wider group-data-[collapsible=icon]:hidden text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text">
            Configurazioni di Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <CollapsibleFolder
              id="utente_ruoli"
              label="Utente & Ruoli"
              isExpanded={isExpanded}
              onToggle={toggle}
              items={itemsUtenteRuoli}
            />
            <CollapsibleFolder
              id="terapia_problema"
              label="Terapia & Problema"
              isExpanded={isExpanded}
              onToggle={toggle}
              items={itemsTerapiaProblema}
            />
            <CollapsibleFolder
              id="test_metriche"
              label="Test & Metriche"
              isExpanded={isExpanded}
              onToggle={toggle}
              items={itemsTestMetriche}
            />
            <CollapsibleFolder
              id="anatomia"
              label="Anatomia"
              isExpanded={isExpanded}
              onToggle={toggle}
              items={itemsAnatomia}
            />
            <CollapsibleFolder
              id="sport_strumenti"
              label="Sport & Strumenti"
              isExpanded={isExpanded}
              onToggle={toggle}
              items={itemsSportStrumenti}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-800/50 p-4 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-700/30 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
            <User className="h-4 w-4 text-slate-300" />
          </div>
          <div className="flex flex-col">
            {isLoadingUser ? (
              <>
                <span className="text-sm font-medium text-slate-300">
                  Loading...
                </span>
              </>
            ) : user ? (
              <>
                <span className="text-sm font-medium text-slate-300">
                  {user.data.nome} {user.data.cognome}
                </span>
                <span className="text-xs text-slate-400">
                  {user.data.ruolo}
                </span>
              </>
            ) : (
              <span className="text-sm text-slate-400">Non loggato</span>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
