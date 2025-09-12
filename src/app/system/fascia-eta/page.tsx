'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumn } from '@/types/data-table';
import { FasceEta, useFasceEta, useDeleteFasciaEta } from '@/hooks/useCrud';
import TableConatiner from '@/components/custom /TableContainer';
import RowActions from '@/components/custom /RowActions';

const ApprocciTable = () => {
  const { data, isLoading } = useFasceEta();
  const { mutate: deleteFasciaEta } = useDeleteFasciaEta();

  const columns: DataTableColumn<FasceEta>[] = [
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

  const rowActions = RowActions<FasceEta>({
    onView: row => console.log('Visualizza:', row),
    onEdit: row => console.log('Modifica:', row),
    onDelete: row => deleteFasciaEta({ id: row.id }),
  });

  return (
    <TableConatiner btnLabel={'Nuova Fascia eta'} title={'Fascia eta'}>
      <DataTable
        data={data ?? []}
        columns={columns}
        rowActions={rowActions}
        loading={isLoading}
        searchKey="nome"
        searchPlaceholder="Cerca Fascia eta..."
        emptyMessage="Nessuna Fascia  di eta trovata"
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
