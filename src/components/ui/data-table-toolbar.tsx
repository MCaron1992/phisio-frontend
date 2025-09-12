'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DataTableColumn } from '@/types/data-table';

interface DataTableToolbarProps<T> {
  search: string;
  onSearch: (value: string) => void;
  columns: DataTableColumn<T>[];
  columnFilters: Record<string, string>;
  onColumnFilter: (columnId: string, value: string) => void;
  onResetFilters: () => void;
  searchPlaceholder?: string;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  className?: string;
}

export function DataTableToolbar<T>({
  search,
  onSearch,
  columns,
  columnFilters,
  onColumnFilter,
  onResetFilters,
  searchPlaceholder = 'Cerca...',
  enableGlobalFilter = true,
  enableColumnFilters = false,
  className,
}: DataTableToolbarProps<T>) {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterableColumns = columns.filter(col => col.filterable);

  const handleColumnFilter = (columnId: string, value: string) => {
    onColumnFilter(columnId, value);
    
    if (value) {
      setActiveFilters(prev => [...prev.filter(id => id !== columnId), columnId]);
    } else {
      setActiveFilters(prev => prev.filter(id => id !== columnId));
    }
  };

  const removeFilter = (columnId: string) => {
    onColumnFilter(columnId, '');
    setActiveFilters(prev => prev.filter(id => id !== columnId));
  };

  const hasActiveFilters = search || Object.values(columnFilters).some(Boolean);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Barra di ricerca principale */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          {enableGlobalFilter && (
            <motion.div 
              className="relative flex-1 max-w-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ 
                  scale: search ? 1.1 : 1,
                  color: search ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                }}
                transition={{ duration: 0.2 }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              >
                <Search className="h-4 w-4" />
              </motion.div>
              <motion.div
                animate={{
                  scale: search ? 1.02 : 1,
                  boxShadow: search ? '0 0 0 2px hsl(var(--primary) / 0.2)' : 'none'
                }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-10 data-table-search-input bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                />
              </motion.div>
            </motion.div>
          )}
          
          {enableColumnFilters && filterableColumns.length > 0 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="data-table-toolbar-filter-button bg-background/50 backdrop-blur-sm border-border/50 hover:bg-accent/50"
              >
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                </motion.div>
                Filtri
                {activeFilters.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs data-table-toolbar-filter-badge">
                      {activeFilters.length}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          )}

        </div>
      </div>

      {/* Filtri delle colonne */}
      <AnimatePresence>
        {showFilters && enableColumnFilters && filterableColumns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-muted/30 backdrop-blur-sm rounded-lg border border-border/50 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterableColumns.map((column) => (
                  <div key={column.id} className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">
                      {typeof column.header === 'string' ? column.header : column.id}
                    </label>
                    <Input
                      placeholder={`Filtra per ${typeof column.header === 'string' ? column.header.toLowerCase() : column.id}`}
                      value={columnFilters[column.id] || ''}
                      onChange={(e) => handleColumnFilter(column.id, e.target.value)}
                      className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtri attivi */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {search && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Search className="h-3 w-3 mr-1" />
              Ricerca: "{search}"
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearch('')}
                className="h-auto p-0 ml-2 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {Object.entries(columnFilters).map(([columnId, value]) => {
            if (!value) return null;
            const column = columns.find(col => col.id === columnId);
            return (
              <Badge key={columnId} variant="secondary" className="bg-accent/10 text-accent-foreground border-accent/20">
                {typeof column?.header === 'string' ? column.header : columnId}: "{value}"
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter(columnId)}
                  className="h-auto p-0 ml-2 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
