'use client';

import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useRegioniAnatomiche,
  useStrutturePrincipali,
  useStruttureSpecifiche,
  useMeccanismiProblema,
  useApprocci,
  useStatiSalute,
  RegioniAnatomicha,
  StrutturePrincipali,
  StruttureSpecifiche,
} from '@/hooks/useCrud';
import SelectFieldWithDescription from '@/components/custom/SelectFieldWithDescription';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  FileText,
  Check,
  Plus,
  ChevronLeft,
  ChevronRight,
  Circle,
  Trash2,
} from 'lucide-react';

interface Lato {
  id: 'dx' | 'sx';
  nome: string;
  icona: string;
}

const LATI: Lato[] = [
  { id: 'dx', nome: 'Destro', icona: '→' },
  { id: 'sx', nome: 'Sinistro', icona: '←' },
];

// Lista di regioni anatomiche che richiedono il lato (può essere personalizzato)
const REGIONI_RICHIEDONO_LATO = [1]; // Esempio: Spalla (id: 1) richiede lato

interface EpisodioStruttura {
  id: string;
  regioneId: number | null;
  latoCoinvolto: 'dx' | 'sx' | null;
  strutturaPrincipaleId: number | null;
  strutturaSpecificaId: number | null;
  meccanismoId: number | null;
  approccioId: number | null;
}

interface EpisodioStrutturaFormData {
  regioneId: number | null;
  latoCoinvolto: 'dx' | 'sx' | null;
  strutturaPrincipaleId: number | null;
  strutturaSpecificaId: number | null;
  meccanismoId: number | null;
  approccioId: number | null;
}

// Genera ID univoco per episodio struttura
const generateEpisodioStrutturaId = () => {
  return `ep-str-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Crea episodio struttura vuoto
const createEmptyEpisodioStruttura = (): EpisodioStrutturaFormData => ({
  regioneId: null,
  latoCoinvolto: null,
  strutturaPrincipaleId: null,
  strutturaSpecificaId: null,
  meccanismoId: null,
  approccioId: null,
});

const EpisidioClinico = () => {
  const form = useFormContext();

  // Fetch dati
  const { data: statiSaluteData } = useStatiSalute();
  const { data: regioniData } = useRegioniAnatomiche();
  const { data: strutturePrincipaliData } = useStrutturePrincipali();
  const { data: struttureSpecificheData } = useStruttureSpecifiche();
  const { data: meccanismiData } = useMeccanismiProblema();
  const { data: approcciData } = useApprocci();

  // State per stato di salute
  const [statoSaluteId, setStatoSaluteId] = useState<number | null>(null);

  // State per gestire gli episodi struttura
  const formEpisodiStruttura = form.watch('episodi_struttura') || [];
  const [episodiStruttura, setEpisodiStruttura] = useState<EpisodioStruttura[]>(
    formEpisodiStruttura.length > 0 ? formEpisodiStruttura : []
  );
  const [currentEpisodioStruttura, setCurrentEpisodioStruttura] =
    useState<EpisodioStrutturaFormData>(createEmptyEpisodioStruttura());
  const [selectedEpisodioStrutturaId, setSelectedEpisodioStrutturaId] =
    useState<string | null>(null);

  // Inizializza episodi struttura dal form se esistono (per edit mode)
  useEffect(() => {
    if (formEpisodiStruttura.length > 0 && episodiStruttura.length === 0) {
      setEpisodiStruttura(formEpisodiStruttura);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verifica se lo stato di salute è "full" (non mostra il form completo)
  const statoSaluteSelezionato = statiSaluteData?.data?.find(
    (s: any) => s.id === statoSaluteId
  );
  const isFullHealth = statoSaluteSelezionato
    ? statoSaluteSelezionato.nome.toLowerCase().includes('full') ||
      statoSaluteSelezionato.nome.toLowerCase().includes('completo')
    : false;

  const regioneSelezionata = regioniData?.data?.find(
    (r: RegioniAnatomicha) => r.id === currentEpisodioStruttura.regioneId
  );
  const richiedeLato = regioneSelezionata
    ? REGIONI_RICHIEDONO_LATO.includes(currentEpisodioStruttura.regioneId || 0)
    : false;

  // Reset lato se la regione non lo richiede
  useEffect(() => {
    if (!richiedeLato) {
      setCurrentEpisodioStruttura(prev => ({ ...prev, latoCoinvolto: null }));
    }
  }, [richiedeLato]);

  // Filtra strutture specifiche in base a regione e struttura principale
  const struttureSpecificheDisponibili = useMemo(() => {
    if (!currentEpisodioStruttura.regioneId || !currentEpisodioStruttura.strutturaPrincipaleId)
      return [];
    return (
      struttureSpecificheData?.data?.filter(
        (s: StruttureSpecifiche) =>
          s.id_regione_anatomica === currentEpisodioStruttura.regioneId &&
          s.id_struttura_principale ===
            currentEpisodioStruttura.strutturaPrincipaleId
      ) || []
    );
  }, [
    currentEpisodioStruttura.regioneId,
    currentEpisodioStruttura.strutturaPrincipaleId,
    struttureSpecificheData?.data,
  ]);

  // Funzione per selezionare un episodio struttura dal riepilogo
  const handleSelectEpisodioStruttura = useCallback(
    (episodioId: string) => {
      setSelectedEpisodioStrutturaId(episodioId);
      const episodio = episodiStruttura.find(e => e.id === episodioId);
      if (episodio) {
        setCurrentEpisodioStruttura({
          regioneId: episodio.regioneId,
          latoCoinvolto: episodio.latoCoinvolto,
          strutturaPrincipaleId: episodio.strutturaPrincipaleId,
          strutturaSpecificaId: episodio.strutturaSpecificaId,
          meccanismoId: episodio.meccanismoId,
          approccioId: episodio.approccioId,
        });
        // Scroll all'episodio selezionato nella lista
        setTimeout(() => {
          const element = document.getElementById(`ep-str-${episodioId}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    },
    [episodiStruttura]
  );

  // Navigazione tra episodi struttura
  const currentIndex = selectedEpisodioStrutturaId
    ? episodiStruttura.findIndex(e => e.id === selectedEpisodioStrutturaId)
    : -1;

  const handlePreviousEpisodio = useCallback(() => {
    if (currentIndex > 0) {
      const prevId = episodiStruttura[currentIndex - 1].id;
      handleSelectEpisodioStruttura(prevId);
    }
  }, [currentIndex, episodiStruttura, handleSelectEpisodioStruttura]);

  const handleNextEpisodio = useCallback(() => {
    if (currentIndex < episodiStruttura.length - 1) {
      const nextId = episodiStruttura[currentIndex + 1].id;
      handleSelectEpisodioStruttura(nextId);
    }
  }, [currentIndex, episodiStruttura, handleSelectEpisodioStruttura]);

  // Reset form per nuovo episodio struttura
  const handleNewEpisodioStruttura = useCallback(() => {
    setCurrentEpisodioStruttura(createEmptyEpisodioStruttura());
    setSelectedEpisodioStrutturaId(null);
  }, []);

  // Salva episodio struttura
  const handleSaveEpisodioStruttura = useCallback(() => {
    if (!currentEpisodioStruttura.regioneId) return;

    const episodioToSave: EpisodioStruttura = {
      id: selectedEpisodioStrutturaId || generateEpisodioStrutturaId(),
      regioneId: currentEpisodioStruttura.regioneId,
      latoCoinvolto: currentEpisodioStruttura.latoCoinvolto,
      strutturaPrincipaleId: currentEpisodioStruttura.strutturaPrincipaleId,
      strutturaSpecificaId: currentEpisodioStruttura.strutturaSpecificaId,
      meccanismoId: currentEpisodioStruttura.meccanismoId,
      approccioId: currentEpisodioStruttura.approccioId,
    };

    if (selectedEpisodioStrutturaId) {
      // Modifica esistente
      setEpisodiStruttura(prev =>
        prev.map(e => (e.id === selectedEpisodioStrutturaId ? episodioToSave : e))
      );
    } else {
      // Aggiungi nuovo
      setEpisodiStruttura(prev => [...prev, episodioToSave]);
    }

    // Reset form
    handleNewEpisodioStruttura();
  }, [
    currentEpisodioStruttura,
    selectedEpisodioStrutturaId,
    handleNewEpisodioStruttura,
  ]);

  // Elimina episodio struttura
  const handleDeleteEpisodioStruttura = useCallback(
    (episodioId: string) => {
      setEpisodiStruttura(prev => prev.filter(e => e.id !== episodioId));
      if (selectedEpisodioStrutturaId === episodioId) {
        handleNewEpisodioStruttura();
      }
    },
    [selectedEpisodioStrutturaId, handleNewEpisodioStruttura]
  );

  // Valida episodio struttura
  const isEpisodioStrutturaValid = (): boolean => {
    const baseValid =
      currentEpisodioStruttura.regioneId &&
      currentEpisodioStruttura.strutturaPrincipaleId &&
      currentEpisodioStruttura.strutturaSpecificaId &&
      currentEpisodioStruttura.meccanismoId &&
      currentEpisodioStruttura.approccioId;

    if (richiedeLato) {
      return Boolean(baseValid && currentEpisodioStruttura.latoCoinvolto !== null);
    }

    return Boolean(baseValid);
  };

  // Valida form completo
  const isFormValid = (): boolean => {
    if (!statoSaluteId) return false;
    if (isFullHealth) return true;
    return episodiStruttura.length > 0;
  };

  const getEntityNameById = (id: number | null, data?: any[]) => {
    if (!id || !data) return '—';
    const item = data.find((d: any) => d.id === id);
    return item?.nome || '—';
  };

  // Reset completo
  const handleReset = () => {
    setStatoSaluteId(null);
    setEpisodiStruttura([]);
    handleNewEpisodioStruttura();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Form a Sinistra */}
      <div className="lg:col-span-2 space-y-4 lg:space-y-6">
        {/* Header */}
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
          {/* Stato di Salute */}
          <SelectFieldWithDescription
            id="stato-salute"
            options={statiSaluteData?.data?.map((s: any) => ({
              id: s.id,
              nome: s.nome,
              descrizione: s.descrizione,
            }))}
            selectedId={statoSaluteId ? String(statoSaluteId) : ''}
            onSelectChange={(value: string) => {
              setStatoSaluteId(value ? Number(value) : null);
              // Reset episodi struttura quando cambia stato di salute
              if (isFullHealth) {
                setEpisodiStruttura([]);
              }
            }}
            label="Stato di Salute *"
            placeholder="Seleziona stato di salute..."
            searchPlaceholder="Cerca stato..."
          />

          {/* Mostra il resto del form solo se non è "full" */}
          {!isFullHealth && (
            <>
              {/* Header con Navigazione per Episodio Struttura */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-4 border-t">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    {selectedEpisodioStrutturaId
                      ? 'Modifica Episodio Struttura'
                      : 'Nuovo Episodio Struttura'}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {selectedEpisodioStrutturaId
                      ? 'Modifica i dati dell\'episodio struttura selezionato'
                      : 'Compila tutti i campi per registrare un nuovo episodio struttura'}
                  </p>
                </div>

                {/* Navigazione tra episodi struttura */}
                {episodiStruttura.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    {/* Indicatore posizione */}
                    {selectedEpisodioStrutturaId && currentIndex !== -1 && (
                      <div className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md text-sm">
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          Episodio {currentIndex + 1} di {episodiStruttura.length}
                        </span>
                      </div>
                    )}

                    {/* Pulsanti navigazione */}
                    {selectedEpisodioStrutturaId && (
                      <div className="flex items-center gap-1 border border-primary/20 bg-primary/5 rounded-md">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handlePreviousEpisodio}
                          disabled={currentIndex === 0}
                          className="h-10 sm:h-8 w-12 sm:w-8 p-0 touch-manipulation hover:bg-primary/10 disabled:opacity-40"
                          title="Episodio precedente"
                        >
                          <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4 text-primary" />
                        </Button>
                        <div className="h-8 sm:h-6 w-px bg-border" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleNextEpisodio}
                          disabled={currentIndex === episodiStruttura.length - 1}
                          className="h-10 sm:h-8 w-12 sm:w-8 p-0 touch-manipulation hover:bg-primary/10 disabled:opacity-40"
                          title="Episodio successivo"
                        >
                          <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4 text-primary" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Indicatori episodi struttura (mini dots) */}
              {episodiStruttura.length > 1 && (
                <div className="flex items-center justify-center gap-2 sm:gap-2 py-2 overflow-x-auto pb-3">
                  {episodiStruttura.map((episodio, index) => (
                    <button
                      key={episodio.id}
                      type="button"
                      onClick={() => handleSelectEpisodioStruttura(episodio.id)}
                      className={cn(
                        'transition-all touch-manipulation p-1.5 sm:p-1',
                        selectedEpisodioStrutturaId === episodio.id
                          ? 'text-blue-600 dark:text-blue-400 scale-125'
                          : 'text-muted-foreground hover:text-blue-500 dark:hover:text-blue-400 active:scale-110'
                      )}
                      title={`Vai all'episodio ${index + 1}`}
                    >
                      <Circle
                        className={cn(
                          'h-3 w-3 sm:h-2 sm:w-2',
                          selectedEpisodioStrutturaId === episodio.id
                            ? 'fill-current'
                            : ''
                        )}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Form Episodio Struttura */}
              <div className="space-y-6 pt-4 border-t">
                {/* Regione Anatomica */}
                <SelectFieldWithDescription
                  id="regione-anatomica"
                  options={regioniData?.data?.map((r: RegioniAnatomicha) => ({
                    id: r.id,
                    nome: r.nome,
                    descrizione: r.descrizione,
                  }))}
                  selectedId={
                    currentEpisodioStruttura.regioneId
                      ? String(currentEpisodioStruttura.regioneId)
                      : ''
                  }
                  onSelectChange={(value: string) => {
                    setCurrentEpisodioStruttura(prev => ({
                      ...prev,
                      regioneId: value ? Number(value) : null,
                      latoCoinvolto: null,
                      strutturaPrincipaleId: null,
                      strutturaSpecificaId: null,
                    }));
                  }}
                  label="Dove si localizza l'origine del problema? *"
                  placeholder="Seleziona regione anatomica..."
                  searchPlaceholder="Cerca regione..."
                />

                {/* Lato Coinvolto */}
                {richiedeLato && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <Label className="text-sm font-medium leading-none text-foreground pb-1 mb-3 block">
                      Lato coinvolto *
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {LATI.map(lato => (
                        <button
                          key={lato.id}
                          type="button"
                          onClick={() =>
                            setCurrentEpisodioStruttura(prev => ({
                              ...prev,
                              latoCoinvolto: lato.id,
                            }))
                          }
                          className={cn(
                            'px-4 py-3 border-2 rounded-lg font-medium transition-all',
                            currentEpisodioStruttura.latoCoinvolto === lato.id
                              ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                              : 'border-border bg-background hover:border-blue-400 dark:hover:border-blue-600 text-foreground hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
                          )}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl">{lato.icona}</span>
                            <span>{lato.nome}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                      <strong>Nota:</strong> Per questa regione anatomica è
                      necessario specificare il lato coinvolto
                    </p>
                  </div>
                )}

                {currentEpisodioStruttura.regioneId && !richiedeLato && (
                  <div className="bg-muted/50 border border-border rounded-lg p-3">
                    <div className="flex items-start">
                      <Circle className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Per questa regione anatomica (strutture assiali/centrali)
                        non è necessario specificare il lato
                      </p>
                    </div>
                  </div>
                )}

                {/* Struttura Principale */}
                <SelectFieldWithDescription
                  id="struttura-principale"
                  options={strutturePrincipaliData?.data?.map(
                    (s: StrutturePrincipali) => ({
                      id: s.id,
                      nome: s.nome,
                      descrizione: s.descrizione,
                    })
                  )}
                  selectedId={
                    currentEpisodioStruttura.strutturaPrincipaleId
                      ? String(currentEpisodioStruttura.strutturaPrincipaleId)
                      : ''
                  }
                  onSelectChange={(value: string) => {
                    setCurrentEpisodioStruttura(prev => ({
                      ...prev,
                      strutturaPrincipaleId: value ? Number(value) : null,
                      strutturaSpecificaId: null,
                    }));
                  }}
                  label="Qual è la struttura o il tessuto primariamente coinvolto? *"
                  placeholder="Seleziona struttura principale..."
                  searchPlaceholder="Cerca struttura..."
                  disabled={
                    !currentEpisodioStruttura.regioneId ||
                    (richiedeLato && !currentEpisodioStruttura.latoCoinvolto)
                  }
                />

                {/* Struttura Specifica */}
                <SelectFieldWithDescription
                  id="struttura-specifica"
                  options={
                    struttureSpecificheDisponibili.length > 0
                      ? struttureSpecificheDisponibili.map(
                          (s: StruttureSpecifiche) => ({
                            id: s.id,
                            nome: s.nome,
                            descrizione: s.descrizione,
                          })
                        )
                      : [
                          {
                            id: 999,
                            nome: 'Non determinabile',
                            descrizione:
                              'Nessuna struttura specifica identificabile',
                          },
                        ]
                  }
                  selectedId={
                    currentEpisodioStruttura.strutturaSpecificaId
                      ? String(currentEpisodioStruttura.strutturaSpecificaId)
                      : ''
                  }
                  onSelectChange={(value: string) => {
                    setCurrentEpisodioStruttura(prev => ({
                      ...prev,
                      strutturaSpecificaId:
                        value && value !== '999' ? Number(value) : null,
                    }));
                  }}
                  label="Qual è la struttura anatomica specifica coinvolta? *"
                  placeholder="Seleziona struttura specifica..."
                  searchPlaceholder="Cerca struttura..."
                  disabled={!currentEpisodioStruttura.strutturaPrincipaleId}
                  emptyText={
                    struttureSpecificheDisponibili.length > 0
                      ? 'Nessuna struttura disponibile'
                      : 'Seleziona prima regione e struttura principale'
                  }
                />

                {/* Meccanismo Problema */}
                <SelectFieldWithDescription
                  id="meccanismo-problema"
                  options={meccanismiData?.data?.map((m: any) => ({
                    id: m.id,
                    nome: m.nome,
                    descrizione: m.descrizione,
                  }))}
                  selectedId={
                    currentEpisodioStruttura.meccanismoId
                      ? String(currentEpisodioStruttura.meccanismoId)
                      : ''
                  }
                  onSelectChange={(value: string) => {
                    setCurrentEpisodioStruttura(prev => ({
                      ...prev,
                      meccanismoId: value ? Number(value) : null,
                    }));
                  }}
                  label="Qual è la natura o meccanismo di origine del problema? *"
                  placeholder="Seleziona meccanismo..."
                  searchPlaceholder="Cerca meccanismo..."
                />

                {/* Approccio Terapeutico */}
                <SelectFieldWithDescription
                  id="approccio-terapeutico"
                  options={approcciData?.data?.map((a: any) => ({
                    id: a.id,
                    nome: a.nome,
                    descrizione: a.descrizione,
                  }))}
                  selectedId={
                    currentEpisodioStruttura.approccioId
                      ? String(currentEpisodioStruttura.approccioId)
                      : ''
                  }
                  onSelectChange={(value: string) => {
                    setCurrentEpisodioStruttura(prev => ({
                      ...prev,
                      approccioId: value ? Number(value) : null,
                    }));
                  }}
                  label="Qual è l'approccio terapeutico adottato? *"
                  placeholder="Seleziona approccio terapeutico..."
                  searchPlaceholder="Cerca approccio..."
                />

                {/* Pulsanti Azione Episodio Struttura */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleNewEpisodioStruttura}
                    className="w-full sm:w-auto touch-manipulation hover:bg-muted/50"
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    className="gap-2 w-full sm:w-auto touch-manipulation bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isEpisodioStrutturaValid()}
                    onClick={handleSaveEpisodioStruttura}
                  >
                    <Check className="h-4 w-4" />
                    {selectedEpisodioStrutturaId
                      ? 'Aggiorna Episodio'
                      : 'Salva Episodio Struttura'}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Pulsanti Azione Finale */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto touch-manipulation hover:bg-muted/50"
            >
              Reset
            </Button>
            <Button
              type="button"
              className="gap-2 w-full sm:w-auto touch-manipulation bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid()}
            >
              <Check className="h-4 w-4" />
              Salva Episodio Clinico
            </Button>
          </div>
        </div>
      </div>

      {/* Riepilogo a Destra */}
      <div className="lg:col-span-1 order-first lg:order-last">
        <div className="lg:sticky lg:top-6 bg-gradient-to-br from-muted/40 to-muted/20 rounded-lg p-4 border border-border/60 shadow-sm max-h-[calc(100vh-8rem)] lg:max-h-none flex flex-col backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Riepilogo
          </h3>

          {/* Stato di Salute */}
          <div className="pb-4 border-b border-border mb-4">
            <div className="text-xs mb-2">
              <span className="text-muted-foreground block mb-1">Stato di Salute</span>
              <span className="text-foreground font-medium">
                {getEntityNameById(statoSaluteId, statiSaluteData?.data)}
              </span>
            </div>
          </div>

          {/* Lista Episodi Struttura - solo se non è "full" */}
          {!isFullHealth && (
            <>
              <div className="space-y-3 mb-4 overflow-y-auto flex-1 min-h-0 lg:overflow-visible lg:flex-none">
                {episodiStruttura.map((episodio, index) => {
                  const regioneInfo = regioniData?.data?.find(
                    (r: RegioniAnatomicha) => r.id === episodio.regioneId
                  );
                  const strutturaPrincipaleInfo = strutturePrincipaliData?.data?.find(
                    (s: StrutturePrincipali) => s.id === episodio.strutturaPrincipaleId
                  );

                  return (
                    <div
                      key={episodio.id}
                      id={`ep-str-${episodio.id}`}
                      className={cn(
                        'p-3 sm:p-3 rounded-lg border cursor-pointer transition-all hover:shadow-lg active:scale-[0.98] relative touch-manipulation',
                        selectedEpisodioStrutturaId === episodio.id
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50/80 dark:bg-blue-950/30 ring-2 ring-blue-500/30 dark:ring-blue-400/30 shadow-md'
                          : 'border-border bg-background hover:border-blue-300 dark:hover:border-blue-600 active:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
                      )}
                      onClick={() => handleSelectEpisodioStruttura(episodio.id)}
                    >
                      {/* Indicatore numero episodio */}
                      <div
                        className={cn(
                          'absolute top-2 right-2 flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 rounded-full text-xs font-medium transition-all',
                          selectedEpisodioStrutturaId === episodio.id
                            ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                            : 'bg-muted text-muted-foreground group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50'
                        )}
                      >
                        {index + 1}
                      </div>

                      {/* Pulsante elimina */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteEpisodioStruttura(episodio.id);
                        }}
                        className={cn(
                          'absolute top-2 left-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30',
                          selectedEpisodioStrutturaId === episodio.id && 'opacity-100'
                        )}
                        title="Elimina episodio"
                      >
                        <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                      </button>

                      <div className="font-medium text-sm pr-8">
                        {regioneInfo?.nome || 'Regione non specificata'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {strutturaPrincipaleInfo?.nome || 'Struttura'}
                      </div>
                      {episodio.latoCoinvolto && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Lato: {LATI.find(l => l.id === episodio.latoCoinvolto)?.nome}
                        </div>
                      )}
                    </div>
                  );
                })}

                {episodiStruttura.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Nessun episodio struttura salvato
                  </div>
                )}
              </div>

              {/* Pulsante Nuovo Episodio Struttura */}
              <Button
                type="button"
                variant="outline"
                onClick={handleNewEpisodioStruttura}
                className="w-full gap-2 touch-manipulation mt-auto lg:mt-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
              >
                <Plus className="h-4 w-4" />
                Nuovo Episodio Struttura
              </Button>
            </>
          )}

          {/* Riepilogo Dati Form Attuale Episodio Struttura - solo se non è "full" e c'è selezione */}
          {!isFullHealth && selectedEpisodioStrutturaId && (
            <div className="hidden lg:block mt-6 pt-6 border-t space-y-3 text-xs">
              <div className="pb-2 border-b border-border">
                <span className="text-muted-foreground block mb-1">Regione</span>
                <span className="text-foreground font-medium">
                  {getEntityNameById(
                    currentEpisodioStruttura.regioneId,
                    regioniData?.data
                  )}
                </span>
              </div>
              {richiedeLato && (
                <div className="pb-2 border-b border-border">
                  <span className="text-muted-foreground block mb-1">Lato</span>
                  <span className="text-foreground font-medium">
                    {currentEpisodioStruttura.latoCoinvolto
                      ? LATI.find(l => l.id === currentEpisodioStruttura.latoCoinvolto)
                          ?.nome
                      : '—'}
                  </span>
                </div>
              )}
              <div className="pb-2 border-b border-border">
                <span className="text-muted-foreground block mb-1">
                  Struttura Principale
                </span>
                <span className="text-foreground font-medium">
                  {getEntityNameById(
                    currentEpisodioStruttura.strutturaPrincipaleId,
                    strutturePrincipaliData?.data
                  )}
                </span>
              </div>
              <div className="pb-2 border-b border-border">
                <span className="text-muted-foreground block mb-1">
                  Struttura Specifica
                </span>
                <span className="text-foreground font-medium">
                  {getEntityNameById(
                    currentEpisodioStruttura.strutturaSpecificaId,
                    struttureSpecificheData?.data
                  )}
                </span>
              </div>
              <div className="pb-2 border-b border-border">
                <span className="text-muted-foreground block mb-1">Meccanismo</span>
                <span className="text-foreground font-medium">
                  {getEntityNameById(
                    currentEpisodioStruttura.meccanismoId,
                    meccanismiData?.data
                  )}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Approccio</span>
                <span className="text-foreground font-medium">
                  {getEntityNameById(
                    currentEpisodioStruttura.approccioId,
                    approcciData?.data
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisidioClinico;
