'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type DialogMode = 'create' | 'edit' | 'view';

type Props = {
  open: boolean;
  mode: DialogMode;
  onClose: () => void;
  onSave?: (data: {
    newDescrizione?: string;
    newNome?: string;
    newSport?: string;
  }) => void;
  descrizione?: string;
  nome?: string;
  sport?: string;
  title?: string;
};

const CustomDialog = ({
  open,
  mode,
  onClose,
  onSave,
  descrizione,
  nome,
  sport,
  title,
}: Props) => {
  const [newDescrizione, setNewDescrizione] = useState(descrizione || '');
  const [newNome, setNewNome] = useState(nome || '');
  const [newSport, setNewSport] = useState(sport || '');

  useEffect(() => {
    setNewDescrizione(descrizione || '');
    setNewNome(nome || '');
    setNewSport(sport || '');
  }, [descrizione, nome, sport]);

  const handleSubmit = () => {
    if (onSave) {
      onSave({
        newDescrizione,
        ...(nome !== undefined && { newNome }),
        ...(sport !== undefined && { newSport }),
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
            <Input
              placeholder="Nome"
              value={newNome}
              onChange={e => setNewNome(e.target.value)}
            />
          )}

          {sport !== undefined && (
            <Input
              placeholder="Sport"
              value={newSport}
              onChange={e => setNewSport(e.target.value)}
            />
          )}

          {descrizione !== undefined && (
            <Input
              placeholder="Descrizione"
              value={newDescrizione}
              onChange={e => setNewDescrizione(e.target.value)}
            />
          )}
        </div>

        <Button onClick={handleSubmit}>
          {mode === 'create' ? 'Crea' : 'Aggiorna'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
