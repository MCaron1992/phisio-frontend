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

type DialogMode = 'create' | 'edit' | 'view';

type Props = {
  open: boolean;
  mode: DialogMode;
  onClose: () => void;
  onSave?: (data: { newDescrizione: string }) => void;
  descrizione?: string;
  title?: string;
};

const CustomDialog = ({
  open,
  mode,
  onClose,
  onSave,
  descrizione,
  title,
}: Props) => {
  const [newDescrizione, setNewDescrizione] = useState(descrizione || '');

  useEffect(() => {
    if (descrizione) {
      setNewDescrizione(descrizione);
    } else {
      setNewDescrizione('');
    }
  }, [descrizione]);

  const handleSubmit = () => {
    if (onSave) {
      onSave({ newDescrizione });
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
          <Input
            placeholder="Descrizione"
            value={newDescrizione}
            onChange={e => setNewDescrizione(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit}>
          {mode === 'create' ? 'Crea' : 'Aggiorna'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
