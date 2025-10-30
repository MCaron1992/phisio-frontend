'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Paziente,
  useCreatePaziente,
  usePaziente,
  useStudi,
  useUpdatePaziente,
} from '@/hooks/useCrud';
import { useForm } from 'react-hook-form';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert from '@/components/custom/UniversalAlert';
import AnimatedButton from '@/components/custom/AnimatedButton';
import SelectField from '@/components/custom/CustomSelectField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateInput } from '@/components/ui/date-input';
import { AxiosError } from 'axios';

type FormValues = Omit<
  Paziente,
  'id' | 'id_studio' | 'created_at' | 'updated_at'
> & {
  id_studio: string;
};

const Anagrafica: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const isEditMode = id && id !== 'new';

  const pazienteQuery = usePaziente(isEditMode ? (id as string) : undefined);
  const { data: paziente, isLoading, isError, error } = pazienteQuery;

  const { data: studiData } = useStudi();
  const { mutate: updatePaziente } = useUpdatePaziente();
  const { mutate: createPaziente } = useCreatePaziente();

  const [alert, setAlert] = useState({
    show: false,
    type: 'success' as 'success' | 'error',
    title: '',
    description: '',
    shouldNavigate: false,
  });

  const form = useForm<FormValues>({
    defaultValues: useMemo(
      () => ({
        nome: '',
        cognome: '',
        codice_fiscale: '',
        sesso: '',
        data_nascita: '',
        etnia: '',
        id_studio: '',
      }),
      []
    ),
    values: paziente ?? undefined,
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      const payload: Partial<Paziente> = {
        ...values,
        id_studio: Number(values.id_studio),
      };
      const onSuccess = () => {
        setAlert({
          show: true,
          type: 'success',
          title: isEditMode ? 'Aggiornato!' : 'Creato!',
          description: isEditMode
            ? 'Il paziente è stato aggiornato correttamente.'
            : 'Il nuovo paziente è stato creato correttamente.',
          shouldNavigate: true,
        });
      };
      const onError = (err: unknown) => {
        const message =
          err instanceof AxiosError
            ? err.message
            : 'Errore durante il salvataggio.';
        setAlert({
          show: true,
          type: 'error',
          title: 'Errore',
          description: message,
          shouldNavigate: false,
        });
      };

      if (isEditMode && paziente) {
        updatePaziente({ id: paziente.id, ...payload }, { onSuccess, onError });
      } else {
        createPaziente(payload, { onSuccess, onError });
      }
    },
    [isEditMode, paziente, updatePaziente, createPaziente]
  );

  if (isLoading && !paziente) return <Loader />;
  if (isError)
    return (
      <UniversalAlert
        title="Errore"
        description={error?.message || 'Errore nel caricamento'}
        isVisible
        type="error"
        duration={4000}
        position="top-right"
      />
    );
  if (!paziente && isEditMode)
    return (
      <p className="text-sm text-muted-foreground">Nessun paziente trovato.</p>
    );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="bg-gradient-to-br from-background to-muted/20 p-6 rounded-lg border border-border/60 shadow-sm space-y-6"
    >
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <legend className="sr-only">Dati Anagrafici</legend>

        <div>
          <Label className="mb-3" htmlFor="nome">
            Nome *
          </Label>
          <Input id="nome" {...form.register('nome', { required: true })} />
        </div>

        <div>
          <Label className="mb-3" htmlFor="cognome">
            Cognome *
          </Label>
          <Input
            id="cognome"
            {...form.register('cognome', { required: true })}
          />
        </div>

        <div>
          <Label className="mb-3" htmlFor="codice_fiscale">
            Codice Fiscale
          </Label>
          <Input id="codice_fiscale" {...form.register('codice_fiscale')} />
        </div>

        <div>
          <Label className="mb-3">Sesso *</Label>
          <Select
            value={form.watch('sesso')}
            onValueChange={value => form.setValue('sesso', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona sesso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Maschio</SelectItem>
              <SelectItem value="F">Femmina</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3" htmlFor="data_nascita">
            Data di Nascita *
          </Label>
          <DateInput
            id="data_nascita"
            defaultValue={form.watch('data_nascita')}
            onInput={e => form.setValue('data_nascita', e.currentTarget.value)}
          />
        </div>

        <div>
          <Label className="mb-3">Etnia *</Label>
          <Select
            value={form.watch('etnia')}
            onValueChange={value => form.setValue('etnia', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona etnia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Occidentale">Occidentale</SelectItem>
              <SelectItem value="Orientale">Orientale</SelectItem>
              <SelectItem value="Africana">Africana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <legend className="sr-only">Studio</legend>
        <SelectField
          options={studiData?.data}
          selectedId={form.watch('id_studio')}
          onSelectChange={(newId: string) => form.setValue('id_studio', newId)}
          label="Studio"
          placeholder="Seleziona uno Studio..."
          id={'1'}
        />
      </fieldset>

      <div className="flex justify-end mt-4">
        <AnimatedButton />
      </div>

      {isEditMode && paziente && (
        <footer className="text-xs text-muted-foreground space-y-1 mt-4 pt-4 border-t border-border/50 bg-blue-50/30 dark:bg-blue-950/20 rounded-md p-3">
          <p>
            <span className="font-medium text-blue-700 dark:text-blue-300">
              Creato il:
            </span>{' '}
            {new Date(paziente.created_at).toLocaleDateString('it-IT')}
          </p>
          <p>
            <span className="font-medium text-blue-700 dark:text-blue-300">
              Aggiornato il:
            </span>{' '}
            {new Date(paziente.updated_at).toLocaleDateString('it-IT')}
          </p>
        </footer>
      )}

      <UniversalAlert
        title={alert.title}
        description={alert.description}
        isVisible={alert.show}
        onClose={() => {
          if (alert.shouldNavigate) {
            router.push('/pazienti/elenco');
          } else {
            setAlert(prev => ({ ...prev, show: false }));
          }
        }}
        type={alert.type}
        duration={3000}
        position="top-right"
      />
    </form>
  );
};

export default React.memo(Anagrafica);
