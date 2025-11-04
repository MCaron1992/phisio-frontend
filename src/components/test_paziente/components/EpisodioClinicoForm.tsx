import React, { memo } from 'react';
import { Calendar, ClipboardList, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DateInput } from '@/components/ui/date-input';
import { Textarea } from '@/components/ui/textarea';
import { EpisodioClinicoFormData } from '../types/episodio.types';
import EpisodioStrutturaList from './EpisodioStrutturaList';

interface EpisodioClinicoFormProps {
  currentEpisodio: EpisodioClinicoFormData;
  selectedId: string | null;
  episodiClinicoCount: number;
  regioniData: any;
  strutturePrincipaliData: any;
  struttureSpecificheData: any;
  isValid: boolean;
  onDataChange: (data: string) => void;
  onNotaChange: (nota: string) => void;
  onNewEpisodioStruttura: () => void;
  onSelectEpisodioStruttura: (id: string) => void;
  onDeleteEpisodioStruttura: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EpisodioClinicoForm = memo(
  ({
    currentEpisodio,
    selectedId,
    episodiClinicoCount,
    regioniData,
    strutturePrincipaliData,
    struttureSpecificheData,
    isValid,
    onDataChange,
    onNotaChange,
    onNewEpisodioStruttura,
    onSelectEpisodioStruttura,
    onDeleteEpisodioStruttura,
    onSave,
    onCancel,
  }: EpisodioClinicoFormProps) => {
    return (
      <div
        id="form-episodio-clinico"
        className="bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-lg p-5 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 dark:bg-green-500 text-white font-bold text-sm shadow-md">
            {episodiClinicoCount > 0 ? '✏️' : '2'}
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {selectedId ? 'Modifica Episodio Clinico' : 'Nuovo Episodio Clinico'}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Data Episodio */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
              <Label className="text-sm font-medium text-foreground">
                Data Episodio *
              </Label>
            </div>
            <DateInput
              id="data-episodio"
              defaultValue={currentEpisodio.dataEpisodio}
              onChange={e => {
                if (!e) return;
                const target = e.currentTarget || (e.target as HTMLInputElement);
                if (target?.value !== undefined) {
                  onDataChange(target.value);
                }
              }}
              placeholder="Seleziona data..."
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Quando è avvenuto l'episodio clinico
            </p>
          </div>

          {/* Nota Episodio */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-4 h-4 text-green-600 dark:text-green-400" />
              <Label className="text-sm font-medium text-foreground">
                Nota
              </Label>
            </div>
            <Textarea
              id="nota-episodio"
              value={currentEpisodio.notaEpisodio}
              onChange={e => onNotaChange(e.target.value)}
              placeholder="Inserisci note aggiuntive sull'episodio clinico (facoltativo)..."
              className="min-h-24 resize-y"
              rows={3}
            />
          </div>

          {/* Lista Episodi Struttura */}
          {currentEpisodio.dataEpisodio && (
            <div className="border-t border-green-200 dark:border-green-800 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Episodi Struttura ({currentEpisodio.episodiStruttura.length})
                </h4>
              </div>

              <EpisodioStrutturaList
                episodi={currentEpisodio.episodiStruttura}
                regioniData={regioniData}
                strutturePrincipaliData={strutturePrincipaliData}
                struttureSpecificheData={struttureSpecificheData}
                onSelect={onSelectEpisodioStruttura}
                onDelete={onDeleteEpisodioStruttura}
              />

              <Button
                type="button"
                onClick={onNewEpisodioStruttura}
                className="w-full gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-sm"
                disabled={!currentEpisodio.dataEpisodio}
              >
                <Plus className="h-4 w-4" />
                {currentEpisodio.episodiStruttura.length > 0
                  ? 'Aggiungi Altro Episodio Struttura'
                  : 'Aggiungi Episodio Struttura'}
              </Button>
            </div>
          )}

          {/* Pulsanti Salva/Annulla Episodio Clinico */}
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
              className="gap-2 w-full sm:w-auto touch-manipulation bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isValid}
              onClick={onSave}
            >
              <Check className="h-4 w-4" />
              {selectedId
                ? 'Aggiorna Episodio Clinico'
                : 'Salva Episodio Clinico'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

EpisodioClinicoForm.displayName = 'EpisodioClinicoForm';

export default EpisodioClinicoForm;

