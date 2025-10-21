'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import {
  Players,
  Studio,
  useDeletePlayer,
  usePlayers,
  useUpdatePlayer,
  useStudi
} from '@/hooks/useCrud';
import TableConatiner from '@/components/custom/TableContainer';
import { useState } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GicatoriPage = () => {
  const { data, isLoading } = usePlayers();
  const userData = data?.data;
  const { mutate: deletePlayer } = useDeletePlayer();
  const { data: studiData, isLoading: studiLoading } = useStudi();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Players | null>(null);
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
      cell: ({ row }) => {
        const studio = studiData?.data.find((s: Studio) => s.id === row.id_studio);
        return studio ? (
          <Link
            href={`/studio/${studio.id}`}
            className="lg:rt-r-weight-medium text-blue-600 hover:underline "
          >
            {studio.nome}
          </Link>
        ) : (
          '-'
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
        router.push(`/giocatori/${row.id}`);
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
    setTitle('Nuovo Giocatore');
    setSelectedRow(null);
    router.push('/giocatori/new')
  };

  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  const handleDeleteConfirm = () => {
    if (!selectedRow?.id) return;

    deletePlayer(
      { id: selectedRow.id },
      {
        onSuccess: () => {
          setAlert({
            show: true,
            type: 'success',
            title: 'Eliminazione Riuscita',
            description: "L'elemento è stato eliminato con successo.",
          });
          setOpenDeleteDialog(false);
          setSelectedRow(null);
        },
        onError: err => {
          setAlert({
            show: true,
            type: 'error',
            title: 'Eliminazione Fallita',
            description: (err as Error)?.message || 'Si è verificato un errore.',
          });
          setOpenDeleteDialog(false);
        },
      },
    );
  };

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
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedRow(null);
        }}
        open={openDeleteDialog}
      />
    </>
  );
};
export default GicatoriPage;
