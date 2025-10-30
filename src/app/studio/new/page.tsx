'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TableConatiner from '@/components/custom/TableContainer';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { MultiSelect, OptionType } from '@/components/ui/multi-select';
import { Loader } from '@/components/custom/Loader';
import { useStudio, useCreateStudio, useUtenti, Utente } from '@/hooks/useCrud';
import { useForm } from 'react-hook-form';
import UniversalAlert from '@/components/custom/UniversalAlert';

const libraries: 'places'[] = ['places'];

const NewStudio = () => {
  const { id } = useParams();
  const router = useRouter();
  const { mutate: createStudio } = useCreateStudio();

  const [emailVerification, setEmailVerification] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([]);
  const [selectedAssistants, setSelectedAssistants] = useState<number[]>([]);

  const [saving, setSaving] = useState(false);

  const { data: userData, isLoading } = useUtenti();
  const users = userData?.data;

  const [adminOptions, setAdminOptions] = useState<OptionType[]>([]);
  const [assistantOptions, setAssistantOptions] = useState<OptionType[]>([]);

  const [alert, setAlert] = useState({
    show: false,
    type: 'success' as 'success' | 'error',
    title: '',
    description: '',
    shouldNavigate: false,
  });

  useEffect(() => {
    if (users) {
      const mapUtenteToOption = (utente: Utente): OptionType => ({
        id: utente.id,
        label: `${utente.nome} ${utente.cognome} - ${utente.email}`,
        value: utente.email,
      });

      const admins = users
        .filter((u: Utente) => u.ruolo === 'admin_studio')
        .map(mapUtenteToOption);

      const assistants = users
        .filter((u: Utente) => u.ruolo === 'assistente')
        .map(mapUtenteToOption);

      setAdminOptions(admins);
      setAssistantOptions(assistants);
    }
  }, [users]);

  const form = useForm({
    defaultValues: {
      nome: '',
      indirizzo: '',
      telefono: '',
      email_contatto: '',
      admin_ids: [],
    },
  });

  const onSubmit = (values: any) => {
    setSaving(true);
    if (values.email_contatto !== emailVerification) {
      setAlert({
        show: true,
        type: 'error',
        title: 'Errore Email',
        description: 'Le email non corrispondono.',
        shouldNavigate: false,
      });
      setSaving(false);
      return;
    }

    const payload = {
      ...values,
      admin_ids: [...selectedAdmins, ...selectedAssistants],
    };

    const onSuccess = () => {
      setSaving(false);
      setAlert({
        show: true,
        type: 'success',
        title: 'Creato!',
        description: 'Il nuovo studio è stato creato correttamente.',
        shouldNavigate: true,
      });
    };

    const onError = (err: any) => {
      setSaving(false);
      setAlert({
        show: true,
        type: 'error',
        title: 'Errore',
        description: err?.message || 'Errore durante il salvataggio.',
        shouldNavigate: false,
      });
    };

    createStudio(payload, { onSuccess, onError });
  };

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
        form.setValue('indirizzo', place.formatted_address, {
          shouldValidate: true,
        });
      }
    }
  };

  const handleBack = () => {
    router.push('/studio/elenco');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const isFormValid = () => {
    const { nome } = form.watch();

    return !!nome;
  };

  return (
    <LoadScript
      googleMapsApiKey={'AIzaSyBefnNz4m3q6HJ08oBfL91dTZrUSk1a1O0'}
      libraries={libraries}
    >
      <TableConatiner btnLabel={''} title={'Nuovo Studio'} action={handleBack}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white p-6 rounded shadow space-y-6"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="name">Nome</Label>
                <Input
                  type="text"
                  id="name"
                  {...form.register('nome')}
                  placeholder="Inserisci il nome"
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  type="text"
                  id="telefono"
                  {...form.register('telefono')}
                  placeholder="Inserisci il telefono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  {...form.register('email_contatto')}
                  placeholder="Inserisci un indirizzo email valido"
                />
              </div>
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
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="address">Indirizzo</Label>
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
                  {...form.register('indirizzo')}
                  placeholder="Cerca e seleziona un indirizzo"
                />
              </Autocomplete>
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="admins" className="text-sm sm:text-base">
                Aggiungi Admin/Doctor
              </Label>
              <MultiSelect
                options={adminOptions}
                selected={selectedAdmins}
                onChange={setSelectedAdmins}
                placeholder="Scegli uno o più admin"
                searchPlaceholder="Cerca admin per nome..."
                emptyText="Nessun admin disponibile"
              />
              {selectedAdmins.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedAdmins.length} admin selezionat
                  {selectedAdmins.length === 1 ? 'o' : 'i'}
                </p>
              )}
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="assistants" className="text-sm sm:text-base">
                Aggiungi Assistente
              </Label>
              <MultiSelect
                options={assistantOptions}
                selected={selectedAssistants}
                onChange={setSelectedAssistants}
                placeholder="Scegli uno o più assistenti"
                searchPlaceholder="Cerca assistente per nome..."
                emptyText="Nessun assistente disponibile"
              />
              {selectedAssistants.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedAssistants.length} assistent
                  {selectedAssistants.length === 1 ? 'e' : 'i'}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 sm:flex-none"
              >
                Annulla
              </Button>
              <Button
                disabled={saving || !isFormValid()}
                className="flex-1 sm:flex-none"
              >
                {saving ? 'Salvataggio...' : 'Crea Studio'}
              </Button>
            </div>
          </div>
          <UniversalAlert
            title={alert.title}
            description={alert.description}
            isVisible={alert.show}
            onClose={() => {
              if (alert.shouldNavigate) {
                router.push('/studio/elenco');
              } else {
                setAlert(prev => ({ ...prev, show: false }));
              }
            }}
            type={alert.type}
            duration={3000}
            position="top-right"
          />
        </form>
      </TableConatiner>
    </LoadScript>
  );
};

export default NewStudio;
