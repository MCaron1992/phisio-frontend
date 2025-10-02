'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import {
  Players,
  useDeletePlayer,
  usePlayers,
  useUpdatePlayer,
} from '@/hooks/useCrud';
import TableConatiner from '@/components/custom /TableContainer';
import { useState } from 'react';
import CustomDialog from '@/components/custom /CustomDialog';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Loader } from '@/components/custom /Loader';
import UniversalAlert, {
  AlertState,
} from '@/components/custom /UniversalAlert';
import DeleteConfirmDialog from '@/components/custom /DeleteConfirmDialog';

const GicatoriPage = () => {
  const { data, isLoading } = usePlayers();
  console.log(data);
  const userData = data?.data;
  const { mutate: deleteArto } = useDeletePlayer();
  const { mutate: updateArto } = useUpdatePlayer();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  const columns: DataTableColumn<Players>[] = [
    {
      id: 'nome',
      header: 'Nome',
      accessorKey: 'nome',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'cognome',
      header: 'Cognome',
      accessorKey: 'cognome',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'data_nascita',
      header: 'Data di nascita',
      accessorKey: 'data_nascita',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'sesso',
      header: 'Sesso',
      accessorKey: 'sesso',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'etnia',
      header: 'Etnia',
      accessorKey: 'etnia',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },

    {
      id: 'studio',
      header: 'Studio',
      accessorKey: 'studio',
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

  const rowActions: DataTableAction<Players>[] = [
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
        setTitle('Modifica Arto');
        setSelectedRow(row);
        setDialogOpen(true);
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      id: 'delete',
      label: 'Elimina',
      onClick: row => {
        setSelectedRow(row);
        setOpenDeleteDialog(true);
      },
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
    },
  ];

  const handleSave = (data: { newDescrizione: string }) => {
    setLoading(true);
    updateArto(data, {
      onSuccess: () => {
        setAlert({
          show: true,
          type: 'success',
          title: 'Update successful',
          description: 'The item was updated successfully.',
        });
        setDialogOpen(false);
        setLoading(false);
      },
      onError: err => {
        setAlert({
          show: true,
          type: 'error',
          title: 'Update failed',
          description: err?.message || 'An error occurred.',
        });
        setLoading(false);
      },
    });
  };
  const handelNewAction = () => {
    setTitle('Nuovo Arto');
    setSelectedRow(null);
    setDialogOpen(true);
  };
  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  return (
    <>
      <TableConatiner
        btnLabel={'Nuovo Giocatori'}
        title={'Giocatori'}
        action={() => handelNewAction()}
      >
        <DataTable
          data={userData ?? []}
          columns={columns}
          rowActions={rowActions}
          loading={isLoading}
          searchKey="nome"
          searchPlaceholder="Cerca giocatori..."
          emptyMessage="Nessun giocatori trovato"
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
        descrizione={selectedRow?.nome}
        title={title}
        mode={selectedRow ? 'edit' : 'create'}
      />
      {loading && <Loader />}
      <UniversalAlert
        title={alert.title}
        description={alert.description}
        isVisible={alert.show}
        onClose={handleAlertClose}
        type={alert.type}
        duration={3000}
        position="top-right"
      />
      <DeleteConfirmDialog
        onConfirm={() => deleteArto({ id: selectedRow?.id! })}
        onClose={() => setOpenDeleteDialog(false)}
        open={openDeleteDialog}
      />
    </>
  );
};
export default GicatoriPage;
