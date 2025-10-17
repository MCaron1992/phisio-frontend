'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import {
  useStudi,
  useDeleteStudio,
  useUpdateStudio,
  Studio,
} from '@/hooks/useCrud';
import TableConatiner from '@/components/custom/TableContainer';
import { useState } from 'react';
import CustomDialog from '@/components/custom/CustomDialog';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';
import { useRouter } from 'next/navigation';

const StudioPage = () => {
  const { data, isLoading } = useStudi();
  const studioData = data?.data;
  const { mutate: deleteArto } = useDeleteStudio();
  const { mutate: updateArto } = useUpdateStudio();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Studio | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  const columns: DataTableColumn<Studio>[] = [
    {
      id: 'nome',
      header: 'Nome',
      accessorKey: 'nome',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-40',
    },
    {
      id: 'indirizzo',
      header: 'Indirizzo',
      accessorKey: 'indirizzo',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[350px]',
    },
    {
      id: 'telefono',
      header: 'Telefono',
      accessorKey: 'telefono',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-40',
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email_contatto',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-40',
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

  const rowActions: DataTableAction<Studio>[] = [
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
          title: 'Aggiornamento Eseguito',
          description: "L'elemento è stato aggiornato con successo",
        });
        setDialogOpen(false);
        setLoading(false);
      },
      onError: err => {
        setAlert({
          show: true,
          type: 'error',
          title: 'Aggiornamento Fallito',
          description: err?.message || 'Si è verificato un errore',
        });
        setLoading(false);
      },
    });
  };
  const handelNewAction = () => {
    setSelectedRow(null);
    router.push('/studio/new');
  };

  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  return (
    <>
      <TableConatiner
        btnLabel={'Nuovo Studio'}
        title={'Studio'}
        action={() => handelNewAction()}
      >
        <DataTable
          data={studioData ?? []}
          columns={columns}
          rowActions={rowActions}
          loading={isLoading}
          searchKey="nome"
          searchPlaceholder="Cerca studio..."
          emptyMessage="Nessun studio trovato"
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
export default StudioPage;
