'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import { Test, useTests, useDeleteTest } from '@/hooks/useCrud';
import TableConatiner from '@/components/custom/TableContainer';
import { useState } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import MediaPreviewDialog from '@/components/custom/MediaPreviewDialog';
const TestTable = () => {
  const { data, isLoading } = useTests();
  const router = useRouter();
  const { mutate: deleteTest } = useDeleteTest();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Test | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { user, isLoadingUser } = useAuth();
  const isSuperAdmin = user?.data.ruolo === 'super_admin';

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });
  const columns: DataTableColumn<Test>[] = [
    {
      id: 'nome_abbreviato',
      header: 'Nome breve',
      accessorKey: 'nome_abbreviato',
      sortable: true,
      filterable: true,
      width: 'w-24 md:w-32',
    },
    {
      id: 'nome_esteso',
      header: 'nome_esteso',
      accessorKey: 'nome_esteso',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'lateralita',
      header: 'lateralita',
      accessorKey: 'lateralita',
      sortable: true,
      filterable: true,
      width: 'w-24 md:w-32',
    },
    {
      id: 'istruzioni_verbali',
      header: 'istruzioni_verbali',
      accessorKey: 'istruzioni_verbali',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'tempo_di_recupero',
      header: 'tempo_di_recupero',
      accessorKey: 'tempo_di_recupero',
      sortable: true,
      filterable: true,
      width: 'w-24 md:w-32',
      cell: ({ value }) => (
        <div style={{ textAlign: 'center', width: '100%' }}>{value ?? '-'}</div>
      ),
    },
    {
      id: 'categoria_funzionale',
      header: 'Categoria funzionale',
      accessorKey: 'categoria_funzionale',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-64 lg:w-[350px]',
      cell: ({ row }) => {
        const categoria = row.categoria_funzionale;
        return categoria ? (
          <Link
            href={`/system/categoria-funzionale`}
            className="lg:rt-r-weight-medium text-blue-600 hover:underline "
          >
            {categoria.nome}
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

  const rowActions: DataTableAction<Test>[] = isSuperAdmin ? [
    {
      id: 'preview',
      label: 'Anteprima',
      onClick: row => {
        setSelectedRow(row);
        setPreviewOpen(true)
      },
      icon: <Eye className="h-4 w-4" />,
    },
    {
      id: 'view',
      label: 'Dettaglio',
      onClick: row => {
        router.push(`/system/test/${row.id}`);
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
  ] : [];

  const handleDeleteConfirm = () => {
    if (!selectedRow?.id) return;

    deleteTest(
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

  const handelNewAction = () => {
    setTitle('Nuovo Test');
    setSelectedRow(null);
    router.push('/system/test/new');
  };
  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  return (
    <>
      <TableConatiner
        btnLabel={'Nuovo Test'}
        title={'Test'}
        action={() => handelNewAction()}
        enabled={isSuperAdmin}
      >
        <DataTable
          data={data ?? []}
          columns={columns}
          rowActions={rowActions}
          loading={isLoading}
          searchKey="nome"
          searchPlaceholder="Cerca test..."
          emptyMessage="Nessun test trovato"
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
      <MediaPreviewDialog 
        open={previewOpen} 
        title='Anteprima'
        foto={selectedRow?.foto}
        video={selectedRow?.video}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedRow(null);
        }}/>
    </>
  );
};
export default TestTable;
