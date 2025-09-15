'use client';

import { useState, ReactNode } from 'react';

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

function DialogFooter(props: { children: ReactNode }) {
  return null;
}

const CustomDialog = ({
  open,
  mode,
  onClose,
  onSave,
  descrizione,
  title,
}: Props) => {
  const isView = mode === 'view';

  const [newDescrizione, setDescrizione] = useState(descrizione || '');
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
            value={descrizione}
            onChange={e => setDescrizione(e.target.value)}
            disabled={isView}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Chiudi
          </Button>
          {!isView && (
            <Button onClick={handleSubmit}>
              {mode === 'create' ? 'Crea' : 'Aggiorna'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
