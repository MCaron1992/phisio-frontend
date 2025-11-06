'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import {
  TestMetricaUnita,
  useTestMetricaUnita,
  useDeleteTestMetricaUnita,
  useUpdateTestMetricaUnita,
  useCreateTestMetricaUnita,
  useTests,
  useMetriche,
  useUnitaMisura,
} from '@/hooks/useCrud';
import TableConatiner from '@/components/custom/TableContainer';
import { useState } from 'react';
import TestMetricaUnitaDialog from '@/components/custom/TestMetricaUnitaDialog';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const TestMetricaUnitaTable = () => {
  const { data, isLoading } = useTestMetricaUnita();
  const { mutate: deleteTestMetricaUnita } = useDeleteTestMetricaUnita();
  const { mutate: updateTestMetricaUnita } = useUpdateTestMetricaUnita();
  const { mutate: createTestMetricaUnita } = useCreateTestMetricaUnita();
  
  // Carico le opzioni per i select
  const { data: testsData } = useTests();
  const { data: metricheData } = useMetriche();
  const { data: unitaData } = useUnitaMisura();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TestMetricaUnita | null>(null);
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

  const columns: DataTableColumn<TestMetricaUnita>[] = [
    {
      id: 'nome',
      header: 'Nome',
      accessorKey: 'nome',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'test',
      header: 'Test',
      accessorKey: 'test',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-40',
      cell: ({ row }) => {
        const test = row.test;
        return test ? (
          <Link
            href={`/system/test/${test.id}`}
            className="lg:rt-r-weight-medium text-blue-600 hover:underline"
          >
            {test.nome_abbreviato || test.nome_esteso}
          </Link>
        ) : (
          '-'
        );
      },
    },
    {
      id: 'metrica',
      header: 'Metrica',
      accessorKey: 'metrica',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-40',
      cell: ({ row }) => {
        const metrica = row.metrica;
        return metrica ? (
          <Link
            href={`/system/metrica`}
            className="lg:rt-r-weight-medium text-blue-600 hover:underline"
          >
            {metrica.nome}
          </Link>
        ) : (
          '-'
        );
      },
    },
    {
      id: 'unita',
      header: 'Unità di Misura',
      accessorKey: 'unita',
      sortable: true,
      filterable: true,
      width: 'w-24 md:w-32',
      cell: ({ row }) => {
        const unita = row.unita;
        return unita ? (
          <Link
            href={`/system/unita-misura`}
            className="lg:rt-r-weight-medium text-blue-600 hover:underline"
          >
            {unita.nome}
          </Link>
        ) : (
          '-'
        );
      },
    },
    {
      id: 'ultimo-aggiornamento',
      header: 'Ultimo aggiornamento',
      accessorKey: 'updated_at',
      sortable: true,
      width: 'w-24 md:w-32',
      cell: ({ value }) =>
        value ? new Date(value).toLocaleDateString('it-IT') : '-',
    },
  ];

  const rowActions: DataTableAction<TestMetricaUnita>[] = isSuperAdmin ? [
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
        setTitle('Modifica Test Metrica Unità');
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
  ] : [];

  const handleSave = (data: { 
    newNome?: string;
    newTestId?: number;
    newMetricaId?: number;
    newUnitaId?: number;
  }) => {
    setLoading(true);

    if (selectedRow) {
      const payload: Partial<TestMetricaUnita> = {
        id: selectedRow.id,
        nome: data.newNome,
        id_test: data.newTestId,
        id_metrica: data.newMetricaId,
        id_unita: data.newUnitaId,
      };

      updateTestMetricaUnita(payload, {
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
            description: (err as Error)?.message || 'Si è verificato un errore',
          });
          setLoading(false);
        },
      });
    } else {
      const payload: Partial<TestMetricaUnita> = {
        nome: data.newNome,
        id_test: data.newTestId,
        id_metrica: data.newMetricaId,
        id_unita: data.newUnitaId,
      };

      createTestMetricaUnita(payload, {
        onSuccess: () => {
          setAlert({
            show: true,
            type: 'success',
            title: 'Creazione Eseguita',
            description: "L'elemento è stato creato con successo",
          });
          setDialogOpen(false);
          setLoading(false);
        },
        onError: err => {
          setAlert({
            show: true,
            type: 'error',
            title: 'Creazione Fallita',
            description: (err as Error)?.message || 'Si è verificato un errore',
          });
          setLoading(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedRow?.id) return; 

    deleteTestMetricaUnita(
      { id: selectedRow.id },
      {
        onSuccess: () => {
          setAlert({
            show: true,
            type: 'success',
            title: 'Eliminazione Riuscita',
            description: 'L\'elemento è stato eliminato con successo.',
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
    setTitle('Nuovo Test Metrica Unità');
    setSelectedRow(null);
    setDialogOpen(true);
  };
  
  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  return (
    <>
      <TableConatiner
        btnLabel={'Nuovo Test Metrica Unità'}
        title={'Test Metrica Unità'}
        action={() => handelNewAction()}
        enabled={isSuperAdmin}
      >
        <DataTable
          data={data ?? []}
          columns={columns}
          rowActions={rowActions}
          loading={isLoading}
          searchKey="nome"
          searchPlaceholder="Cerca test metrica unità..."
          emptyMessage="Nessun test metrica unità trovato"
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
      <TestMetricaUnitaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        nome={selectedRow?.nome || ''}
        testId={selectedRow?.id_test}
        metricaId={selectedRow?.id_metrica}
        unitaId={selectedRow?.id_unita}
        testsOptions={testsData ?? []}
        metricheOptions={metricheData ?? []}
        unitaOptions={unitaData ?? []}
        title={title}
        mode={selectedRow ? 'edit' : 'create'}
        isCreating={loading}
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
export default TestMetricaUnitaTable;
