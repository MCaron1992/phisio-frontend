'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TableConatiner from '@/components/custom/TableContainer';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { Loader } from '@/components/custom/Loader';
import { DataTable } from '@/components/ui/data-table';
import { Utente, useStudio, useUpdateStudio } from '@/hooks/useCrud';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import Link from 'next/link';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';

const libraries: 'places'[] = ['places'];

const StudioDetail = () => {
  const [userData, setUserData] = useState<Utente[]>([]);
  const [selectedRow, setSelectedRow] = useState<Utente | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { mutate: updateStudio } = useUpdateStudio();

  const [isEditMode, setIsEditMode] = useState(false);
  const { data: studio, isLoading, isError } = useStudio(params.id as string)
  const [studioData, setStudioData] = useState({
    id: params.id,
    name: studio?.nome || '',
    phone: studio?.telefono || '',
    email: studio?.email_contatto || '',
    address: studio?.indirizzo || '',
  });


  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailVerification, setEmailVerification] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (studio) {

      setStudioData({
        id: params.id as string,
        name: studio.nome,
        phone: studio.telefono,
        email: studio.email_contatto,
        address: studio.indirizzo
      });


      setName(studio.nome);
      setPhone(studio.telefono);
      setEmail(studio.email_contatto);
      setEmailVerification(studio.email_contatto);
      setAddress(studio.indirizzo);


      setUserData([
        ...(studio.admins ?? []),
        ...(studio.operators ?? [])
      ]);
    }
  }, [studio, params.id])

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoadAutocomplete = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setAddress(place.formatted_address);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const handleBack = () => {
    router.push('/studio/elenco');
  };

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

  const handleEditToggle = () => {
    if (isEditMode) {
      const payload = {
        id: Number(studioData.id),
        nome: name.trim(),
        telefono: phone.trim(),
        email_contatto: email.trim(),
        indirizzo: address.trim(),
      };

      const onSuccess = () => {
        setStudioData({
          ...studioData,
          name: payload.nome,
          phone: payload.telefono,
          email: payload.email_contatto,
          address: payload.indirizzo,
        });

        setIsEditMode(false);
        showAlert(
          'success',
          'Studio aggiornato',
          'Le modifiche sono state salvate con successo!'
        );
      };

      const onError = (err: any) => {
        setIsEditMode(true);
        showAlert(
          'error',
          'Errore di Salvataggio',
          err?.message || 'Errore durante il salvataggio delle modifiche.'
        );
      };

      updateStudio(payload, { onSuccess, onError });
    } else {
      setIsEditMode(true);
    }
  };

  const handleCancel = () => {
    setName(studioData.name);
    setPhone(studioData.phone);
    setEmail(studioData.email);
    setEmailVerification(studioData.email);
    setAddress(studioData.address);
    setIsEditMode(false);
  };

  const handleNewUser = () => {
    router.push('/utente/new');
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

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={libraries}
    >
      <UniversalAlert
        isVisible={alert.show}
        type={alert.type}
        title={alert.title}
        description={alert.description}
        onClose={() => setAlert(prev => ({ ...prev, show: false }))}
        position="top-right"
        duration={3000}
        dismissible={true}
      />

      <TableConatiner
        btnLabel={isEditMode ? '' : 'Modifica Studio'}
        title={studioData.name}
        action={handleBack}
        onBtnClick={handleEditToggle}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <motion.div
              className="grid w-full items-center gap-3"
              layout
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Label htmlFor="name">Nome</Label>
              <AnimatePresence mode="wait">
                {isEditMode ? (
                  <motion.div
                    key="edit-name"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-name"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="px-3 py-2 text-sm bg-muted rounded-md transition-colors duration-200 hover:bg-muted/80"
                  >
                    {studioData.name || <span className="text-gray-400 italic">Nessun nome</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="grid w-full items-center gap-3"
              layout
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Label htmlFor="phone">Telefono</Label>
              <AnimatePresence mode="wait">
                {isEditMode ? (
                  <motion.div
                    key="edit-phone"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      type="text"
                      id="telefono"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-phone"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="px-3 py-2 text-sm bg-muted rounded-md transition-colors duration-200 hover:bg-muted/80"
                  >
                    {studioData.phone || <span className="text-gray-400 italic">Nessun telefono</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <motion.div
              className="grid w-full items-center gap-3"
              layout
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Label htmlFor="email">Email</Label>
              <AnimatePresence mode="wait">
                {isEditMode ? (
                  <motion.div
                    key="edit-email"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-email"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="px-3 py-2 text-sm bg-muted rounded-md transition-colors duration-200 hover:bg-muted/80"
                  >
                    {studioData.email || <span className="text-gray-400 italic">Nessuna email</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="grid w-full items-center gap-3"
              layout
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Label htmlFor="email-verification">Ripeti Email</Label>
              <AnimatePresence mode="wait">
                {isEditMode ? (
                  <motion.div
                    key="edit-email-verification"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      type="email"
                      id="email-verification"
                      value={emailVerification}
                      onChange={e => setEmailVerification(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-email-verification"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="px-3 py-2 text-sm bg-muted rounded-md transition-colors duration-200 hover:bg-muted/80"
                  >
                    {studioData.email || <span className="text-gray-400 italic">Nessuna email</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div
            className="grid w-full items-center gap-3 mb-8"
            layout
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Label htmlFor="address">Indirizzo</Label>
            <AnimatePresence mode="wait">
              {isEditMode ? (
                <motion.div
                  key="edit-address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                      componentRestrictions: { country: 'it' },
                      types: ['address'],
                    }}
                  >
                    <Input
                      id="address"
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder={studioData.address}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </Autocomplete>
                </motion.div>
              ) : (
                <motion.div
                  key="view-address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 py-2 text-sm bg-muted rounded-md transition-colors duration-200 hover:bg-muted/80"
                >
                  {studioData.address || <span className="text-gray-400 italic">Nessun indirizzo</span>}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {isEditMode && (
              <motion.div
                className="flex gap-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none transition-all duration-200 hover:bg-gray-50"
                    disabled={saving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annulla
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleEditToggle}
                    disabled={saving}
                    className="flex-1 sm:flex-none transition-all duration-200 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                        />
                        Salvataggio...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salva Modifiche
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.h3
              className="text-lg font-semibold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Utenti dello Studio
            </motion.h3>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleNewUser}
                className="transition-all duration-200 hover:shadow-lg"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  + Nuovo Utente
                </motion.span>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
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
                total: userData?.length ?? 0,
              }}
            />
          </motion.div>
        </motion.div>
      </TableConatiner>
    </LoadScript>
  );
};

export default StudioDetail;
