'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import TableConatiner from '@/components/custom/TableContainer';
import {
  useUtente,
  useCreateUtente,
  useUpdateUtente,
  useDeleteUtente,
  useStudi,
  Studio,
} from '@/hooks/useCrud';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, BadgeCheck, CircleX } from 'lucide-react';
import { Loader } from '@/components/custom/Loader';
import { AxiosError } from 'axios';

const ROLE_MAPPING: Record<string, string> = {
  super_admin: 'super',
  admin_studio: 'admin',
  assistente: 'assistente',
  utente: 'utente',
};

const ROLE_REVERSE_MAPPING: Record<string, string> = {
  super: 'super_admin',
  admin: 'admin_studio',
  assistente: 'assistente',
  utente: 'utente',
};

const UserDetail = () => {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const {
    data: utente,
    isLoading,
    error,
  } = useUtente(isNew ? '' : (params.id as string));

  const createMutation = useCreateUtente();
  const updateMutation = useUpdateUtente();
  const deleteMutation = useDeleteUtente();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [emailVerification, setEmailVerification] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [role, setRole] = useState('');
  const [studioQuery, setStudioQuery] = useState('');
  const [selectedStudi, setSelectedStudi] = useState<Studio[]>([]);
  const [studioMode, setStudioMode] = useState<'nuovo' | 'esistente' | null>(
    null
  );
  const [studioNome, setStudioNome] = useState('');
  const [studioIndirizzo, setStudioIndirizzo] = useState('');
  const [studioTelefono, setStudioTelefono] = useState('');
  const [studioEmail, setStudioEmail] = useState('');

  const { data: studiData, isLoading: isLoadingStudi } = useStudi(
    studioQuery.length > 2 ? { search: studioQuery } : undefined
  );

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    if (utente && !isNew) {
      setName(utente.nome || '');
      setSurname(utente.cognome || '');
      setEmail(utente.email || '');
      setEmailVerification(utente.email || '');

      const frontendRole = ROLE_MAPPING[utente.ruolo || ''] || '';
      setRole(frontendRole);
      setStudioMode('esistente');

      if (utente.studi && utente.studi.length > 0) {
        setSelectedStudi(utente.studi);
      }
    }
  }, [utente, isNew]);

  const passwordsMatch = password === password2 && password.length > 0;

  const passwordValidations = [
    {
      text: 'Almeno 8 caratteri',
      valid: password.length >= 8,
    },
    {
      text: 'Include almeno 1 lettera maiuscola',
      valid: /[A-Z]/.test(password),
    },
    {
      text: 'Include almeno 1 lettera minuscola',
      valid: /[a-z]/.test(password),
    },
    {
      text: 'Include almeno 1 cifra',
      valid: /\d/.test(password),
    },
    {
      text: 'Le password coincidono',
      valid: passwordsMatch,
    },
  ];

  const password2Validations = [
    {
      text: 'Almeno 8 caratteri',
      valid: password2.length >= 8,
    },
    {
      text: 'Include almeno 1 lettera maiuscola',
      valid: /[A-Z]/.test(password2),
    },
    {
      text: 'Include almeno 1 lettera minuscola',
      valid: /[a-z]/.test(password2),
    },
    {
      text: 'Include almeno 1 cifra',
      valid: /\d/.test(password2),
    },
    {
      text: 'Le password coincidono',
      valid: passwordsMatch,
    },
  ];

  const handleSave = async () => {
    if (!name.trim() || !surname.trim() || !email.trim()) {
      showAlert(
        'error',
        'Campi obbligatori mancanti',
        'Nome, Cognome ed Email sono obbligatori'
      );
      return;
    }

    if (!role) {
      showAlert('error', 'Ruolo mancante', "Seleziona un ruolo per l'utente");
      return;
    }

    if (isNew && email !== emailVerification) {
      showAlert('error', 'Email non coincidono', 'Le email non coincidono');
      return;
    }

    if (isNew) {
      if (!password || password.length < 8) {
        showAlert(
          'error',
          'Password non valida',
          'La password deve essere di almeno 8 caratteri'
        );
        return;
      }

      if (!/[A-Z]/.test(password)) {
        showAlert(
          'error',
          'Password non valida',
          'La password deve contenere almeno una lettera maiuscola'
        );
        return;
      }

      if (!/[a-z]/.test(password)) {
        showAlert(
          'error',
          'Password non valida',
          'La password deve contenere almeno una lettera minuscola'
        );
        return;
      }

      if (!/\d/.test(password)) {
        showAlert(
          'error',
          'Password non valida',
          'La password deve contenere almeno una cifra'
        );
        return;
      }

      if (password !== password2) {
        showAlert(
          'error',
          'Password non coincidono',
          'Le password non coincidono'
        );
        return;
      }
    }

    try {
      const backendRole = ROLE_REVERSE_MAPPING[role];

      const userData: any = {
        nome: name.trim(),
        cognome: surname.trim(),
        email: email.trim(),
        ruolo: backendRole,
        attivo: true,
      };

      if (isNew) {
        userData.password = password;
      }

      if (role === 'super') {
        userData.studio_action = 'none';
      } else if (studioMode === 'esistente') {
        userData.studio_action = 'assign';
        userData.studio_ids = selectedStudi.map(s => s.id);
      } else if (studioMode === 'nuovo') {
        if (!studioNome.trim()) {
          showAlert(
            'error',
            'Nome studio mancante',
            'Il nome dello studio è obbligatorio'
          );
          return;
        }

        userData.studio_action = 'create';
        userData.studio_data = {
          nome: studioNome.trim(),
          indirizzo: studioIndirizzo.trim() || null,
          telefono: studioTelefono.trim() || null,
          email_contatto: studioEmail.trim() || null,
        };
      } else if (role !== 'super') {
        showAlert(
          'error',
          'Studio obbligatorio',
          'Seleziona il tipo di studio per questo utente'
        );
        return;
      }

      if (!isNew) {
        userData.id = parseInt(params.id as string);
      }
      console.log(userData)
      if (isNew) {
        await createMutation.mutateAsync(userData);
        showAlert(
          'success',
          'Utente creato',
          "L'utente è stato creato con successo!"
        );
      } else {
        await updateMutation.mutateAsync(userData);
        showAlert(
          'success',
          'Utente aggiornato',
          'Le modifiche sono state salvate con successo!'
        );
      }

      setTimeout(() => {
        router.push('/utente/elenco');
      }, 1000);
    } catch (error: any) {
      console.error('Error saving user:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Si è verificato un errore durante il salvataggio';

      showAlert('error', 'Errore di salvataggio', errorMessage);
    }
  };

  const handleBack = () => {
    router.push('/utente/elenco');
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);

    setTimeout(async () => {
      setIsDeleting(true);

      try {
        const response = await deleteMutation.mutateAsync({
          id: parseInt(params.id as string),
        });

        const successMessage =
          response?.message || 'Utente eliminato con successo';

        setIsDeleting(false);
        showAlert('success', 'Utente eliminato', successMessage);

        setTimeout(() => {
          router.push('/utente/elenco');
        }, 500);
      } catch (error: unknown) {
        setIsDeleting(false);

        let errorMessage = "Si è verificato un errore durante l'eliminazione";

        if (error instanceof AxiosError && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        showAlert('error', 'Errore di eliminazione', errorMessage);
      }
    }, 300);
  };

  const handleAddStudio = (studio: Studio) => {
    if (!selectedStudi.find(s => s.id === studio.id)) {
      setSelectedStudi(prev => [...prev, studio]);
    }
    setStudioQuery('');
  };

  if (isLoading && !isNew) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error && !isNew) {
    return (
      <TableConatiner
        btnLabel={''}
        title={'Errore Caricamento Utente'}
        action={handleBack}
      >
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Errore nel caricamento dei dati utente.
          </p>
          <Button onClick={handleBack} variant="outline">
            Torna all&apos;elenco
          </Button>
        </div>
      </TableConatiner>
    );
  }

  return (
    <>
      <TableConatiner
        btnLabel={''}
        title={isNew ? 'Nuovo Utente' : 'Modifica Utente'}
        action={handleBack}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Inserisci il nome"
              />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="surname">Cognome</Label>
              <Input
                type="text"
                id="surname"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                placeholder="Inserisci il cognome"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Inserisci un indirizzo email valido"
              />
            </div>
            {isNew && (
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="email-verification">Ripeti Email</Label>
                <Input
                  type="email"
                  id="email-verification"
                  value={emailVerification}
                  onChange={e => setEmailVerification(e.target.value)}
                  placeholder="Ripeti la tua email"
                />
              </div>
            )}
          </div>

          {isNew && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="grid w-full items-center gap-3 relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Inserisci la tua password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ul className="text-xs sm:text-sm mt-1 space-y-1">
                  {passwordValidations.map(rule => (
                    <li
                      key={rule.text}
                      className={`flex items-center gap-2 ${rule.valid ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      {rule.valid ? (
                        <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <CircleX className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      {rule.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid w-full items-center gap-3 relative">
                <Label htmlFor="password2">Conferma Password</Label>
                <div className="relative">
                  <Input
                    id="password2"
                    type={showPassword2 ? 'text' : 'password'}
                    value={password2}
                    onChange={e => setPassword2(e.target.value)}
                    placeholder="Ripeti la tua password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(prev => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  >
                    {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ul className="text-xs sm:text-sm mt-1 space-y-1">
                  {password2Validations.map(rule => (
                    <li
                      key={rule.text}
                      className={`flex items-center gap-2 ${rule.valid ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      {rule.valid ? (
                        <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <CircleX className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      {rule.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {isNew && (
            <RadioGroup value={role} onValueChange={setRole} className="mt-3">
              <Label className="text-sm sm:text-base">Ruolo nel sistema</Label>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <RadioGroupItem value="super" id="r1" />
                  <Label htmlFor="r1" className="text-sm sm:text-base">
                    Super Admin
                  </Label>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <RadioGroupItem value="admin" id="r2" />
                  <Label htmlFor="r2" className="text-sm sm:text-base">
                    Admin - Dottore - Gestore Studio
                  </Label>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <RadioGroupItem value="assistente" id="r3" />
                  <Label htmlFor="r3" className="text-sm sm:text-base">
                    Assistente - Personale Studio
                  </Label>
                </div>
              </div>
            </RadioGroup>
          )}
          {role !== 'super' && (
            <div className="mt-3">
              {isNew && (
                <>
                  <Label className="text-sm sm:text-base mb-2">
                    Tipo di Studio
                  </Label>
                  <Select
                    value={studioMode || ''}
                    onValueChange={(value: 'nuovo' | 'esistente') =>
                      setStudioMode(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Scegli il tipo di studio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuovo">Nuovo studio</SelectItem>
                      <SelectItem value="esistente">Studio esistente</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
              {studioMode === 'nuovo' && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid w-full items-center gap-3">
                      <Label
                        htmlFor="studio-nome"
                        className="text-sm sm:text-base"
                      >
                        Nome Studio
                      </Label>
                      <Input
                        id="studio-nome"
                        value={studioNome}
                        onChange={e => setStudioNome(e.target.value)}
                        placeholder="Inserisci il nome dello studio"
                      />
                    </div>
                    <div className="grid w-full items-center gap-3">
                      <Label
                        htmlFor="studio-indirizzo"
                        className="text-sm sm:text-base"
                      >
                        Indirizzo
                      </Label>
                      <Input
                        id="studio-indirizzo"
                        value={studioIndirizzo}
                        onChange={e => setStudioIndirizzo(e.target.value)}
                        placeholder="Inserisci l'indirizzo"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid w-full items-center gap-3">
                      <Label
                        htmlFor="studio-telefono"
                        className="text-sm sm:text-base"
                      >
                        Telefono
                      </Label>
                      <Input
                        id="studio-telefono"
                        value={studioTelefono}
                        onChange={e => setStudioTelefono(e.target.value)}
                        placeholder="Inserisci il numero di telefono"
                      />
                    </div>
                    <div className="grid w-full items-center gap-3">
                      <Label
                        htmlFor="studio-email"
                        className="text-sm sm:text-base"
                      >
                        Email di Contatto
                      </Label>
                      <Input
                        id="studio-email"
                        type="email"
                        value={studioEmail}
                        onChange={e => setStudioEmail(e.target.value)}
                        placeholder="Inserisci l'email di contatto"
                      />
                    </div>
                  </div>
                </div>
              )}

              {studioMode === 'esistente' && (
                <div className="mt-4 relative">
                  <Label
                    htmlFor="studio-search"
                    className="text-sm sm:text-base pb-2"
                  >
                    Cerca Studio Esistente
                  </Label>
                  <Input
                    id="studio-search"
                    value={studioQuery}
                    onChange={e => {
                      setStudioQuery(e.target.value);
                    }}
                    placeholder="Digita almeno 3 caratteri per cercare..."
                  />

                  {isLoadingStudi && studioQuery.length > 2 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow p-3 text-sm text-gray-500">
                      Ricerca in corso...
                    </div>
                  )}

                  {!isLoadingStudi &&
                    studiData?.data &&
                    studiData.data.length > 0 &&
                    studioQuery.length > 2 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
                        {studiData.data.map((studio: any) => (
                          <li
                            key={studio.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => {
                              handleAddStudio(studio);
                              setStudioQuery('');
                            }}
                          >
                            <div className="font-medium text-sm">
                              {studio.nome}
                            </div>
                            {studio.stats && (
                              <div className="text-xs text-gray-500 mt-1">
                                {studio.stats.total_utenti} utenti •{' '}
                                {studio.stats.total_giocatori} giocatori
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                  {!isLoadingStudi &&
                    studioQuery.length > 2 &&
                    (!studiData?.data || studiData.data.length === 0) && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow p-3 text-sm text-gray-500">
                        Nessuno studio trovato
                      </div>
                    )}

                  {selectedStudi && selectedStudi.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {selectedStudi.map((studio: Studio) => (
                        <div
                          key={studio.id}
                          className="p-3 bg-blue-50 border border-blue-200 rounded-md"
                        >
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-sm text-blue-900">{studio.nome}</p>
                            <button
                              onClick={() =>
                                setSelectedStudi(selectedStudi.filter(s => s.id !== studio.id))
                              }
                              className="text-blue-600 hover:text-blue-800 text-xs underline"
                            >
                              Rimuovi
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6">

            {/* Right side: Cancel and Save buttons */}
            <div className="flex gap-4 sm:ml-auto">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 sm:flex-none"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending
                }
              >
                Annulla
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending
                }
                className="flex-1 sm:flex-none"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Salvataggio...'
                  : isNew
                    ? studioMode === 'nuovo'
                      ? 'Crea Utente e Studio'
                      : 'Crea Utente'
                    : 'Aggiorna Utente'}
              </Button>
            </div>
          </div>
        </div>

        <UniversalAlert
          isVisible={alert.show}
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert({ ...alert, show: false })}
          position="top-right"
          duration={3000}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          title="Elimina Utente"
          description={`Sei sicuro di voler eliminare l'utente ${name} ${surname}? Questa azione non può essere annullata.`}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </TableConatiner>

      {isDeleting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
            <Loader />
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                Eliminazione in corso...
              </p>
              <p className="text-sm text-gray-500 mt-1">Attendere prego</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetail;
