'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Trash2, Edit, Eye, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DataTableAction } from '@/types/data-table';
import { cn } from '@/lib/utils';

interface DataTableRowActionsProps<T> {
  row: T;
  actions: DataTableAction<T>[];
  className?: string;
}

export function DataTableRowActions<T>({
  row,
  actions,
  className,
}: DataTableRowActionsProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  if (!actions || actions.length === 0) return null;

  const getActionIcon = (actionId: string) => {
    switch (actionId.toLowerCase()) {
      case 'edit':
        return <Edit className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'copy':
        return <Copy className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActionVariant = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive hover:text-destructive hover:bg-destructive/10';
      case 'outline':
        return 'text-foreground hover:bg-accent';
      default:
        return 'text-foreground hover:bg-accent';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0 data-table-action-button',
              isOpen && 'bg-accent/50',
              className
            )}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Apri menu azioni</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-background/95 backdrop-blur-sm border-border/50 shadow-lg"
        sideOffset={4}
      >
        <AnimatePresence>
          {actions.map((action, index) => {
            const isDisabled = action.disabled?.(row) || false;
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1, delay: index * 0.05 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      if (!isDisabled) {
                        action.onClick(row);
                        setIsOpen(false);
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(
                      'flex items-center space-x-2 cursor-pointer data-table-button-animation',
                      getActionVariant(action.variant),
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {action.icon || getActionIcon(action.id)}
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                </motion.div>
                
                {index < actions.length - 1 && action.variant === 'destructive' && (
                  <DropdownMenuSeparator className="my-1" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
