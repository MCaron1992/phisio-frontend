'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  useCategorieFunzionali,
  useTests,
  useMetriche,
  useUnitaMisura,
  useStrumenti,
  useFasiTemporali,
  Test as TestType,
} from '@/hooks/useCrud';
import SelectFieldWithDescription from '@/components/custom/SelectFieldWithDescription';
import SelectFieldWithSearch from '@/components/custom/SelectFieldWithSearch';
import { Loader2 } from 'lucide-react';

interface ConfiguraTestSquadraDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    categoria_funzionale_id: number;
    test_id: number;
    metrica_id: number;
    unita_misura_id: number;
    strumento_id: number;
  }) => void;
  isSaving?: boolean;
}

const ConfiguraTestSquadraDialog = ({
  open,
  onClose,
  onSave,
  isSaving = false,
}: ConfiguraTestSquadraDialogProps) => {
  const { data: categorieData } = useCategorieFunzionali();
  const { data: testsData } = useTests();
  const { data: metricheData } = useMetriche();
  const { data: unitaData } = useUnitaMisura();
  const { data: strumentiData } = useStrumenti();
  const { data: fasiTemporaliData } = useFasiTemporali();

  const [categoriaFunzionaleId, setCategoriaFunzionaleId] =
    useState<string>('');
  const [testId, setTestId] = useState<string>('');
  const [metricaId, setMetricaId] = useState<string>('');
  const [unitaMisuraId, setUnitaMisuraId] = useState<string>('');
  const [strumentoId, setStrumentoId] = useState<string>('');
  const [faseTemporaleId, setFaseTemporaleId] = useState<string>('');

  useEffect(() => {
    if (open) {
      setCategoriaFunzionaleId('');
      setTestId('');
      setMetricaId('');
      setUnitaMisuraId('');
      setStrumentoId('');
      setFaseTemporaleId('');
    }
  }, [open]);

  const handleCategoriaChange = (value: string) => {
    setCategoriaFunzionaleId(value);
    setTestId('');
  };

  const filteredTests =
    testsData?.filter(
      (test: TestType) =>
        categoriaFunzionaleId &&
        String(test.id_categoria_funzionale) === categoriaFunzionaleId
    ) || [];

  const getTestName = (test: TestType) => {
    return test.nome_abbreviato || test.nome_esteso || 'Test senza nome';
  };

  const getTestDescription = (test: TestType) => {
    return test.istruzioni_verbali || test.nome_esteso || '';
  };

  const isFormValid = () => {
    return (
      categoriaFunzionaleId &&
      testId &&
      metricaId &&
      unitaMisuraId &&
      strumentoId
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    onSave({
      categoria_funzionale_id: Number(categoriaFunzionaleId),
      test_id: Number(testId),
      metrica_id: Number(metricaId),
      unita_misura_id: Number(unitaMisuraId),
      strumento_id: Number(strumentoId),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configura Test di Squadra</DialogTitle>
          <DialogDescription>
            Configura un test da eseguire per tutti i giocatori della squadra.
            Compila tutti i campi obbligatori.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <SelectFieldWithDescription
            id="categoria-funzionale"
            options={categorieData}
            selectedId={categoriaFunzionaleId}
            onSelectChange={handleCategoriaChange}
            label="Categoria Funzionale *"
            placeholder="Seleziona una categoria funzionale..."
            searchPlaceholder="Cerca categoria..."
          />
          {categoriaFunzionaleId ? (
            filteredTests.length > 0 ? (
              <SelectFieldWithDescription
                id="test"
                options={filteredTests.map((test: TestType) => ({
                  id: test.id,
                  nome: getTestName(test),
                  descrizione: getTestDescription(test),
                }))}
                selectedId={testId}
                onSelectChange={setTestId}
                label="Test *"
                placeholder="Seleziona un test..."
                searchPlaceholder="Cerca test..."
              />
            ) : (
              <div className="flex flex-col space-y-1 pb-2">
                <Label className="text-sm font-medium leading-none text-foreground pb-1">
                  Test *
                </Label>
                <div className="px-3 py-2 text-sm text-muted-foreground border rounded-md bg-muted/50">
                  Nessun test disponibile per questa categoria
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col space-y-1 pb-2">
              <Label className="text-sm font-medium leading-none text-foreground pb-1">
                Test *
              </Label>
              <div className="px-3 py-2 text-sm text-muted-foreground border rounded-md bg-muted/50">
                Seleziona prima una categoria funzionale
              </div>
            </div>
          )}
          {/* Metrica */}
          <SelectFieldWithDescription
            id="metrica"
            options={metricheData}
            selectedId={metricaId}
            onSelectChange={setMetricaId}
            label="Metrica *"
            placeholder="Seleziona una metrica..."
            searchPlaceholder="Cerca metrica..."
          />
          {/* Unità di Misura */}
          <SelectFieldWithDescription
            id="unita-misura"
            options={unitaData}
            selectedId={unitaMisuraId}
            onSelectChange={setUnitaMisuraId}
            label="Unità di Misura *"
            placeholder="Seleziona un'unità di misura..."
            searchPlaceholder="Cerca unità..."
          />
          <SelectFieldWithSearch
            id="strumento"
            options={strumentiData}
            selectedId={strumentoId}
            onSelectChange={setStrumentoId}
            label="Strumento *"
            placeholder="Seleziona uno strumento..."
            searchPlaceholder="Cerca strumento..."
          />
          {/*        <SelectFieldWithSearch
            id="fase-temporale"
            options={fasiTemporaliData}
            selectedId={faseTemporaleId}
            onSelectChange={setFaseTemporaleId}
            label="Fase Temporale *"
            placeholder="Seleziona una fase temporale..."
            searchPlaceholder="Cerca fase temporale..."
          />*/}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Annulla
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid() || isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salva Configurazione
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfiguraTestSquadraDialog;
