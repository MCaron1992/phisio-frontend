'use client';

import { useParams, useRouter } from 'next/navigation';
import TableConatiner from '@/components/custom /TableContainer';
import { useTest, useUpdateTest } from '@/hooks/useCrud';
import { Loader } from '@/components/custom /Loader';
import UniversalAlert from '@/components/custom /UniversalAlert';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const TestDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: test, isLoading, isError, error } = useTest(id as string);
  const { mutate: updateTest } = useUpdateTest();

  const [alert, setAlert] = useState({
    show: false,
    type: 'success' as 'success' | 'error',
    title: '',
    description: '',
  });

  const form = useForm({
    defaultValues: {
      nome_abbreviato: '',
      nome_esteso: '',
      descrizione: '',
      lateralita: '',
      tempo_di_recupero: '',
      istruzioni_verbali: '',
    },
    values: test,
  });

  if (isLoading) return <Loader />;
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

  if (!test) return <p>Nessun test trovato</p>;

  const onSubmit = (values: any) => {
    updateTest(
      { id: test.id, ...values },
      {
        onSuccess: () =>
          setAlert({
            show: true,
            type: 'success',
            title: 'Aggiornato!',
            description: 'Il test è stato modificato correttamente.',
          }),
        onError: err =>
          setAlert({
            show: true,
            type: 'error',
            title: 'Errore',
            description: err?.message || 'Errore durante il salvataggio.',
          }),
      }
    );
  };
  const fakeImage = 'https://picsum.photos/400/300';
  const fakeVideo = 'https://www.w3schools.com/html/mov_bbb.mp4';

  const fotoUrl = test.foto || fakeImage;
  const videoUrl = test.video || fakeVideo;
  return (
    <TableConatiner
      btnLabel={'Torna indietro'}
      title={`Dettaglio / Modifica Test`}
      action={() => router.back()}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow space-y-6"
      >
        <div className=" flex justify-between">
          <div>
            {!test.foto ? (
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
                <Input id="picture" type="file" />
              </div>
            )}
          </div>

          <div>
            {!test.video ? (
              <div className="flex flex-col gap-2">
                <Label>Video</Label>
                <video src={fakeVideo} controls className="w-64 rounded" />
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
                <Input id="video" type="file" />
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
            <Label className={'mb-3'}>Descrizione</Label>
            <Textarea {...form.register('descrizione')} rows={3} />
          </div>
          <div>
            <Label className={'mb-3'}>Lateralità</Label>
            <Input {...form.register('lateralita')} />
          </div>
          <div>
            <Label className={'mb-3'}>Tempo di recupero (sec)</Label>
            <Input type="number" {...form.register('tempo_di_recupero')} />
          </div>
          <div className="md:col-span-2">
            <Label className={'mb-3'}>Istruzioni verbali</Label>
            <Textarea {...form.register('istruzioni_verbali')} rows={3} />
          </div>
        </div>

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

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annulla
          </Button>
          <Button type="submit">Salva</Button>
        </div>
      </form>

      <UniversalAlert
        title={alert.title}
        description={alert.description}
        isVisible={alert.show}
        onClose={() => setAlert(prev => ({ ...prev, show: false }))}
        type={alert.type}
        duration={3000}
        position="top-right"
      />
    </TableConatiner>
  );
};

export default TestDetail;
