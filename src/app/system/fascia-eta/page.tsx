'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import {
  FasceEta,
  useFasceEta,
  useDeleteFasciaEta,
  useUpdateFasciaEta,
  useCreateFasciaEta,
} from '@/hooks/useCrud';
import TableConatiner from '@/components/custom/TableContainer';
import { useState } from 'react';
import CustomDialog from '@/components/custom/CustomDialog';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';

const FasciaEtaTable = () => {
  const { data, isLoading } = useFasceEta();
  const { mutate: deleteFasciaEta } = useDeleteFasciaEta();
  const { mutate: updateFasciaEta } = useUpdateFasciaEta();
  const { mutate: createFasciaEta } = useCreateFasciaEta();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FasceEta | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

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
      onClick: row => {
        setSelectedRow(row);
        setOpenDeleteDialog(true);
      },
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
    },
  ];

  const handleSave = (data: { newDescrizione?: string}) => {
    setLoading(true);

    if (selectedRow) {
      const payload: Partial<FasceEta> = {
        id: selectedRow.id,
        descrizione: data.newDescrizione,
      };

      updateFasciaEta(payload, {
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
    } else {
      const payload: Partial<FasceEta> = {
        descrizione: data.newDescrizione,
      };
      
      createFasciaEta(payload, {
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
          console.log(err)
          setAlert({
            show: true,
            type: 'error',
            title: 'Creazione Fallita',
            description: err?.message || 'Si è verificato un errore',
          });
          setLoading(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedRow?.id) return; 

    deleteFasciaEta(
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
    setTitle('Nuova Fascia eta');
    setSelectedRow(null);
    setDialogOpen(true);
  };
  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

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
export default FasciaEtaTable;
