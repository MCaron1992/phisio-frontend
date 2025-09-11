import { useState, useMemo, useCallback } from 'react';
import {
  DataTableState,
  UseDataTableOptions,
  DataTableColumn,
} from '@/types/data-table';

export function useDataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey = 'search',
  onSearch,
  onPageChange,
  onSort,
  onRowSelect,
  pagination,
  enableSelection = false,
  enableGlobalFilter = true,
  enableColumnFilters = false,
  enableSorting = true,
  enablePagination = true,
}: UseDataTableOptions<T>) {
  const [state, setState] = useState<DataTableState>({
    search: '',
    sortColumn: null,
    sortDirection: 'asc',
    selectedRows: new Set(),
    page: pagination?.page || 1,
    pageSize: pagination?.pageSize || 10,
    columnFilters: {},
  });

  const filteredData = useMemo(() => {
    if (!enableGlobalFilter || !state.search) return data;

    return data.filter(item => {
      const searchValue = state.search.toLowerCase();
      return columns.some(column => {
        if (column.accessorKey) {
          const value = item[column.accessorKey];
          return value?.toString().toLowerCase().includes(searchValue);
        }
        return false;
      });
    });
  }, [data, state.search, columns, enableGlobalFilter]);

  const columnFilteredData = useMemo(() => {
    if (!enableColumnFilters || Object.keys(state.columnFilters).length === 0) {
      return filteredData;
    }

    return filteredData.filter(item => {
      return Object.entries(state.columnFilters).every(
        ([columnId, filterValue]) => {
          if (!filterValue) return true;

          const column = columns.find(col => col.id === columnId);
          if (!column?.accessorKey) return true;

          const value = item[column.accessorKey];
          return value
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      );
    });
  }, [filteredData, state.columnFilters, columns, enableColumnFilters]);

  const sortedData = useMemo(() => {
    if (!enableSorting || !state.sortColumn) return columnFilteredData;

    return [...columnFilteredData].sort((a, b) => {
      const column = columns.find(col => col.id === state.sortColumn);
      if (!column?.accessorKey) return 0;

      const aValue = a[column.accessorKey];
      const bValue = b[column.accessorKey];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return state.sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [
    columnFilteredData,
    state.sortColumn,
    state.sortDirection,
    columns,
    enableSorting,
  ]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;

    const startIndex = (state.page - 1) * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, state.page, state.pageSize, enablePagination]);

  const totalPages = useMemo(() => {
    if (!enablePagination) return 1;
    return Math.ceil(sortedData.length / state.pageSize);
  }, [sortedData.length, state.pageSize, enablePagination]);

  const handleSearch = useCallback(
    (value: string) => {
      setState(prev => ({ ...prev, search: value, page: 1 }));
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleSort = useCallback(
    (columnId: string) => {
      if (!enableSorting) return;

      const newDirection =
        state.sortColumn === columnId && state.sortDirection === 'asc'
          ? 'desc'
          : 'asc';

      setState(prev => ({
        ...prev,
        sortColumn: columnId,
        sortDirection: newDirection,
        page: 1,
      }));

      onSort?.(columnId, newDirection);
    },
    [enableSorting, state.sortColumn, state.sortDirection, onSort]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setState(prev => ({ ...prev, page }));
      onPageChange?.(page);
    },
    [onPageChange]
  );

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const handleRowSelect = useCallback(
    (rowId: string, selected: boolean) => {
      if (!enableSelection) return;

      setState(prev => {
        const newSelectedRows = new Set(prev.selectedRows);
        if (selected) {
          newSelectedRows.add(rowId);
        } else {
          newSelectedRows.delete(rowId);
        }

        const selectedRows = data.filter(item =>
          newSelectedRows.has(item.id || String(item))
        );
        onRowSelect?.(selectedRows);

        return { ...prev, selectedRows: newSelectedRows };
      });
    },
    [enableSelection, data, onRowSelect]
  );

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (!enableSelection) return;

      setState(prev => {
        const newSelectedRows = selected
          ? new Set(paginatedData.map(item => item.id || String(item)))
          : new Set();
        const selectedRows = selected ? paginatedData : [];
        onRowSelect?.(selectedRows);

        return { ...prev, selectedRows: newSelectedRows };
      });
    },
    [enableSelection, paginatedData, onRowSelect]
  );

  const handleColumnFilter = useCallback((columnId: string, value: string) => {
    setState(prev => ({
      ...prev,
      columnFilters: { ...prev.columnFilters, [columnId]: value },
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      search: '',
      columnFilters: {},
      page: 1,
    }));
  }, []);

  return {
    data: paginatedData,
    filteredData: sortedData,
    totalData: data,
    state,
    pagination: {
      page: state.page,
      pageSize: state.pageSize,
      totalPages,
      totalItems: sortedData.length,
      hasNextPage: state.page < totalPages,
      hasPrevPage: state.page > 1,
    },
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelect,
    handleSelectAll,
    handleColumnFilter,
    resetFilters,
    isRowSelected: (rowId: string) => state.selectedRows.has(rowId),
    isAllSelected:
      paginatedData.length > 0 &&
      paginatedData.every(item =>
        state.selectedRows.has(item.id || String(item))
      ),
    isIndeterminate:
      paginatedData.some(item =>
        state.selectedRows.has(item.id || String(item))
      ) &&
      !paginatedData.every(item =>
        state.selectedRows.has(item.id || String(item))
      ),
  };
}
