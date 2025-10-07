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
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UsersPage = () => {
  const { data, isLoading } = useUtenti();
  const userData = data?.data;
  const { mutate: DeleteUtente } = useDeleteUtente();
  const router = useRouter();
  const [selectedRow, setSelectedRow] = useState<Utente | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

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
        onConfirm={() =>
          selectedRow?.id && DeleteUtente({ id: selectedRow.id })
        }
        onClose={() => setOpenDeleteDialog(false)}
        open={openDeleteDialog}
      />
    </>
  );
};
export default UsersPage;
