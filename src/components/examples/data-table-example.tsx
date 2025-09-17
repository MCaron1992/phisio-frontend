'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, Download, MoreHorizontal } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumn, DataTableAction } from '@/types/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Tipo di esempio per i dati
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
}

// Dati di esempio
const sampleData: User[] = [
  {
    id: '1',
    name: 'Mario Rossi',
    email: 'mario.rossi@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15',
    createdAt: '2023-06-01',
  },
  {
    id: '2',
    name: 'Giulia Bianchi',
    email: 'giulia.bianchi@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-14',
    createdAt: '2023-07-15',
  },
  {
    id: '3',
    name: 'Luca Verdi',
    email: 'luca.verdi@example.com',
    role: 'moderator',
    status: 'inactive',
    lastLogin: '2024-01-10',
    createdAt: '2023-08-20',
  },
  {
    id: '4',
    name: 'Anna Neri',
    email: 'anna.neri@example.com',
    role: 'user',
    status: 'pending',
    lastLogin: '2024-01-12',
    createdAt: '2023-09-05',
  },
  {
    id: '5',
    name: 'Marco Blu',
    email: 'marco.blu@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-13',
    createdAt: '2023-10-10',
  },
];

// Configurazione delle colonne
const columns: DataTableColumn<User>[] = [
  {
    id: 'name',
    header: 'Nome',
    accessorKey: 'name',
    sortable: true,
    filterable: true,
    width: 'w-48',
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    sortable: true,
    filterable: true,
    width: 'w-64',
  },
  {
    id: 'role',
    header: 'Ruolo',
    accessorKey: 'role',
    sortable: true,
    filterable: true,
    width: 'w-32',
    cell: ({ value }) => {
      const roleColors = {
        admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        moderator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      };
      
      return (
        <Badge className={roleColors[value as keyof typeof roleColors]}>
          {value === 'admin' ? 'Amministratore' : 
           value === 'moderator' ? 'Moderatore' : 'Utente'}
        </Badge>
      );
    },
  },
  {
    id: 'status',
    header: 'Stato',
    accessorKey: 'status',
    sortable: true,
    filterable: true,
    width: 'w-32',
    cell: ({ value }) => {
      const statusColors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      };
      
      return (
        <Badge className={statusColors[value as keyof typeof statusColors]}>
          {value === 'active' ? 'Attivo' : 
           value === 'inactive' ? 'Inattivo' : 'In attesa'}
        </Badge>
      );
    },
  },
  {
    id: 'lastLogin',
    header: 'Ultimo Accesso',
    accessorKey: 'lastLogin',
    sortable: true,
    width: 'w-40',
    cell: ({ value }) => {
      const date = new Date(value);
      return date.toLocaleDateString('it-IT');
    },
  },
  {
    id: 'createdAt',
    header: 'Data Creazione',
    accessorKey: 'createdAt',
    sortable: true,
    width: 'w-40',
    cell: ({ value }) => {
      const date = new Date(value);
      return date.toLocaleDateString('it-IT');
    },
  },
];

// Azioni per riga
const rowActions: DataTableAction<User>[] = [
  {
    id: 'view',
    label: 'Visualizza',
    icon: <Eye className="h-4 w-4" />,
    onClick: (row) => console.log('Visualizza:', row),
  },
  {
    id: 'edit',
    label: 'Modifica',
    icon: <Edit className="h-4 w-4" />,
    onClick: (row) => console.log('Modifica:', row),
  },
  {
    id: 'download',
    label: 'Scarica Report',
    icon: <Download className="h-4 w-4" />,
    onClick: (row) => console.log('Scarica report per:', row),
  },
  {
    id: 'delete',
    label: 'Elimina',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    onClick: (row) => console.log('Elimina:', row),
    disabled: (row) => row.role === 'admin', // Non permettere di eliminare admin
  },
];

export function DataTableExample() {
  const [data, setData] = useState<User[]>(sampleData);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const handleSearch = (value: string) => {
    console.log('Ricerca:', value);
  };

  const handlePageChange = (page: number) => {
    console.log('Cambio pagina:', page);
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    console.log('Ordinamento:', column, direction);
  };

  const handleRowSelect = (rows: User[]) => {
    setSelectedRows(rows);
    console.log('Righe selezionate:', rows);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestione Utenti</h2>
          <p className="text-muted-foreground">
            Gestisci gli utenti del sistema con ricerca, filtri e azioni avanzate
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline">
            Aggiorna
          </Button>
          <Button>
            Nuovo Utente
          </Button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary">
            {selectedRows.length} utente{selectedRows.length > 1 ? 'i' : ''} selezionato{selectedRows.length > 1 ? 'i' : ''}
          </p>
        </div>
      )}

      <DataTable
        data={data}
        columns={columns}
        rowActions={rowActions}
        searchKey="search"
        searchPlaceholder="Cerca utenti..."
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onSort={handleSort}
        onRowSelect={handleRowSelect}
        loading={loading}
        emptyMessage="Nessun utente trovato"
        enableSelection={true}
        enableGlobalFilter={true}
        enableColumnFilters={true}
        enableSorting={true}
        enablePagination={true}
        pagination={{
          page: 1,
          pageSize: 10,
          total: data.length,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        className="bg-background/50 backdrop-blur-sm"
      />
    </div>
  );
}
