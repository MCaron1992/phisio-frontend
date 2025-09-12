'use client';

import { Eye, Edit, Trash2 } from 'lucide-react';
import { DataTableAction } from '@/types/data-table';

type RowActionsOptions<T> = {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

function RowActions<T>({
  onView,
  onEdit,
  onDelete,
}: RowActionsOptions<T>): DataTableAction<T>[] {
  return [
    {
      id: 'view',
      label: 'Visualizza',
      icon: <Eye className="h-4 w-4" />,
      onClick: row => onView?.(row),
    },
    {
      id: 'edit',
      label: 'Modifica',
      icon: <Edit className="h-4 w-4" />,
      onClick: row => onEdit?.(row),
    },
    {
      id: 'delete',
      label: 'Elimina',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      onClick: row => onDelete?.(row),
    },
  ];
}

export default RowActions;
