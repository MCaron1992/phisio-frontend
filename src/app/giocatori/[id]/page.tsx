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
    return true
  }

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
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className={'mb-3'}>Nome</Label>
            <Input />
          </div>
          <div>
            <Label className={'mb-3'}>Cognome</Label>
            <Input />
          </div>
          <div>
            <Label className={'mb-3'}>Sesso</Label>
            <Select
              value={''}
              onValueChange={(value: string) => {

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
            <DateInput />
          </div>
          <div>
            <Label className={'mb-3'}>Etnia</Label>
            <Select
              value={''}
              onValueChange={(value: string) => {

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
                selectedId={''}
                onSelectChange={(newId: string) => {

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
              router.push('/system/test');
            } else {
              setAlert((prev) => ({ ...prev, show: false }));
            }
          }}
          type={alert.type}
          duration={3000}
          position="top-right"
        />
      </>
    </TableConatiner >
  );
};
export default PlayerDetail;
