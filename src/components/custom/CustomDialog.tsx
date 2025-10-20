'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SelectField from '@/components/custom/CustomSelectField';
import { RegioniAnatomicha, Sport, StrutturePrincipali } from '@/hooks/useCrud';
import { CustomTextArea } from '@/components/custom/CustomTextArea';

export type DialogMode = 'create' | 'edit' | 'view';

type Props = {
  open: boolean;
  mode: DialogMode;
  onClose: () => void;
  onSave?: (data: {
    newDescrizione?: string;
    newNome?: string;
    newSportId?: number;
    newRegioneId?: number;
    newStrutturaId?: number;
  }) => void;
  descrizione?: string;
  nome?: string;
  sportsOptions?: Sport[];
  sportId?: number;
  regioniOptions?: RegioniAnatomicha[];
  regioneId?: number;
  struttureOptions?: StrutturePrincipali[];
  strutturaId?: number;
  title?: string;
};

const CustomDialog = ({
  open,
  mode,
  onClose,
  onSave,
  descrizione,
  nome,
  sportsOptions,
  sportId,
  regioniOptions,
  regioneId,
  struttureOptions,
  strutturaId,
  title,
}: Props) => {
  const [newDescrizione, setNewDescrizione] = useState(descrizione || '');
  const [newNome, setNewNome] = useState(nome || '');
  const [selectedSportId, setSelectedSportId] = useState<string>(
    sportId ? String(sportId) : ''
  );
  const [selectedRegioneId, setSelectedRegioneId] = useState<string>(
    regioneId ? String(regioneId) : ''
  );
  const [selectedStrutturaId, setSelectedStrutturaId] = useState<string>(
    strutturaId ? String(strutturaId) : ''
  );

  useEffect(() => {
    setNewDescrizione(descrizione || '');
    setNewNome(nome || '');
    setSelectedSportId(sportId ? String(sportId) : '');
    setSelectedRegioneId(regioneId ? String(regioneId) : '');
    setSelectedStrutturaId(strutturaId ? String(strutturaId) : '');
  }, [descrizione, nome, sportId, regioneId, strutturaId]);

  const isFormValid = () => {
    if (nome !== undefined && newNome.trim() === '') {
      return false;
    }
    if (sportsOptions && selectedSportId === '') {
      return false;
    }
    if (regioniOptions && selectedRegioneId === '') {
      return false;
    }
    if (struttureOptions && selectedStrutturaId === '') {
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (onSave) {
      const sportIdAsNumber = selectedSportId
        ? Number(selectedSportId)
        : undefined;
      const regioneIdAsNumber = selectedRegioneId
        ? Number(selectedRegioneId)
        : undefined;
      const strutturaIdAsNumber = selectedStrutturaId
        ? Number(selectedStrutturaId)
        : undefined;

      onSave({
        newDescrizione,
        ...(nome !== undefined && { newNome }),
        ...(sportsOptions &&
          selectedSportId !== '' && { newSportId: sportIdAsNumber }),
        ...(regioniOptions &&
          selectedRegioneId !== '' && { newRegioneId: regioneIdAsNumber }),
        ...(struttureOptions &&
          selectedStrutturaId !== '' && {
            newStrutturaId: strutturaIdAsNumber,
          }),
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {nome !== undefined && (
            <CustomTextArea
              title="Nome:"
              placeholder="Inserisci un nome"
              value={newNome}
              onChange={e => setNewNome(e.target.value)}
            />
          )}

          <SelectField
            options={sportsOptions}
            selectedId={selectedSportId}
            onSelectChange={setSelectedSportId}
            label="Sport:"
            placeholder="Seleziona uno Sport..."
          />

          <SelectField
            options={regioniOptions}
            selectedId={selectedRegioneId}
            onSelectChange={setSelectedRegioneId}
            label="Regione Anatomica:"
            placeholder="Seleziona una Regione anatomica..."
          />

          <SelectField
            options={struttureOptions}
            selectedId={selectedStrutturaId}
            onSelectChange={setSelectedStrutturaId}
            label="Struttura Principale:"
            placeholder="Seleziona una Struttura principale..."
          />
          {descrizione !== undefined && (
            <CustomTextArea
              title="Descrizione:"
              placeholder="Inserisci una descrizione"
              value={newDescrizione}
              onChange={e => setNewDescrizione(e.target.value)}
            />
          )}
        </div>

        <Button onClick={handleSubmit} disabled={!isFormValid()}>
          {mode === 'create' ? 'Crea' : 'Aggiorna'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
