'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePaziente } from '@/hooks/useCrud';
import { useState } from 'react';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert from '@/components/custom/UniversalAlert';
import TableConatiner from '@/components/custom/TableContainer';
import { useForm, FormProvider } from 'react-hook-form';
import { StepIndicator } from '@/components/custom/step-indicator';
import Anagrafica from '@/components/test_paziente/Anagrafica';
import EpisidioClinico from '@/components/test_paziente/EpisidioClinico';
import Sport from '@/components/test_paziente/Sport';
import Test from '@/components/test_paziente/Test';

const STEPS = [
  { id: 1, label: 'Dati Anagrafici', description: 'Informazioni base' },
  { id: 2, label: 'Sport', description: 'Sport' },
  { id: 3, label: 'Episodio Clinico', description: 'Stato di salute' },
  { id: 4, label: 'Test', description: 'Test' },
];

const PlayerDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const isEditMode = id && id !== 'new';
  const playerQuery = isEditMode
    ? usePaziente(id as string)
    : { data: null, isLoading: false, isError: false, error: null };
  const { data: player, isLoading, isError, error } = playerQuery;

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
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
      sport_id: '',
      ruolo_sport_id: '',
      team_id: '',
      livello_sportivo_id: '',
      tests: [],
    },
    values: {
      ...player,
    },
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

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Anagrafica />;
      case 1:
        return <Sport />;
      case 2:
        return <EpisidioClinico />;
      case 3:
        return <Test />;
      default:
        return null;
    }
  };

  return (
    <TableConatiner>
      <main className="bg-white p-6 rounded shadow space-y-6">
        <StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <FormProvider {...form}>
          <section className="min-h-[400px] mb-6">
            {renderStepContent()}
          </section>
        </FormProvider>

        <UniversalAlert
          title={alert.title}
          description={alert.description}
          isVisible={alert.show}
          onClose={() => {
            if (alert.shouldNavigate) {
              router.push('/giocatori/elenco');
            } else {
              setAlert(prev => ({ ...prev, show: false }));
            }
          }}
          type={alert.type}
          duration={3000}
          position="top-right"
        />
      </main>
    </TableConatiner>
  );
};

export default PlayerDetail;
