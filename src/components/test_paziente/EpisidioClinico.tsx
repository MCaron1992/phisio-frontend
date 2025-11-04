'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectFieldWithDescription from '@/components/custom/SelectFieldWithDescription';
import {
  useStatiSalute,
  useRegioniAnatomiche,
  useStrutturePrincipali,
  useStruttureSpecifiche,
  useMeccanismiProblema,
  useApprocci,
  StatiSalute,
} from '@/hooks/useCrud';
import { useEpisodioClinico } from './hooks/useEpisodioClinico';
import { useEpisodioStruttura } from './hooks/useEpisodioStruttura';
import { EpisodioStruttura } from './types/episodio.types';
import { generateEpisodioStrutturaId } from './utils/episodio.utils';
import EpisodioClinicoList from './components/EpisodioClinicoList';
import EpisodioClinicoForm from './components/EpisodioClinicoForm';
import EpisodioStrutturaForm from './components/EpisodioStrutturaForm';
import RiepilogoSidebar from './components/RiepilogoSidebar';

const EpisidioClinico = () => {
  const { data: statiSaluteData } = useStatiSalute();
  const { data: regioniData } = useRegioniAnatomiche();
  const { data: strutturePrincipaliData } = useStrutturePrincipali();
  const { data: struttureSpecificheData } = useStruttureSpecifiche();
  const { data: meccanismiData } = useMeccanismiProblema();
  const { data: approcciData } = useApprocci();

  const [statoSaluteId, setStatoSaluteId] = useState<number | null>(null);

  const statoSaluteSelezionato = statiSaluteData?.find(
    (s: StatiSalute) => s.id === statoSaluteId
  );
  const isFullHealth = statoSaluteSelezionato
    ? statoSaluteSelezionato.nome.toLowerCase().includes('full')
    : false;

  const episodioClinicoState = useEpisodioClinico();
  const episodioStrutturaState = useEpisodioStruttura({
    regioniData,
    struttureSpecificheData,
  });

  useEffect(() => {
    if (isFullHealth) {
      episodioClinicoState.handleReset();
      episodioStrutturaState.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullHealth]);

  const handleDataEpisodioChange = useCallback(
    (data: string) => {
      episodioClinicoState.setCurrentEpisodioClinico(prev => ({
        ...prev,
        dataEpisodio: data,
      }));
    },
    [episodioClinicoState.setCurrentEpisodioClinico]
  );

  const handleNotaEpisodioChange = useCallback(
    (nota: string) => {
      episodioClinicoState.setCurrentEpisodioClinico(prev => ({
        ...prev,
        notaEpisodio: nota,
      }));
    },
    [episodioClinicoState.setCurrentEpisodioClinico]
  );

  const handleNewEpisodioStruttura = useCallback(() => {
    episodioStrutturaState.handleNew();
  }, [episodioStrutturaState.handleNew]);

  const handleSelectEpisodioStruttura = useCallback(
    (episodioId: string) => {
      const episodio =
        episodioClinicoState.currentEpisodioClinico.episodiStruttura.find(
          e => e.id === episodioId
        );
      if (episodio) {
        episodioStrutturaState.setSelectedId(episodioId);
        episodioStrutturaState.setCurrentEpisodio({
          regioneId: episodio.regioneId,
          latoCoinvolto: episodio.latoCoinvolto,
          strutturaPrincipaleId: episodio.strutturaPrincipaleId,
          strutturaSpecificaId: episodio.strutturaSpecificaId,
          meccanismoId: episodio.meccanismoId,
          approccioId: episodio.approccioId,
        });
        episodioStrutturaState.setIsFormVisible(true);
        setTimeout(() => {
          const element = document.getElementById('form-episodio-struttura');
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    },
    [
      episodioClinicoState.currentEpisodioClinico.episodiStruttura,
      episodioStrutturaState.setSelectedId,
      episodioStrutturaState.setCurrentEpisodio,
      episodioStrutturaState.setIsFormVisible,
    ]
  );

  const handleSaveEpisodioStruttura = useCallback(() => {
    if (!episodioStrutturaState.currentEpisodio.regioneId) return;

    const episodioToSave: EpisodioStruttura = {
      id: episodioStrutturaState.selectedId || generateEpisodioStrutturaId(),
      regioneId: episodioStrutturaState.currentEpisodio.regioneId,
      latoCoinvolto: episodioStrutturaState.currentEpisodio.latoCoinvolto,
      strutturaPrincipaleId:
        episodioStrutturaState.currentEpisodio.strutturaPrincipaleId,
      strutturaSpecificaId:
        episodioStrutturaState.currentEpisodio.strutturaSpecificaId,
      meccanismoId: episodioStrutturaState.currentEpisodio.meccanismoId,
      approccioId: episodioStrutturaState.currentEpisodio.approccioId,
    };

    if (episodioStrutturaState.selectedId) {
      episodioClinicoState.setCurrentEpisodioClinico(prev => ({
        ...prev,
        episodiStruttura: prev.episodiStruttura.map(e =>
          e.id === episodioStrutturaState.selectedId ? episodioToSave : e
        ),
      }));
    } else {
      episodioClinicoState.setCurrentEpisodioClinico(prev => ({
        ...prev,
        episodiStruttura: [...prev.episodiStruttura, episodioToSave],
      }));
    }

    episodioStrutturaState.handleCancel();
  }, [
    episodioStrutturaState.currentEpisodio,
    episodioStrutturaState.selectedId,
    episodioStrutturaState.handleCancel,
    episodioClinicoState.setCurrentEpisodioClinico,
  ]);

  const handleDeleteEpisodioStruttura = useCallback(
    (episodioId: string) => {
      episodioClinicoState.setCurrentEpisodioClinico(prev => ({
        ...prev,
        episodiStruttura: prev.episodiStruttura.filter(
          e => e.id !== episodioId
        ),
      }));
      if (episodioStrutturaState.selectedId === episodioId) {
        episodioStrutturaState.handleCancel();
      }
    },
    [
      episodioClinicoState.setCurrentEpisodioClinico,
      episodioStrutturaState.selectedId,
      episodioStrutturaState.handleCancel,
    ]
  );

  const handleEpisodioStrutturaFieldChange = useCallback(
    (field: string, value: string | number | null) => {
      episodioStrutturaState.setCurrentEpisodio(prev => {
        const newState = { ...prev, [field]: value };

        if (field === 'regioneId') {
          newState.latoCoinvolto = null;
          newState.strutturaPrincipaleId = null;
          newState.strutturaSpecificaId = null;
        } else if (field === 'strutturaPrincipaleId') {
          newState.strutturaSpecificaId = null;
        }

        return newState;
      });
    },
    [episodioStrutturaState.setCurrentEpisodio]
  );

  const isFormValid = useCallback((): boolean => {
    if (!statoSaluteId) return false;
    if (isFullHealth) return true;
    return episodioClinicoState.episodiClinici.length > 0;
  }, [statoSaluteId, isFullHealth, episodioClinicoState.episodiClinici.length]);

  const handleReset = useCallback(() => {
    setStatoSaluteId(null);
    episodioClinicoState.handleReset();
    episodioStrutturaState.reset();
  }, [episodioClinicoState.handleReset, episodioStrutturaState.reset]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      <div className="lg:col-span-2 space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Registrazione Episodio Clinico
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Compila tutti i campi per registrare un nuovo episodio
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-bold text-sm shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Stato di Salute
              </h3>
            </div>
            <SelectFieldWithDescription
              id="stato-salute"
              options={statiSaluteData}
              selectedId={statoSaluteId ? String(statoSaluteId) : ''}
              onSelectChange={(value: string) => {
                setStatoSaluteId(value ? Number(value) : null);
              }}
              label="Stato di Salute *"
              placeholder="Seleziona stato di salute..."
              searchPlaceholder="Cerca stato..."
              isSearchable={false}
            />
          </div>

          {!isFullHealth && statoSaluteId && (
            <>
              <EpisodioClinicoList
                episodi={episodioClinicoState.episodiClinici}
                onSelect={episodioClinicoState.handleSelect}
                onDelete={episodioClinicoState.handleDelete}
              />

              {episodioClinicoState.isFormVisible && (
                <EpisodioClinicoForm
                  currentEpisodio={episodioClinicoState.currentEpisodioClinico}
                  selectedId={episodioClinicoState.selectedEpisodioClinicoId}
                  episodiClinicoCount={
                    episodioClinicoState.episodiClinici.length
                  }
                  regioniData={regioniData}
                  strutturePrincipaliData={strutturePrincipaliData}
                  struttureSpecificheData={struttureSpecificheData}
                  isValid={episodioClinicoState.isValid()}
                  onDataChange={handleDataEpisodioChange}
                  onNotaChange={handleNotaEpisodioChange}
                  onNewEpisodioStruttura={handleNewEpisodioStruttura}
                  onSelectEpisodioStruttura={handleSelectEpisodioStruttura}
                  onDeleteEpisodioStruttura={handleDeleteEpisodioStruttura}
                  onSave={episodioClinicoState.handleSave}
                  onCancel={episodioClinicoState.handleCancel}
                />
              )}
            </>
          )}

          {!isFullHealth &&
            statoSaluteId &&
            episodioClinicoState.isFormVisible &&
            episodioClinicoState.currentEpisodioClinico.dataEpisodio &&
            episodioStrutturaState.isFormVisible && (
              <EpisodioStrutturaForm
                currentEpisodio={episodioStrutturaState.currentEpisodio}
                selectedId={episodioStrutturaState.selectedId}
                richiedeLato={episodioStrutturaState.richiedeLato}
                struttureSpecificheDisponibili={
                  episodioStrutturaState.struttureSpecificheDisponibili
                }
                regioniData={regioniData}
                strutturePrincipaliData={strutturePrincipaliData}
                meccanismiData={meccanismiData}
                approcciData={approcciData}
                isValid={episodioStrutturaState.isValid()}
                onFieldChange={handleEpisodioStrutturaFieldChange}
                onSave={handleSaveEpisodioStruttura}
                onCancel={episodioStrutturaState.handleCancel}
              />
            )}

          <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto touch-manipulation hover:bg-muted/50"
            >
              Reset Completo
            </Button>
            <Button
              type="button"
              className="gap-2 w-full sm:w-auto touch-manipulation bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid()}
            >
              <Check className="h-4 w-4" />
              Salva Dati Paziente
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 order-first lg:order-last">
        <RiepilogoSidebar
          statoSaluteId={statoSaluteId}
          statiSaluteData={statiSaluteData}
          episodiClinicoCount={episodioClinicoState.episodiClinici.length}
          currentEpisodioClinico={
            episodioClinicoState.isFormVisible
              ? episodioClinicoState.currentEpisodioClinico
              : null
          }
          isFullHealth={isFullHealth}
          isFormVisible={episodioClinicoState.isFormVisible}
          onNewEpisodioClinico={episodioClinicoState.handleNew}
        />
      </div>
    </div>
  );
};

export default EpisidioClinico;
