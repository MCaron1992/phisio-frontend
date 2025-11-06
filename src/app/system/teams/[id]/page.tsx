'use client';

import { useParams, useRouter } from 'next/navigation';
import TableConatiner from '@/components/custom/TableContainer';
import {
  useTeam,
  usePazientiByTeam,
  useDeleteTeam,
  useUpdateTeam,
  Teams,
  useRisultatiTest,
  useCreateRisultatoTest,
  useUpdateRisultatoTest,
  RisultatoTestGiocatore,
  useCategorieFunzionali,
  useTests,
  useMetriche,
  useUnitaMisura,
  useStrumenti,
} from '@/hooks/useCrud';
import { Loader } from '@/components/custom/Loader';
import UniversalAlert, { AlertState } from '@/components/custom/UniversalAlert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { DataTableAction, DataTableColumn } from '@/types/data-table';
import { Paziente } from '@/hooks/useCrud';
import { Edit, Eye, Trash2, ClipboardList, FileText } from 'lucide-react';
import DeleteConfirmDialog from '@/components/custom/DeleteConfirmDialog';
import { useAuth } from '@/hooks/useAuth';
import ConfiguraTestSquadraDialog from '@/components/custom/ConfiguraTestSquadraDialog';
import InserisciValoriTestDialog from '@/components/custom/InserisciValoriTestDialog';

// Interfaccia per test configurato locale (in memoria)
interface TestConfigurato {
  categoria_funzionale_id: number;
  test_id: number;
  metrica_id: number;
  unita_misura_id: number;
  strumento_id: number;
}

const TeamDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isSuperAdmin = user?.data.ruolo === 'super_admin';

  const { data: team, isLoading, isError, error } = useTeam(id as string);
  const { data: pazientiData, isLoading: isLoadingPazienti } =
    usePazientiByTeam(id as string);
  const { data: risultatiTestData } = useRisultatiTest();
  const { mutate: deleteTeam } = useDeleteTeam();
  const { mutate: updateTeam } = useUpdateTeam();
  const { mutate: createRisultatoTest } = useCreateRisultatoTest();
  const { mutate: updateRisultatoTest } = useUpdateRisultatoTest();

  // Carica i dati per mostrare i dettagli del test configurato
  const { data: categorieData } = useCategorieFunzionali();
  const { data: testsData } = useTests();
  const { data: metricheData } = useMetriche();
  const { data: unitaData } = useUnitaMisura();
  const { data: strumentiData } = useStrumenti();

  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openConfiguraTestDialog, setOpenConfiguraTestDialog] = useState(false);
  const [openInserisciValoriDialog, setOpenInserisciValoriDialog] =
    useState(false);
  const [selectedGiocatore, setSelectedGiocatore] = useState<Paziente | null>(
    null
  );
  const [isSavingValori, setIsSavingValori] = useState(false);

  // Stato locale per test configurato (solo in sessione)
  const [testConfigurato, setTestConfigurato] =
    useState<TestConfigurato | null>(null);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  if (isLoading && !team) return <Loader />;

  if (isError)
    return (
      <UniversalAlert
        title="Errore"
        description={error?.message || 'Errore nel caricamento della squadra'}
        isVisible={true}
        type="error"
        duration={4000}
        position="top-right"
      />
    );

  if (!team) return <p>Nessuna squadra trovata</p>;

  // Ottieni i giocatori della squadra dall'endpoint specifico
  const teamPlayers = pazientiData?.data || [];

  // Funzione per ottenere i dettagli completi del test configurato
  const getTestConfiguratoDettagli = () => {
    if (!testConfigurato) return null;

    const categoria = categorieData?.find(
      (c: any) => c.id === testConfigurato.categoria_funzionale_id
    );
    const test = testsData?.find((t: any) => t.id === testConfigurato.test_id);
    const metrica = metricheData?.find(
      (m: any) => m.id === testConfigurato.metrica_id
    );
    const unita = unitaData?.find(
      (u: any) => u.id === testConfigurato.unita_misura_id
    );
    const strumento = strumentiData?.find(
      (s: any) => s.id === testConfigurato.strumento_id
    );

    return {
      ...testConfigurato,
      categoria_funzionale: categoria,
      test: test,
      metrica: metrica,
      unita: unita,
      strumento: strumento,
    };
  };

  const testDettagli = getTestConfiguratoDettagli();

  // Funzione per ottenere i risultati di un giocatore
  const getRisultatoGiocatore = (
    giocatoreId: number
  ): RisultatoTestGiocatore | undefined => {
    if (!testConfigurato) return undefined;

    // Cerca per paziente_id e team_id (usiamo team_id come riferimento invece di test_squadra_id)
    return risultatiTestData?.data?.find(
      (risultato: RisultatoTestGiocatore) =>
        risultato.paziente_id === giocatoreId &&
        risultato.test_squadra_id === Number(id) // Usiamo team_id come riferimento temporaneo
    );
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setTeamName(team.nome);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (!teamName.trim()) {
      setAlert({
        show: true,
        type: 'error',
        title: 'Errore',
        description: 'Il nome della squadra non può essere vuoto',
      });
      return;
    }

    updateTeam(
      { id: team.id, nome: teamName },
      {
        onSuccess: () => {
          setAlert({
            show: true,
            type: 'success',
            title: 'Aggiornamento Eseguito',
            description: 'La squadra è stata aggiornata con successo',
          });
          setIsEditing(false);
        },
        onError: err => {
          setAlert({
            show: true,
            type: 'error',
            title: 'Aggiornamento Fallito',
            description: (err as Error)?.message || 'Si è verificato un errore',
          });
        },
      }
    );
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteTeam(
      { id: team.id },
      {
        onSuccess: () => {
          setAlert({
            show: true,
            type: 'success',
            title: 'Eliminazione Riuscita',
            description: 'La squadra è stata eliminata con successo.',
          });
          setOpenDeleteDialog(false);
          setTimeout(() => {
            router.push('/system/teams');
          }, 1000);
        },
        onError: err => {
          setAlert({
            show: true,
            type: 'error',
            title: 'Eliminazione Fallita',
            description:
              (err as Error)?.message || 'Si è verificato un errore.',
          });
          setOpenDeleteDialog(false);
        },
      }
    );
  };

  const handleConfiguraTest = (data: TestConfigurato) => {
    // Salva solo nello stato locale (in memoria)
    setTestConfigurato(data);
    setAlert({
      show: true,
      type: 'success',
      title: 'Test Configurato',
      description: 'Il test è stato configurato per la sessione corrente',
    });
    setOpenConfiguraTestDialog(false);
  };

  const handleDeleteTest = () => {
    if (
      confirm('Sei sicuro di voler eliminare questa configurazione di test?')
    ) {
      setTestConfigurato(null);
      setAlert({
        show: true,
        type: 'success',
        title: 'Test Eliminato',
        description: 'La configurazione del test è stata rimossa',
      });
    }
  };

  const handleInserisciValori = (data: {
    valore_test_1?: string;
    valore_test_2?: string;
    valore_test_3?: string;
  }) => {
    if (!selectedGiocatore || !testConfigurato) return;

    setIsSavingValori(true);

    const risultatoEsistente = getRisultatoGiocatore(selectedGiocatore.id);

    if (risultatoEsistente) {
      // Aggiorna risultato esistente
      updateRisultatoTest(
        {
          id: risultatoEsistente.id,
          ...data,
        },
        {
          onSuccess: () => {
            setAlert({
              show: true,
              type: 'success',
              title: 'Valori Aggiornati',
              description:
                'I valori del test sono stati aggiornati con successo',
            });
            setOpenInserisciValoriDialog(false);
            setSelectedGiocatore(null);
            setIsSavingValori(false);
          },
          onError: err => {
            setAlert({
              show: true,
              type: 'error',
              title: 'Errore Aggiornamento',
              description:
                (err as Error)?.message || 'Si è verificato un errore',
            });
            setIsSavingValori(false);
          },
        }
      );
    } else {
      // Crea nuovo risultato - usa team_id come riferimento
      createRisultatoTest(
        {
          test_squadra_id: Number(id), // Usa team_id come riferimento
          paziente_id: selectedGiocatore.id,
          data_esecuzione: new Date().toISOString(),
          ...data,
        },
        {
          onSuccess: () => {
            setAlert({
              show: true,
              type: 'success',
              title: 'Valori Salvati',
              description: 'I valori del test sono stati salvati con successo',
            });
            setOpenInserisciValoriDialog(false);
            setSelectedGiocatore(null);
            setIsSavingValori(false);
          },
          onError: err => {
            setAlert({
              show: true,
              type: 'error',
              title: 'Errore Salvataggio',
              description:
                (err as Error)?.message || 'Si è verificato un errore',
            });
            setIsSavingValori(false);
          },
        }
      );
    }
  };

  const playerColumns: DataTableColumn<Paziente>[] = [
    {
      id: 'nome',
      header: 'Nome',
      accessorKey: 'nome',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-40',
    },
    {
      id: 'cognome',
      header: 'Cognome',
      accessorKey: 'cognome',
      sortable: true,
      filterable: true,
      width: 'w-32 md:w-40',
    },
    {
      id: 'data_nascita',
      header: 'Data di Nascita',
      accessorKey: 'data_nascita',
      sortable: true,
      width: 'w-32 md:w-40',
      cell: ({ value }) =>
        value ? new Date(value).toLocaleDateString('it-IT') : '-',
    },
    {
      id: 'sesso',
      header: 'Sesso',
      accessorKey: 'sesso',
      sortable: true,
      width: 'w-24 md:w-32',
      cell: ({ value }) => value || '-',
    },
    ...(testConfigurato
      ? [
          {
            id: 'test_status',
            header: 'Stato Test',
            accessorKey: 'id',
            width: 'w-32 md:w-40',
            cell: ({ row }: any) => {
              const risultato = getRisultatoGiocatore(row.id);
              if (risultato) {
                return (
                  <div className="flex gap-1">
                    {risultato.valore_test_1 && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {risultato.valore_test_1}
                      </span>
                    )}
                    {risultato.valore_test_2 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {risultato.valore_test_2}
                      </span>
                    )}
                    {risultato.valore_test_3 && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        {risultato.valore_test_3}
                      </span>
                    )}
                  </div>
                );
              }
              return (
                <span className="text-xs text-muted-foreground">
                  Da completare
                </span>
              );
            },
          },
        ]
      : []),
  ];

  const playerActions: DataTableAction<Paziente>[] = [
    {
      id: 'view',
      label: 'Visualizza',
      onClick: row => router.push(`/giocatori/${row.id}`),
      icon: <Eye className="h-4 w-4" />,
    },
    ...(testConfigurato
      ? [
          {
            id: 'insert_values',
            label: 'Inserisci Valori',
            onClick: (row: Paziente) => {
              setSelectedGiocatore(row);
              setOpenInserisciValoriDialog(true);
            },
            icon: <FileText className="h-4 w-4" />,
          },
        ]
      : []),
  ];

  return (
    <TableConatiner
      btnLabel={'Torna indietro'}
      title={`Dettaglio Squadra: ${team.nome}`}
      action={() => router.push('/system/teams')}
    >
      <div className="space-y-6">
        {/* Card con dettagli squadra */}
        <Card className="p-6 bg-white rounded shadow">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Informazioni Squadra</h2>
              {isSuperAdmin && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        size="sm"
                      >
                        Annulla
                      </Button>
                      <Button onClick={handleSave} size="sm">
                        Salva
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleEditToggle}
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifica
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteClick}
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Elimina
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome Squadra</Label>
                {isEditing ? (
                  <Input
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="Nome squadra"
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-lg font-medium">{team.nome}</p>
                )}
              </div>

              <div>
                <Label>Numero Giocatori</Label>
                <p className="mt-2 text-lg font-medium">{teamPlayers?.count}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="text-sm text-gray-500">Data Creazione</Label>
                <p className="mt-1">
                  {team.created_at
                    ? new Date(team.created_at).toLocaleDateString('it-IT')
                    : '-'}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">
                  Ultimo Aggiornamento
                </Label>
                <p className="mt-1">
                  {team.updated_at
                    ? new Date(team.updated_at).toLocaleDateString('it-IT')
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {testConfigurato ? (
          <Card className="p-6 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Test di Squadra
              </h2>
              <Button
                variant="destructive"
                onClick={handleDeleteTest}
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Elimina Test
              </Button>
            </div>

            {testDettagli && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Categoria</Label>
                  <p className="mt-1 font-medium">
                    {testDettagli.categoria_funzionale?.nome || '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Test</Label>
                  <p className="mt-1 font-medium">
                    {testDettagli.test?.nome_abbreviato ||
                      testDettagli.test?.nome_esteso ||
                      '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Metrica</Label>
                  <p className="mt-1 font-medium">
                    {testDettagli.metrica?.nome || '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Unità di Misura
                  </Label>
                  <p className="mt-1 font-medium">
                    {testDettagli.unita?.nome || '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Strumento</Label>
                  <p className="mt-1 font-medium">
                    {testDettagli.strumento?.nome || '-'}
                  </p>
                </div>
              </div>
            )}
          </Card>
        ) : (
          <div className="flex justify-center py-6">
            <Button
              onClick={() => setOpenConfiguraTestDialog(true)}
              size="lg"
              className="gap-2"
            >
              <ClipboardList className="h-5 w-5" />
              Configura Test da Avviare
            </Button>
          </div>
        )}

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Giocatori della Squadra
          </h2>
          <DataTable
            data={teamPlayers?.pazienti}
            columns={playerColumns}
            rowActions={playerActions}
            loading={isLoadingPazienti}
            searchKey="nome"
            searchPlaceholder="Cerca giocatore..."
            emptyMessage="Nessun giocatore trovato in questa squadra"
            enableSelection={false}
            enableSorting={true}
            enablePagination={true}
            pagination={{
              page: 1,
              pageSize: 10,
              total: teamPlayers?.count,
            }}
          />
        </div>
      </div>

      <UniversalAlert
        title={alert.title}
        description={alert.description}
        isVisible={alert.show}
        onClose={() => setAlert(prev => ({ ...prev, show: false }))}
        type={alert.type}
        duration={3000}
        position="top-right"
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        title="Elimina Squadra"
        description={`Sei sicuro di voler eliminare la squadra "${team.nome}"? Questa azione non può essere annullata.`}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />

      <ConfiguraTestSquadraDialog
        open={openConfiguraTestDialog}
        onClose={() => setOpenConfiguraTestDialog(false)}
        onSave={handleConfiguraTest}
      />

      <InserisciValoriTestDialog
        open={openInserisciValoriDialog}
        onClose={() => {
          setOpenInserisciValoriDialog(false);
          setSelectedGiocatore(null);
        }}
        onSave={handleInserisciValori}
        giocatore={selectedGiocatore}
        testSquadra={testDettagli as any}
        valoriEsistenti={
          selectedGiocatore
            ? getRisultatoGiocatore(selectedGiocatore.id)
            : undefined
        }
        isSaving={isSavingValori}
      />
    </TableConatiner>
  );
};

export default TeamDetail;
