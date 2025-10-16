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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sport } from '@/hooks/useCrud';

export type DialogMode = 'create' | 'edit' | 'view';

type Props = {
  open: boolean;
  mode: DialogMode;
  onClose: () => void;
  onSave?: (data: {
    newDescrizione?: string;
    newNome?: string;
    newSportId?: number;
  }) => void;
  descrizione?: string;
  nome?: string;
  sportsOptions?: Sport[];
  sportId?: number;
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
  title,
}: Props) => {
  const [newDescrizione, setNewDescrizione] = useState(descrizione || '');
  const [newNome, setNewNome] = useState(nome || '');
  const [selectedSportId, setSelectedSportId] = useState<string>(
    sportId ? String(sportId) : ''
  );

  useEffect(() => {
    setNewDescrizione(descrizione || '');
    setNewNome(nome || '');
    setSelectedSportId(sportId ? String(sportId) : '');
  }, [descrizione, nome, sportId]);

  const handleSubmit = () => {
    if (onSave) {
      const sportIdAsNumber = selectedSportId ? Number(selectedSportId) : undefined;

      onSave({
        newDescrizione,
        ...(nome !== undefined && { newNome }),
        ...(sportsOptions && selectedSportId !== '' && { newSportId: sportIdAsNumber }),
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
              title='Nome:'
              placeholder="Inserisci un nome"
              value={newNome}
              onChange={e => setNewNome(e.target.value)}
            />
          )}

          {sportsOptions && (
            <>
              <label
                className="text-sm font-medium leading-none mb-1 text-foreground pb-1"
              > {"Sport:"}</label>
              <Select
                value={selectedSportId}
                onValueChange={setSelectedSportId}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Seleziona uno Sport..." />
                </SelectTrigger>
                <SelectContent>
                  {sportsOptions.map(sport => (
                    <SelectItem key={sport.id} value={String(sport.id)}>
                      {sport.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {descrizione !== undefined && (
            <Input
              title='Descrizione:'
              placeholder="Inserisci una descrizione"
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
