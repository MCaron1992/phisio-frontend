'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  className?: string;
}

export function DataTablePagination({
  page,
  pageSize,
  totalPages,
  totalItems,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showSizeChanger = true,
  className,
}: DataTablePaginationProps) {
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-between px-2 py-4', className)}>
      {/* Informazioni paginazione */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>
          Mostrando {startItem} - {endItem} di {totalItems} elementi
        </span>
        
        {showSizeChanger && (
          <div className="flex items-center space-x-2">
            <span>Per pagina:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="h-8 w-16 bg-background/50 backdrop-blur-sm border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Controlli paginazione */}
      <div className="flex items-center space-x-1">
        {/* Prima pagina */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={!hasPrevPage}
            className="h-8 w-8 p-0 data-table-pagination-button bg-background/50 backdrop-blur-sm border-border/50 hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Pagina precedente */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage}
            className="h-8 w-8 p-0 data-table-pagination-button bg-background/50 backdrop-blur-sm border-border/50 hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Numeri delle pagine */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((pageNum, index) => (
            <div key={index}>
              {pageNum === '...' ? (
                <motion.div 
                  className="h-8 w-8 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant={pageNum === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum as number)}
                    className={cn(
                      'h-8 w-8 p-0 data-table-pagination-button',
                      pageNum === page
                        ? 'data-table-page-button-active'
                        : 'data-table-page-button-inactive'
                    )}
                  >
                    {pageNum}
                  </Button>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Pagina successiva */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="h-8 w-8 p-0 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Ultima pagina */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="h-8 w-8 p-0 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
