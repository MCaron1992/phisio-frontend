import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import SelectFieldWithDescription from '@/components/custom/SelectFieldWithDescription';
import { EpisodioStrutturaFormData } from '../types/episodio.types';
import { LATI, NON_DETERMINABILE_ID } from '../constants/episodio.constants';

interface EpisodioStrutturaFormProps {
  currentEpisodio: EpisodioStrutturaFormData;
  selectedId: string | null;
  richiedeLato: boolean;
  struttureSpecificheDisponibili: any[];
  regioniData: any;
  strutturePrincipaliData: any;
  meccanismiData: any;
  approcciData: any;
  isValid: boolean;
  onFieldChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EpisodioStrutturaForm = memo(
  ({
    currentEpisodio,
    selectedId,
    richiedeLato,
    struttureSpecificheDisponibili,
    regioniData,
    strutturePrincipaliData,
    meccanismiData,
    approcciData,
    isValid,
    onFieldChange,
    onSave,
    onCancel,
  }: EpisodioStrutturaFormProps) => {
    return (
      <div
        id="form-episodio-struttura"
        className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-5 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-500 text-white font-bold text-sm shadow-md">
            3
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {selectedId
                ? 'Modifica Episodio Struttura'
                : 'Nuovo Episodio Struttura'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {selectedId
                ? "Modifica i dati dell'episodio struttura selezionato"
                : 'Compila tutti i campi per registrare un nuovo episodio struttura'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Regione Anatomica */}
          <SelectFieldWithDescription
            id="regione-anatomica"
            options={
              regioniData?.data && regioniData.data.length > 0
                ? [
                    ...regioniData.data.map((r: any) => ({
                      id: r.id,
                      nome: r.nome,
                      descrizione: r.descrizione,
                    })),
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Regione anatomica non identificabile',
                    },
                  ]
                : [
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Regione anatomica non identificabile',
                    },
                  ]
            }
            selectedId={
              currentEpisodio.regioneId ? String(currentEpisodio.regioneId) : ''
            }
            onSelectChange={(value: string) => {
              onFieldChange('regioneId', value ? Number(value) : null);
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
                    onClick={() => onFieldChange('latoCoinvolto', lato.id)}
                    className={cn(
                      'px-4 py-3 border-2 rounded-lg font-medium transition-all',
                      currentEpisodio.latoCoinvolto === lato.id
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
                <strong>Nota:</strong> Per questa regione anatomica è necessario
                specificare il lato coinvolto
              </p>
            </div>
          )}

          {currentEpisodio.regioneId && !richiedeLato && (
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                ℹ️ Per questa regione anatomica (strutture assiali/centrali) non
                è necessario specificare il lato
              </p>
            </div>
          )}

          {/* Struttura Principale */}
          <SelectFieldWithDescription
            id="struttura-principale"
            options={
              strutturePrincipaliData?.data &&
              strutturePrincipaliData.data.length > 0
                ? [
                    ...strutturePrincipaliData.data.map((s: any) => ({
                      id: s.id,
                      nome: s.nome,
                      descrizione: s.descrizione,
                    })),
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Struttura principale non identificabile',
                    },
                  ]
                : [
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Struttura principale non identificabile',
                    },
                  ]
            }
            selectedId={
              currentEpisodio.strutturaPrincipaleId
                ? String(currentEpisodio.strutturaPrincipaleId)
                : ''
            }
            onSelectChange={(value: string) => {
              onFieldChange('strutturaPrincipaleId', value ? Number(value) : null);
            }}
            label="Qual è la struttura o il tessuto primariamente coinvolto? *"
            placeholder="Seleziona struttura principale..."
            searchPlaceholder="Cerca struttura..."
            disabled={
              !currentEpisodio.regioneId ||
              (richiedeLato && !currentEpisodio.latoCoinvolto)
            }
          />

          {/* Struttura Specifica */}
          <SelectFieldWithDescription
            id="struttura-specifica"
            options={
              struttureSpecificheDisponibili.length > 0
                ? [
                    ...struttureSpecificheDisponibili.map((s: any) => ({
                      id: s.id,
                      nome: s.nome,
                      descrizione: s.descrizione,
                    })),
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Nessuna struttura specifica identificabile',
                    },
                  ]
                : [
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Nessuna struttura specifica identificabile',
                    },
                  ]
            }
            selectedId={
              currentEpisodio.strutturaSpecificaId
                ? String(currentEpisodio.strutturaSpecificaId)
                : ''
            }
            onSelectChange={(value: string) => {
              onFieldChange('strutturaSpecificaId', value ? Number(value) : null);
            }}
            label="Qual è la struttura anatomica specifica coinvolta? *"
            placeholder="Seleziona struttura specifica..."
            searchPlaceholder="Cerca struttura..."
            disabled={!currentEpisodio.strutturaPrincipaleId}
            emptyText={
              struttureSpecificheDisponibili.length > 0
                ? 'Nessuna struttura disponibile'
                : 'Seleziona prima regione e struttura principale'
            }
          />

          {/* Meccanismo Problema */}
          <SelectFieldWithDescription
            id="meccanismo-problema"
            options={
              meccanismiData?.data && meccanismiData.data.length > 0
                ? [
                    ...meccanismiData.data.map((m: any) => ({
                      id: m.id,
                      nome: m.nome,
                      descrizione: m.descrizione,
                    })),
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Meccanismo non identificabile',
                    },
                  ]
                : [
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Meccanismo non identificabile',
                    },
                  ]
            }
            selectedId={
              currentEpisodio.meccanismoId
                ? String(currentEpisodio.meccanismoId)
                : ''
            }
            onSelectChange={(value: string) => {
              onFieldChange('meccanismoId', value ? Number(value) : null);
            }}
            label="Qual è la natura o meccanismo di origine del problema? *"
            placeholder="Seleziona meccanismo..."
            searchPlaceholder="Cerca meccanismo..."
          />

          {/* Approccio Terapeutico */}
          <SelectFieldWithDescription
            id="approccio-terapeutico"
            options={
              approcciData?.data && approcciData.data.length > 0
                ? [
                    ...approcciData.data.map((a: any) => ({
                      id: a.id,
                      nome: a.nome,
                      descrizione: a.descrizione,
                    })),
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Approccio non identificabile',
                    },
                  ]
                : [
                    {
                      id: NON_DETERMINABILE_ID,
                      nome: 'Non determinabile',
                      descrizione: 'Approccio non identificabile',
                    },
                  ]
            }
            selectedId={
              currentEpisodio.approccioId
                ? String(currentEpisodio.approccioId)
                : ''
            }
            onSelectChange={(value: string) => {
              onFieldChange('approccioId', value ? Number(value) : null);
            }}
            label="Qual è l'approccio terapeutico adottato? *"
            placeholder="Seleziona approccio terapeutico..."
            searchPlaceholder="Cerca approccio..."
          />

          {/* Pulsanti Azione */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto touch-manipulation hover:bg-muted/50"
            >
              Annulla
            </Button>
            <Button
              type="button"
              className="gap-2 w-full sm:w-auto touch-manipulation bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isValid}
              onClick={onSave}
            >
              <Check className="h-4 w-4" />
              {selectedId ? 'Aggiorna Episodio' : 'Salva Episodio Struttura'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

EpisodioStrutturaForm.displayName = 'EpisodioStrutturaForm';

export default EpisodioStrutturaForm;

