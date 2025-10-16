'use client';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import { 
  Teams, 
  useTeams, 
  useDeleteTeam, 
  useUpdateTeam, 
  useCreateTeam 
} from '@/hooks/useCrud';
import TableConatiner from '@/components/custom/TableContainer';
import { useState } from 'react';
import CustomDialog from '@/components/custom/CustomDialog';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';

const TeamsTable = () => {
  const { data, isLoading } = useTeams();
  const { mutate: deleteTeam } = useDeleteTeam();
  const { mutate: updateTeam } = useUpdateTeam();
  const { mutate: createTeam } = useCreateTeam();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Teams | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  const columns: DataTableColumn<Teams>[] = [
    {
      id: 'nome',
      header: 'Nome',
      accessorKey: 'nome',
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

  const rowActions: DataTableAction<Teams>[] = [
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
        setTitle('Modifica Squadra');
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

  const handleSave = (data: { newNome?: string }) => {
    setLoading(true);

    if (selectedRow) {
      const payload: Partial<Teams> = {
        id: selectedRow.id,
        nome: data.newNome,
      };

      updateTeam(payload, {
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
            description: (err as Error)?.message || 'An error occurred.',
          });
          setLoading(false);
        },
      });
    } else {
      const payload: Partial<Teams> = {
        nome: data.newNome,
      };

      createTeam(payload, {
        onSuccess: () => {
          setAlert({
            show: true,
            type: 'success',
            title: 'Create successful',
            description: 'The item was created successfully.',
          });
          setDialogOpen(false);
          setLoading(false);
        },
        onError: err => {
          setAlert({
            show: true,
            type: 'error',
            title: 'Create failed',
            description: (err as Error)?.message || 'An error occurred.',
          });
          setLoading(false);
        },
      });
    }
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedRow?.id) return;

    deleteTeam(
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
    setTitle('Nuova Squadra');
    setSelectedRow(null);
    setDialogOpen(true);
  };
  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  return (
    <>
      <TableConatiner
        btnLabel={'Nuova Squadra'}
        title={'Squadre'}
        action={() => handelNewAction()}
      >
        <DataTable
          data={data ?? []}
          columns={columns}
          rowActions={rowActions}
          loading={isLoading}
          searchKey="nome"
          searchPlaceholder="Cerca squadra..."
          emptyMessage="Nessuna squadra trovata"
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
        nome={selectedRow?.nome || ''}
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
export default TeamsTable;