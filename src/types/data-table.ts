import { ReactNode } from 'react';

export interface DataTableColumn<T> {
  id: string;
  header: string | ReactNode;
  accessorKey?: keyof T;
  cell?: (props: { row: T; value: any }) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableAction<T> {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'outline';
  disabled?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  searchKey?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onPageChange?: (page: number) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowSelect?: (rows: T[]) => void;
  rowActions?: DataTableAction<T>[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
  };
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  enableSelection?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
}

export interface DataTableState {
  search: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  selectedRows: Set<string>;
  page: number;
  pageSize: number;
  columnFilters: Record<string, string>;
}

export interface UseDataTableOptions<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  searchKey?: string;
  onSearch?: (value: string) => void;
  onPageChange?: (page: number) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowSelect?: (rows: T[]) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  enableSelection?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
}
