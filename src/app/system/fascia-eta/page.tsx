'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import { FasceEta, useFasceEta, useDeleteFasciaEta } from '@/hooks/useCrud';
import TableConatiner from '@/components/custom /TableContainer';
import RowActions from '@/components/custom /RowActions';
import { useState } from 'react';
import CustomDialog from '@/components/custom /CustomDialog';
import { Edit, Eye, Trash2 } from 'lucide-react';

const ApprocciTable = () => {
  const { data, isLoading } = useFasceEta();
  const { mutate: deleteFasciaEta } = useDeleteFasciaEta();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FasceEta | null>(null);
  const [title, setTitle] = useState('');
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

  const rowActions: DataTableAction<FasceEta>[] = [
    {
      id: 'view',
      label: 'Visualizza',
      onClick: row => console.log('Visualizza', row),
      icon: <Eye className="h-4 w-4" />,
      show: () => false,
    },
    {
      id: 'edit',
      label: 'Modifica',
      onClick: row => {
        setTitle('Modifica Fascia eta');
        setSelectedRow(row);
        setDialogOpen(true);
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      id: 'delete',
      label: 'Elimina',
      onClick: row => deleteFasciaEta({ id: row.id }),
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
    },
  ];

  const handleSave = () => {};
  const handelNewAction = () => {
    setTitle('Nuova Fascia eta');
    setSelectedRow(null);
    setDialogOpen(true);
  };

  return (
    <>
      <TableConatiner
        btnLabel={'Nuova Fascia eta'}
        title={'Fascia eta'}
        action={() => handelNewAction()}
      >
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
      <CustomDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        descrizione={selectedRow?.descrizione || ''}
        title={title}
        mode={selectedRow ? 'edit' : 'create'}
      />
    </>
  );
};
export default ApprocciTable;
