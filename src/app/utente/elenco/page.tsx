'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import { Utente, useUtenti, useDeleteUtente } from '@/hooks/useCrud';
import TableConatiner from '@/components/custom /TableContainer';
import { useState } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import UniversalAlert, {
  AlertState,
} from '@/components/custom /UniversalAlert';
import DeleteConfirmDialog from '@/components/custom /DeleteConfirmDialog';
import { Loader } from '@/components/custom /Loader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UsersPage = () => {
  const { data, isLoading } = useUtenti();
  const userData = data?.data;
  const deleteMutation = useDeleteUtente();
  const router = useRouter();
  const [selectedRow, setSelectedRow] = useState<Utente | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  const showAlert = (
    type: AlertState['type'],
    title: string,
    description: string
  ) => {
    setAlert({
      show: true,
      type,
      title,
      description,
    });
  };

  const columns: DataTableColumn<Utente>[] = [
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
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'ruolo',
      header: 'Ruolo',
      accessorKey: 'ruolo',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[300px]',
    },
    {
      id: 'attivo',
      header: 'Attivo',
      accessorKey: 'attivo',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[300px]',
      cell: ({ value }) => (value == true ? 'true' : 'false'),
    },
    {
      id: 'studio',
      header: 'Studio',
      accessorKey: 'studio',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[300px]',
      cell: ({ row }) => {
        const studio = row.studi ?? [];
        return (
          <div>
            {studio.length === 0 ? (
              <span>-- --</span>
            ) : (
              <Link
                href={`/studio/${studio[0]?.id}`}
                className="lg:rt-r-weight-medium text-blue-600 hover:underline"
              >
                {studio[0]?.nome}
              </Link>
            )}
          </div>
        );
      },
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

  const rowActions: DataTableAction<Utente>[] = [
    {
      id: 'edit',
      label: 'Modifica',
      onClick: row => {
        router.push(`/utente/${row.id}`);
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

  const handelNewAction = () => {
    router.push('/utente/new');
  };

  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  const handleDeleteConfirm = async () => {
    if (!selectedRow?.id) return;

    setOpenDeleteDialog(false);

    setTimeout(async () => {
      setIsDeleting(true);

      try {
        const response = await deleteMutation.mutateAsync({
          id: selectedRow.id,
        });

        const successMessage =
          response?.message || 'Utente eliminato con successo';

        setIsDeleting(false);
        showAlert('success', 'Utente eliminato', successMessage);
        setSelectedRow(null);
      } catch (error: any) {
        setIsDeleting(false);

        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Si è verificato un errore durante l'eliminazione";

        showAlert('error', 'Errore di eliminazione', errorMessage);
      }
    }, 600);
  };

  return (
    <>
      <TableConatiner
        btnLabel={'Nuovo Utente'}
        title={'Utente'}
        action={() => handelNewAction()}
      >
        <DataTable
          data={userData ?? []}
          columns={columns}
          rowActions={rowActions}
          loading={isLoading}
          searchKey="nome"
          searchPlaceholder="Cerca utente..."
          emptyMessage="Nessun utente trovato"
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
        onConfirm={handleDeleteConfirm}
        onClose={() => setOpenDeleteDialog(false)}
        open={openDeleteDialog}
        title="Elimina Utente"
        description={`Sei sicuro di voler eliminare l'utente ${selectedRow?.nome} ${selectedRow?.cognome}? Questa azione non può essere annullata.`}
      />

      {isDeleting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
            <Loader text=" Operazione in Corso " />
          </div>
        </div>
      )}
    </>
  );
};
export default UsersPage;
