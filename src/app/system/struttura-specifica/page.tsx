'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import {
  StruttureSpecifiche,
  useStruttureSpecifiche,
  useRegioniAnatomiche,
  useStrutturePrincipali,
  useDeleteStrutturaSpecifica,
  useUpdateStrutturaSpecifica,
  useCreateStrutturaSpecifica,
} from '@/hooks/useCrud';
import TableConatiner from '@/components/custom/TableContainer';
import { useState } from 'react';
import CustomDialog from '@/components/custom/CustomDialog';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';
import { useAuth } from '@/hooks/useAuth';

const StrutturaSpecificaTable = () => {
  const { data, isLoading } = useStruttureSpecifiche();
  const { data: regioniData } = useRegioniAnatomiche();
  const { data: struttureData } = useStrutturePrincipali();
  const { mutate: deleteStrutturaSpecifica } = useDeleteStrutturaSpecifica();
  const { mutate: updateStrutturaSpecifica } = useUpdateStrutturaSpecifica();
  const { mutate: createStrutturaSpecifica } = useCreateStrutturaSpecifica();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<StruttureSpecifiche | null>(
    null
  );
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const isSuperAdmin = user?.data.ruolo === 'super_admin';

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  const columns: DataTableColumn<StruttureSpecifiche>[] = [
    {
      id: 'nome',
      header: 'Nome',
      accessorKey: 'nome',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-40',
    },
    {
      id: 'descrizione',
      header: 'Descrizione',
      accessorKey: 'descrizione',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[500px]',
    },
    {
      id: 'regione',
      header: 'Regione Anatomica',
      accessorKey: 'regione',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[100px]',
      cell: ({ row }) => row.regione_anatomica?.nome ?? '-',
    },
    {
      id: 'struttura',
      header: 'Struttura Principale',
      accessorKey: 'struttura',
      sortable: true,
      filterable: true,
      width: 'w-64 md:w-96 lg:w-[100px]',
      cell: ({ row }) => row.struttura_principale?.nome ?? '-',
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

  const rowActions: DataTableAction<StruttureSpecifiche>[] = isSuperAdmin ? [
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
        setTitle('Modifica Struttura Specifica');
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

  const handleSave = (data: { newDescrizione?: string, newNome?: string, newRegioneId?: number, newStrutturaId?: number }) => {
    setLoading(true);

    if (selectedRow) {
      const payload: Partial<StruttureSpecifiche> = {
        id: selectedRow.id,
        descrizione: data.newDescrizione,
        nome: data.newNome,
        id_regione_anatomica: data.newRegioneId || selectedRow.regione_anatomica?.id,
        id_struttura_principale: data.newStrutturaId || selectedRow.struttura_principale?.id
      };

      updateStrutturaSpecifica(payload, {
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
      const payload: Partial<StruttureSpecifiche> = {
        descrizione: data.newDescrizione,
        nome: data.newNome,
        id_regione_anatomica: data.newRegioneId,
        id_struttura_principale: data.newStrutturaId
      };

      createStrutturaSpecifica(payload, {
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
    };
  };

  const handleDeleteConfirm = () => {
    if (!selectedRow?.id) return;

    deleteStrutturaSpecifica(
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
    setTitle('Nuova Struttura Specifica');
    setSelectedRow(null);
    setDialogOpen(true);
  };
  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  return (
    <>
      <TableConatiner
        btnLabel={'Nuova Struttura Specifica'}
        title={'Strutture Specifiche'}
        action={() => handelNewAction()}
        enabled={isSuperAdmin}
      >
        <DataTable
          data={data ?? []}
          columns={columns}
          rowActions={rowActions}
          loading={isLoading}
          searchKey="nome"
          searchPlaceholder="Cerca struttura specifica..."
          emptyMessage="Nessuna struttura specifica trovata"
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
        nome={selectedRow?.nome || ''}
        regioniOptions={regioniData}
        regioneId={selectedRow?.regione_anatomica?.id}
        struttureOptions={struttureData}
        strutturaId={selectedRow?.struttura_principale?.id}
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
export default StrutturaSpecificaTable;