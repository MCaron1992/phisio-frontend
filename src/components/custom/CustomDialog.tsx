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
import { Input } from '@/components/ui/input';
import SelectField from '@/components/custom/CustomSelectField';
import { CustomTextArea } from '@/components/custom/CustomTextArea';
import { RegioniAnatomicha, Sport, StrutturePrincipali } from '@/hooks/useCrud';

export type DialogMode = 'create' | 'edit' | 'view';

type Props = {
  open: boolean;
  mode: DialogMode;
  title?: string;
  onClose: () => void;
  onSave?: (data: {
    newNome?: string;
    newDescrizione?: string;
    newSportId?: number;
    newRegioneId?: number;
    newStrutturaId?: number;
  }) => void;

  nome?: string;
  descrizione?: string;

  sportsOptions?: Sport[];
  sportId?: number;
  regioniOptions?: RegioniAnatomicha[];
  regioneId?: number;
  struttureOptions?: StrutturePrincipali[];
  strutturaId?: number;

  isTeamDialog?: boolean;
  isCreating?: boolean;
};

const CustomDialog = ({
  open,
  mode,
  title = '',
  onClose,
  onSave,
  nome,
  descrizione,
  sportsOptions,
  sportId,
  regioniOptions,
  regioneId,
  struttureOptions,
  strutturaId,
  isTeamDialog = false,
  isCreating = false,
}: Props) => {
  const [fields, setFields] = useState({
    nome: nome ?? '',
    descrizione: descrizione ?? '',
    sportId: sportId ? String(sportId) : '',
    regioneId: regioneId ? String(regioneId) : '',
    strutturaId: strutturaId ? String(strutturaId) : '',
  });

  useEffect(() => {
    if (open) {
      setFields({
        nome: nome ?? '',
        descrizione: descrizione ?? '',
        sportId: sportId ? String(sportId) : '',
        regioneId: regioneId ? String(regioneId) : '',
        strutturaId: strutturaId ? String(strutturaId) : '',
      });
    }
  }, [open, nome, descrizione, sportId, regioneId, strutturaId]);

  const updateField = useCallback(
    (key: keyof typeof fields, value: string) =>
      setFields(prev => ({ ...prev, [key]: value })),
    []
  );

  const isEditable = mode !== 'view';

  // validazione dinamica
  const isFormValid = useMemo(() => {
    if (fields.nome.trim().length < 2) return false;
    if (sportsOptions && !fields.sportId) return false;
    if (regioniOptions && !fields.regioneId) return false;
    if (struttureOptions && !fields.strutturaId) return false;
    return true;
  }, [fields, sportsOptions, regioniOptions, struttureOptions]);

  const handleSubmit = useCallback(() => {
    if (!onSave) return;
    onSave({
      newNome: fields.nome.trim(),
      newDescrizione: fields.descrizione.trim(),
      newSportId: fields.sportId ? Number(fields.sportId) : undefined,
      newRegioneId: fields.regioneId ? Number(fields.regioneId) : undefined,
      newStrutturaId: fields.strutturaId
        ? Number(fields.strutturaId)
        : undefined,
    });
    onClose();
  }, [fields, onSave, onClose]);

  // mostro solo un SelectField per volta
  const selectField = useMemo(() => {
    if (sportsOptions)
      return (
        <SelectField
          options={sportsOptions}
          selectedId={fields.sportId}
          onSelectChange={val => updateField('sportId', val)}
          label="Sport:"
          placeholder="Seleziona uno sport..."
          id={'1'}
        />
      );

    if (regioniOptions)
      return (
        <SelectField
          options={regioniOptions}
          selectedId={fields.regioneId}
          onSelectChange={val => updateField('regioneId', val)}
          label="Regione anatomica:"
          placeholder="Seleziona una regione anatomica..."
          id={'2'}
        />
      );

    if (struttureOptions)
      return (
        <SelectField
          options={struttureOptions}
          selectedId={fields.strutturaId}
          onSelectChange={val => updateField('strutturaId', val)}
          label="Struttura principale:"
          placeholder="Seleziona una struttura principale..."
          id={'3'}
        />
      );

    return null;
  }, [
    fields.sportId,
    fields.regioneId,
    fields.strutturaId,
    sportsOptions,
    regioniOptions,
    struttureOptions,
    updateField,
  ]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* se è per creare un team, mostro solo input nome */}
          {isTeamDialog ? (
            <Input
              autoComplete="off"
              value={fields.nome}
              onChange={e => updateField('nome', e.target.value)}
              placeholder="Inserisci il nome della squadra"
              onKeyDown={e => {
                if (e.key === 'Enter' && isFormValid) handleSubmit();
              }}
            />
          ) : (
            <>
              {/* nome */}
              {nome !== undefined && (
                <CustomTextArea
                  title="Nome:"
                  placeholder="Inserisci un nome"
                  value={fields.nome}
                  onChange={e => updateField('nome', e.target.value)}
                  disabled={!isEditable}
                />
              )}

              {/* select dinamico */}
              {selectField}

              {/* descrizione */}
              {descrizione !== undefined && (
                <CustomTextArea
                  title="Descrizione:"
                  placeholder="Inserisci una descrizione"
                  value={fields.descrizione}
                  onChange={e => updateField('descrizione', e.target.value)}
                  disabled={!isEditable}
                />
              )}
            </>
          )}
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
                  ? isTeamDialog
                    ? 'Crea squadra'
                    : 'Crea'
                  : 'Aggiorna'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
