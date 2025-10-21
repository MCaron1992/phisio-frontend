'use client';

import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import {
  FattiGiocatore,
  useFattiGiocatori,
  useDeleteFattiGiocatore
} from '@/hooks/useCrud';
import TableConatiner from '@/components/custom/TableContainer';
import { useState } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';
import { useRouter } from 'next/navigation';

const FattiGiocatorePage = () => {
  const { data, isLoading } = useFattiGiocatori();
  const fattiGiocatoriData = data?.data;
  const { mutate: deleteFattiGiocatore } = useDeleteFattiGiocatore();

  const [selectedRow, setSelectedRow] = useState<FattiGiocatore | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  const columns: DataTableColumn<FattiGiocatore>[] = [
    
  ];

  const rowActions: DataTableAction<FattiGiocatore>[] = [
    {
      id: 'edit',
      label: 'Modifica',
      onClick: row => {
        router.push(`/fatti_giocatore/${row.id}`);
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
    setSelectedRow(null);
    router.push('/fatti_giocatore/new')
  };
  
  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  return (
    <>
      <TableConatiner
        btnLabel={'Nuovo Giocatori'}
        title={'Fatti Giocatore'}
        action={() => handelNewAction()}
      >
        <DataTable
          data={fattiGiocatoriData ?? []}
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
      {isLoading && <Loader />}
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
        onConfirm={() => deleteFattiGiocatore({ id: selectedRow?.id! })}
        onClose={() => setOpenDeleteDialog(false)}
        open={openDeleteDialog}
      />
    </>
  );
};

export default FattiGiocatorePage;