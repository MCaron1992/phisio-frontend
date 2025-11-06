'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import SelectField from '@/components/custom/CustomSelectField';
import { CustomTextArea } from '@/components/custom/CustomTextArea';
import { Test, Metrica, UnitaMisura } from '@/hooks/useCrud';

export type DialogMode = 'create' | 'edit' | 'view';

type Props = {
  open: boolean;
  mode: DialogMode;
  title?: string;
  onClose: () => void;
  onSave?: (data: {
    newNome?: string;
    newTestId?: number;
    newMetricaId?: number;
    newUnitaId?: number;
  }) => void;

  nome?: string;
  testId?: number;
  metricaId?: number;
  unitaId?: number;

  testsOptions?: Test[];
  metricheOptions?: Metrica[];
  unitaOptions?: UnitaMisura[];

  isCreating?: boolean;
};

const TestMetricaUnitaDialog = ({
  open,
  mode,
  title = '',
  onClose,
  onSave,
  nome,
  testId,
  metricaId,
  unitaId,
  testsOptions = [],
  metricheOptions = [],
  unitaOptions = [],
  isCreating = false,
}: Props) => {
  const [fields, setFields] = useState({
    nome: nome ?? '',
    testId: testId ? String(testId) : '',
    metricaId: metricaId ? String(metricaId) : '',
    unitaId: unitaId ? String(unitaId) : '',
  });

  useEffect(() => {
    if (open) {
      setFields({
        nome: nome ?? '',
        testId: testId ? String(testId) : '',
        metricaId: metricaId ? String(metricaId) : '',
        unitaId: unitaId ? String(unitaId) : '',
      });
    }
  }, [open, nome, testId, metricaId, unitaId]);

  const updateField = useCallback(
    (key: keyof typeof fields, value: string) =>
      setFields(prev => ({ ...prev, [key]: value })),
    []
  );

  const isEditable = mode !== 'view';

  // Validazione: tutti i campi obbligatori devono essere compilati
  const isFormValid = useMemo(() => {
    if (!fields.testId) return false;
    if (!fields.metricaId) return false;
    if (!fields.unitaId) return false;
    if (fields.nome.trim().length < 2) return false;
    return true;
  }, [fields]);

  const handleSubmit = useCallback(() => {
    if (!onSave) return;
    onSave({
      newNome: fields.nome.trim(),
      newTestId: fields.testId ? Number(fields.testId) : undefined,
      newMetricaId: fields.metricaId ? Number(fields.metricaId) : undefined,
      newUnitaId: fields.unitaId ? Number(fields.unitaId) : undefined,
    });
  }, [fields, onSave]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Select Test */}
          <SelectField
            options={testsOptions}
            selectedId={fields.testId}
            onSelectChange={val => updateField('testId', val)}
            label="Test:"
            placeholder="Seleziona un test..."
            id="test-select"
            disabled={!isEditable}
          />

          {/* Select Metrica */}
          <SelectField
            options={metricheOptions}
            selectedId={fields.metricaId}
            onSelectChange={val => updateField('metricaId', val)}
            label="Metrica:"
            placeholder="Seleziona una metrica..."
            id="metrica-select"
            disabled={!isEditable}
          />

          {/* Select Unità di Misura */}
          <SelectField
            options={unitaOptions}
            selectedId={fields.unitaId}
            onSelectChange={val => updateField('unitaId', val)}
            label="Unità di Misura:"
            placeholder="Seleziona un'unità di misura..."
            id="unita-select"
            disabled={!isEditable}
          />

          {/* Nome */}
          <CustomTextArea
            title="Nome:"
            placeholder="Inserisci un nome (es: CMJ - Jump Height [cm])"
            value={fields.nome}
            onChange={e => updateField('nome', e.target.value)}
            disabled={!isEditable}
          />
        </div>

        {isEditable && (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="hover:bg-muted/50"
            >
              Annulla
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isCreating
                ? 'Creazione…'
                : mode === 'create'
                  ? 'Crea'
                  : 'Aggiorna'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TestMetricaUnitaDialog;



