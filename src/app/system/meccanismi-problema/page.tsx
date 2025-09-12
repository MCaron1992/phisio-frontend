'use client';
import { DataTable } from '@/components/ui/data-table';
import { Edit, Trash2, Eye } from 'lucide-react';
import { DataTableColumn, DataTableAction } from '@/types/data-table';
import {
  Approccio,
  MeccanismoProblema,
  useDeleteMeccanismoProblema,
  useMeccanismiProblema,
} from '@/hooks/useCrud';
import TableConatiner from '@/components/custom /TableContainer';
import RowActions from '@/components/custom /RowActions';

const ApprocciTable = () => {
  const { data, isLoading } = useMeccanismiProblema();
  const { mutate: deleteMeccanismo } = useDeleteMeccanismoProblema();

  const columns: DataTableColumn<MeccanismoProblema>[] = [
    {
      id: 'nome',
      header: 'Nome',
      accessorKey: 'nome',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-40',
    },
    {
      id: 'descrizione',
      header: 'Descrizione',
      accessorKey: 'descrizione',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'ultimo-aggiornamento',
      header: 'ultimo aggiornamento',
      accessorKey: 'updated_at',
      sortable: true,
      width: 'w-24 md:w-32',
      cell: ({ value }) =>
        value ? new Date(value).toLocaleDateString('it-IT') : '-',
    },
  ];

  const rowActions = RowActions<MeccanismoProblema>({
    onView: row => console.log('Visualizza:', row),
    onEdit: row => console.log('Modifica:', row),
    onDelete: row => deleteMeccanismo({ id: row.id }),
  });

  return (
    <TableConatiner
      btnLabel={'Nuovo Meccanisimo'}
      title={'Meccanismi del Problema'}
    >
      <DataTable
        data={data ?? []}
        columns={columns}
        rowActions={rowActions}
        loading={isLoading}
        searchKey="nome"
        searchPlaceholder="Cerca meccanisimo..."
        emptyMessage="Nessun meccanisimo trovato"
        enableSelection={true}
        enableSorting={true}
        enablePagination={true}
        pagination={{
          page: 1,
          pageSize: 10,
          total: data?.length ?? 0,
        }}
      />
    </TableConatiner>
  );
};
export default ApprocciTable;
