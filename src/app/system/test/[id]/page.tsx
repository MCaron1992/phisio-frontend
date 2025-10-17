'use client';

import { useParams, useRouter } from 'next/navigation';
import TableConatiner from '@/components/custom/TableContainer';
import { useTest, useUpdateTest, useCreateTest, useCategorieFunzionali } from '@/hooks/useCrud';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert from '@/components/custom/UniversalAlert';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import SelectField from '@/components/custom/CustomSelectField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TestDetail = () => {
  const { id } = useParams();
  const isEditMode = (id && id !== 'new');
  const router = useRouter();
  const testQuery = isEditMode
    ? useTest(id as string)
    : { data: null, isLoading: false, isError: false, error: null };
  const { data: test, isLoading, isError, error } = testQuery
  const { data: categorieData } = useCategorieFunzionali();
  const { mutate: updateTest } = useUpdateTest();
  const { mutate: createTest } = useCreateTest();

  const [alert, setAlert] = useState({
    show: false,
    type: 'success' as 'success' | 'error',
    title: '',
    description: '',
    shouldNavigate: false,
  });

  const form = useForm({
    defaultValues: {
      nome_abbreviato: '',
      nome_esteso: '',
      descrizione: '',
      lateralita: '',
      tempo_di_recupero: '',
      istruzioni_verbali: '',
      id_categoria_funzionale: '',
    },
    values: test,
  });

  if (isLoading && !test) return <Loader />;

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

  if (!test && isEditMode) return <p>Nessun test trovato</p>;

  const onSubmit = (values: any) => {
    const payload = {
      ...values,
      tempo_di_recupero: Number(values.tempo_di_recupero),
      id_categoria_funzionale: Number(values.id_categoria_funzionale),
    };

    const onSuccess = () => {
      setAlert({
        show: true,
        type: 'success',
        title: isEditMode ? 'Aggiornato!' : 'Creato!',
        description: isEditMode
          ? 'Il test è stato modificato correttamente.'
          : 'Il nuovo test è stato creato correttamente.',
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
      updateTest({ id: test.id, ...payload }, { onSuccess, onError });
    } else {
      createTest(payload, { onSuccess, onError });
    }
  };

  const isFormValid = () => {
    const { nome_abbreviato, nome_esteso, lateralita, id_categoria_funzionale } = form.watch();

    return !!nome_abbreviato &&
      !!nome_esteso &&
      !!lateralita &&
      !!id_categoria_funzionale;
  };

  const fakeImage = 'https://picsum.photos/400/300';
  const fakeVideo = 'https://www.w3schools.com/html/mov_bbb.mp4';

  const fotoUrl = test?.foto || fakeImage;
  const videoUrl = test?.video || fakeVideo;

  return (
    <TableConatiner
      btnLabel={'Torna indietro'}
      title={isEditMode ? 'Modifica Test' : 'Nuovo Test'}
      action={() => router.back()}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow space-y-6"
      >
        <div className=" flex justify-between">
          <div>
            {!test?.foto ? (
              <div className="flex items-center gap-4">
                <Label>Foto</Label>
                <img
                  src={fotoUrl}
                  alt="Foto Test"
                  className="w-32 h-32 object-cover rounded"
                />
                <Button type="button" variant="outline">
                  Cambia
                </Button>
                <Button type="button" variant="destructive">
                  Rimuovi
                </Button>
              </div>
            ) : (
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" />
              </div>
            )}
          </div>

          <div>
            {!test?.video ? (
              <div className="flex flex-col gap-2">
                <Label>Video</Label>
                <video src={videoUrl} controls className="w-64 rounded" />
                <div className="flex gap-3">
                  <Button type="button" variant="outline">
                    Cambia
                  </Button>
                  <Button type="button" variant="destructive">
                    Rimuovi
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="video">Video</Label>
                <Input id="video" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className={'mb-3'}>Nome breve</Label>
            <Input {...form.register('nome_abbreviato')} />
          </div>
          <div>
            <Label className={'mb-3'}>Nome esteso</Label>
            <Input {...form.register('nome_esteso')} />
          </div>
          <div className="md:col-span-2">
            <SelectField
              options={categorieData}
              selectedId={String(form.watch('id_categoria_funzionale'))}
              onSelectChange={(newId: string) => {
                form.setValue('id_categoria_funzionale', newId, { shouldValidate: true });
              }}
              label="Categoria Funzionale:"
              placeholder="Seleziona una Categoria funzionale..." />
          </div>
          <div className="md:col-span-2">
            <Label className={'mb-3'}>Descrizione</Label>
            <Textarea {...form.register('descrizione')} rows={3} />
          </div>
          <div>
            <Label className={'mb-3'}>Lateralità</Label>
            <Select
              value={form.watch('lateralita')}
              onValueChange={(value: string) => {
                form.setValue('lateralita', value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Scegli il tipo di studio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="una_misura">una_misura</SelectItem>
                <SelectItem value="due_misure">due_misure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={'mb-3'}>Tempo di recupero (sec)</Label>
            <Input {...form.register('tempo_di_recupero')} />
          </div>
          <div className="md:col-span-2">
            <Label className={'mb-3'}>Istruzioni verbali</Label>
            <Textarea {...form.register('istruzioni_verbali')} rows={3} />
          </div>
        </div>

        {isEditMode &&
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Creato il:</strong>{' '}
              {new Date(test.created_at).toLocaleDateString('it-IT')}
            </p>
            <p>
              <strong>Aggiornato il:</strong>{' '}
              {new Date(test.updated_at).toLocaleDateString('it-IT')}
            </p>
          </div>
        }

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annulla
          </Button>
          <Button type="submit" disabled={!isFormValid()}>Salva</Button>
        </div>
      </form>

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
    </TableConatiner>
  );
};

export default TestDetail;
