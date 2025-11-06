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
import { Input } from '@/components/ui/input';
import { Paziente, TestSquadra } from '@/hooks/useCrud';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface InserisciValoriTestDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    valore_test_1?: string;
    valore_test_2?: string;
    valore_test_3?: string;
  }) => void;
  giocatore: Paziente | null;
  testSquadra: TestSquadra | null;
  valoriEsistenti?: {
    valore_test_1?: string;
    valore_test_2?: string;
    valore_test_3?: string;
  };
  isSaving?: boolean;
}

const InserisciValoriTestDialog = ({
  open,
  onClose,
  onSave,
  giocatore,
  testSquadra,
  valoriEsistenti,
  isSaving = false,
}: InserisciValoriTestDialogProps) => {
  const [valoreTest1, setValoreTest1] = useState<string>('');
  const [valoreTest2, setValoreTest2] = useState<string>('');
  const [valoreTest3, setValoreTest3] = useState<string>('');

  // Reset or populate form when dialog opens
  useEffect(() => {
    if (open) {
      setValoreTest1(valoriEsistenti?.valore_test_1 || '');
      setValoreTest2(valoriEsistenti?.valore_test_2 || '');
      setValoreTest3(valoriEsistenti?.valore_test_3 || '');
    }
  }, [open, valoriEsistenti]);

  const handleSubmit = () => {
    onSave({
      valore_test_1: valoreTest1 || undefined,
      valore_test_2: valoreTest2 || undefined,
      valore_test_3: valoreTest3 || undefined,
    });
  };

  const hasAnyValue = () => {
    return valoreTest1 || valoreTest2 || valoreTest3;
  };

  if (!giocatore || !testSquadra) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inserisci Valori Test</DialogTitle>
          <DialogDescription>
            Inserisci i valori del test per il giocatore{' '}
            <span className="font-semibold">
              {giocatore.nome} {giocatore.cognome}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informazioni Test Configurato */}
          <Card className="p-4 bg-muted/30 border-muted">
            <h3 className="font-semibold text-sm mb-3">Test Configurato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Categoria:</span>{' '}
                <span className="font-medium">
                  {testSquadra.categoria_funzionale?.nome || '-'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Test:</span>{' '}
                <span className="font-medium">
                  {testSquadra.test?.nome_abbreviato ||
                    testSquadra.test?.nome_esteso ||
                    '-'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Metrica:</span>{' '}
                <span className="font-medium">
                  {testSquadra.metrica?.nome || '-'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Unità:</span>{' '}
                <span className="font-medium">
                  {testSquadra.unita?.nome || '-'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Strumento:</span>{' '}
                <span className="font-medium">
                  {testSquadra.strumento?.nome || '-'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Fase:</span>{' '}
                <span className="font-medium">
                  {testSquadra.fase_temporale?.nome || '-'}
                </span>
              </div>
            </div>
          </Card>

          {/* Input Valori */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Valori Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="valore-test-1" className="text-sm font-medium">
                  Valore Test 1
                </Label>
                <Input
                  id="valore-test-1"
                  type="number"
                  step="any"
                  value={valoreTest1}
                  onChange={(e) => setValoreTest1(e.target.value)}
                  placeholder="Inserisci valore"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="valore-test-2" className="text-sm font-medium">
                  Valore Test 2
                </Label>
                <Input
                  id="valore-test-2"
                  type="number"
                  step="any"
                  value={valoreTest2}
                  onChange={(e) => setValoreTest2(e.target.value)}
                  placeholder="Inserisci valore"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="valore-test-3" className="text-sm font-medium">
                  Valore Test 3
                </Label>
                <Input
                  id="valore-test-3"
                  type="number"
                  step="any"
                  value={valoreTest3}
                  onChange={(e) => setValoreTest3(e.target.value)}
                  placeholder="Inserisci valore"
                  className="w-full"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              * Inserisci almeno un valore per salvare il test
            </p>
          </div>
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
            disabled={!hasAnyValue() || isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salva Valori
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InserisciValoriTestDialog;

