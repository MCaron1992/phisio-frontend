'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user, isLoadingUser, logout, isLoggingOut } = useAuth();
  const router = useRouter();

  if (isLoadingUser) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 rounded-full bg-slate-700 animate-pulse" />
        <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4 mr-2" />
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 h-10 px-3  pr-10 hover:bg-slate-800/50"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-300" />
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-slate-200">
                {user.data.nome} {user.data.cognome}
              </span>
              <span className="text-xs text-slate-400">{user.data.ruolo}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 bg-slate-800 border-slate-700"
        >
          <DropdownMenuLabel className="text-slate-200">
            Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-700" />

          <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-slate-100">
            <User className="h-4 w-4 mr-2" />
            Profilo
          </DropdownMenuItem>

          <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-slate-100">
            <Settings className="h-4 w-4 mr-2" />
            Impostazioni
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-700" />

          <DropdownMenuItem
            className="text-red-400 hover:bg-slate-700 hover:text-red-300"
            onClick={() => {
              logout();
              router.push(`/auth/login`);
            }}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? 'Disconnessione...' : 'Logout'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
