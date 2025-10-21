'use client';

import { useParams, useRouter } from "next/navigation";
import {
  Players,
  useDeletePlayer,
  usePlayer,
  useUpdatePlayer,
  useCreatePlayer,
  useStudi
} from '@/hooks/useCrud';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from "react";
import { Loader } from "@/components/custom/Loader";
import UniversalAlert from "@/components/custom/UniversalAlert";
import TableConatiner from '@/components/custom/TableContainer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SelectField from "@/components/custom/CustomSelectField";
import { DateInput } from "@/components/ui/date-input";
import { useForm } from "react-hook-form";


const PlayerDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const isEditMode = (id && id !== 'new');
  const playerQuery = isEditMode
    ? usePlayer(id as string)
    : { data: null, isLoading: false, isError: false, error: null };
  const { data: player, isLoading, isError, error } = playerQuery;
  const { data: studiData } = useStudi();
  const { mutate: updatePlayer } = useUpdatePlayer();
  const { mutate: createPlayer } = useCreatePlayer();

  const [alert, setAlert] = useState({
    show: false,
    type: 'success' as 'success' | 'error',
    title: '',
    description: '',
    shouldNavigate: false,
  });

  const form = useForm({
    defaultValues: {
      nome: '',
      cognome: '',
      sesso: '',
      data_nascita: '',
      etnia: '',
      id_studio: '',
    },
    values: {
      ...player,
    }
  });

  if (isLoading && !player) return <Loader />;

  if (isError)
    return (
      <UniversalAlert
        title="Errore"
        description={error?.message || 'Errore nel caricamento'}
        isVisible={true}
        type="error"
        duration={4000}
        position="top-right"
      />
    );

  if (!player && isEditMode) return <p>Nessun test trovato</p>;

  const isFormValid = () => {
    const { nome, cognome, sesso, data_nascita, etnia, id_studio } = form.watch();

    return !!nome && !!cognome && !!sesso && !!data_nascita && !!etnia && !!id_studio;
  };

  const onSubmit = (values: any) => {
    const payload = {
      ...values,
    };

    const onSuccess = () => {
      setAlert({
        show: true,
        type: 'success',
        title: isEditMode ? 'Aggiornato!' : 'Creato!',
        description: isEditMode
          ? 'Il giocatore è stato modificato correttamente.'
          : 'Il nuovo giocatore è stato creato correttamente.',
        shouldNavigate: true,
      });
    };

    const onError = (err: any) => {
      setAlert({
        show: true,
        type: 'error',
        title: 'Errore',
        description: err?.message || 'Errore durante il salvataggio.',
        shouldNavigate: false,
      });
    };
    if (isEditMode) {
      updatePlayer({ id: player.id, ...payload }, { onSuccess, onError });
    } else {
      createPlayer(payload, { onSuccess, onError });
    }
  };

  return (
    <TableConatiner
      btnLabel={'Torna indietro'}
      title={isEditMode ? 'Modifica Giocatore' : 'Nuovo giocatore'}
      action={() => router.back()}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className={'mb-3'}>Nome</Label>
            <Input {...form.register('nome')}/>
          </div>
          <div>
            <Label className={'mb-3'}>Cognome</Label>
            <Input {...form.register('cognome')}/>
          </div>
          <div>
            <Label className={'mb-3'}>Sesso</Label>
            <Select
              value={form.watch('sesso')}
              onValueChange={(value: string) => {
                form.setValue('sesso', value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Scegli il sesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Uomo</SelectItem>
                <SelectItem value="F">Donna</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={'mb-3'}>Data di Nascita</Label>
            <DateInput 
              defaultValue={form.watch('data_nascita')}
              onInput={(e) => form.setValue('data_nascita', e.currentTarget.value, { shouldValidate: true })}
            />
          </div>
          <div>
            <Label className={'mb-3'}>Etnia</Label>
            <Select
              value={form.watch('etnia')}
              onValueChange={(value: string) => {
                form.setValue('etnia', value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Scegli l'etnia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Occidentale">Occidentale</SelectItem>
                <SelectItem value="Orientale">Orientale</SelectItem>
                <SelectItem value="Africana">Africana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {true && //if super_admin else default with user studio
            <div>
              <SelectField
                options={studiData?.data}
                selectedId={form.watch('id_studio')}
                onSelectChange={(newId: string) => {
                  form.setValue('id_studio', newId, { shouldValidate: true });
                }}
                label="Studio"
                placeholder="Seleziona uno Studio..." />
            </div>
          }

        </div>

        {isEditMode &&
          <div className="text-xs text-gray-500 space-y-1 mt-3">
            <p>
              <strong>Creato il:</strong>{' '}
              {new Date(player.created_at).toLocaleDateString('it-IT')}
            </p>
            <p>
              <strong>Aggiornato il:</strong>{' '}
              {new Date(player.updated_at).toLocaleDateString('it-IT')}
            </p>
          </div>
        }

        <div className="flex justify-end gap-3 mt-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annulla
          </Button>
          <Button type="submit" disabled={!isFormValid()}>Salva</Button>
        </div>


        <UniversalAlert
          title={alert.title}
          description={alert.description}
          isVisible={alert.show}
          onClose={() => {
            if (alert.shouldNavigate) {
              router.push('/giocatori/elenco');
            } else {
              setAlert((prev) => ({ ...prev, show: false }));
            }
          }}
          type={alert.type}
          duration={3000}
          position="top-right"
        />
      </form>
    </TableConatiner >
  );
};
export default PlayerDetail;
