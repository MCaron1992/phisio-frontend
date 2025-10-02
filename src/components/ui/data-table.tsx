'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ArrowUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableRowActions } from '@/components/ui/data-table-row-actions';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTableProps, DataTableColumn } from '@/types/data-table';
import { cn } from '@/lib/utils';
import { Checkbox } from '@radix-ui/react-checkbox';

export function DataTable<T extends Record<string, never>>({
  data,
  columns,
  searchKey = 'search',
  searchPlaceholder = 'Cerca...',
  onSearch,
  onPageChange,
  onSort,
  onRowSelect,
  rowActions = [],
  pagination,
  loading = false,
  emptyMessage = 'Nessun dato disponibile',
  className,
  enableSelection = false,
  enableGlobalFilter = true,
  enableColumnFilters = false,
  enableSorting = true,
  enablePagination = true,
}: DataTableProps<T>) {
  const {
    data: paginatedData,
    state,
    pagination: paginationState,
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelect,
    handleSelectAll,
    handleColumnFilter,
    resetFilters,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
  } = useDataTable({
    data,
    columns,
    searchKey,
    onSearch,
    onPageChange,
    onSort,
    onRowSelect,
    pagination,
    enableSelection,
    enableGlobalFilter,
    enableColumnFilters,
    enableSorting,
    enablePagination,
  });

  const getSortIcon = (columnId: string) => {
    const isActive = state.sortColumn === columnId;
    const isAsc = state.sortDirection === 'asc';

    if (!isActive) {
      return (
        <ArrowUpDown className="h-4 w-4 text-muted-foreground data-table-sort-icon hover:scale-110 hover:rotate-12 transition-all duration-300" />
      );
    }

    return (
      <motion.div
        initial={false}
        animate={{
          rotate: isAsc ? 0 : 180,
          scale: 1.25,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
        className="data-table-sort-indicator-active"
      >
        <ArrowUp className="h-4 w-4 text-primary drop-shadow-sm" />
      </motion.div>
    );
  };

  const renderCell = (row: T, column: DataTableColumn<T>) => {
    if (column.cell) {
      return column.cell({
        row,
        value: column.accessorKey ? row[column.accessorKey] : undefined,
      });
    }

    if (column.accessorKey) {
      return row[column.accessorKey];
    }

    return null;
  };

  const getRowId = (row: T, index: number) => {
    return row.id || row.key || String(index);
  };

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="overflow-hidden rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                {enableSelection && (
                  <TableHead className="w-12">
                    <Skeleton className="h-4 w-4" />
                  </TableHead>
                )}
                {columns.map(column => (
                  <TableHead key={column.id} className={column.width}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
                {rowActions.length > 0 && <TableHead className="w-12" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: paginationState.pageSize }).map(
                (_, index) => (
                  <TableRow key={index}>
                    {enableSelection && (
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                    )}
                    {columns.map(column => (
                      <TableCell key={column.id}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                    {rowActions.length > 0 && (
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    )}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <DataTableToolbar
        search={state.search}
        onSearch={handleSearch}
        columns={columns}
        columnFilters={state.columnFilters}
        onColumnFilter={handleColumnFilter}
        onResetFilters={resetFilters}
        searchPlaceholder={searchPlaceholder}
        enableGlobalFilter={enableGlobalFilter}
        enableColumnFilters={enableColumnFilters}
      />

      <div className="data-table-container overflow-hidden rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="data-table-responsive overflow-x-auto overflow-y-visible">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {enableSelection && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      ref={el => {
                        if (el && 'indeterminate' in el) {
                          (el as HTMLInputElement).indeterminate =
                            isIndeterminate;
                        }
                      }}
                      className="transition-all duration-200"
                    />
                  </TableHead>
                )}
                {columns.map(column => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      'font-medium text-foreground/80 data-table-header-cell text-left',
                      column.width,
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'data-table-sortable-header'
                    )}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <motion.div
                      className={cn(
                        'flex items-center space-x-2 justify-start',
                        column.align === 'center' && 'justify-center',
                        column.align === 'right' && 'justify-end'
                      )}
                      whileHover={{
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>{column.header}</span>
                      {column.sortable && getSortIcon(column.id)}
                    </motion.div>
                  </TableHead>
                ))}
                {rowActions.length > 0 && <TableHead className="w-12" />}
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence mode="popLayout">
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        columns.length +
                        (enableSelection ? 1 : 0) +
                        (rowActions.length > 0 ? 1 : 0)
                      }
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-4xl opacity-50">📊</div>
                        <p>{emptyMessage}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => {
                    const rowId = getRowId(row, index);
                    const isSelected = isRowSelected(rowId);

                    return (
                      <motion.tr
                        key={rowId}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.05,
                          ease: 'easeOut',
                        }}
                        whileHover={{
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          transition: { duration: 0.2 },
                        }}
                        className={cn(
                          'data-table-row-animation',
                          isSelected &&
                            'data-table-selected-row data-table-selection-glow',
                          'data-table-hover-row'
                        )}
                      >
                        {enableSelection && (
                          <TableCell>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={checked =>
                                  handleRowSelect(rowId, checked as boolean)
                                }
                                className="data-table-selection-checkbox"
                              />
                            </motion.div>
                          </TableCell>
                        )}

                        {columns.map(column => (
                          <TableCell
                            key={column.id}
                            className={cn(
                              'data-table-body-cell data-table-cell-hover text-left',
                              'whitespace-normal break-words',
                              column.id === 'descrizione' &&
                                'data-table-description-cell',
                              column.align === 'center' && 'text-center',
                              column.align === 'right' && 'text-right'
                            )}
                          >
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              {renderCell(row, column)}
                            </motion.div>
                          </TableCell>
                        ))}

                        {rowActions.length > 0 && (
                          <TableCell>
                            <DataTableRowActions
                              row={row}
                              actions={rowActions}
                            />
                          </TableCell>
                        )}
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>

      {enablePagination && paginationState.totalPages > 1 && (
        <DataTablePagination
          page={paginationState.page}
          pageSize={paginationState.pageSize}
          totalPages={paginationState.totalPages}
          totalItems={paginationState.totalItems}
          hasNextPage={paginationState.hasNextPage}
          hasPrevPage={paginationState.hasPrevPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pagination?.pageSizeOptions}
          showSizeChanger={pagination?.showSizeChanger}
        />
      )}
    </div>
  );
}
