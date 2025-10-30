'use client';

import { useFormContext } from 'react-hook-form';
import {
  useSport,
  useRuoli,
  useTeams,
  useLivelliSportivi,
  useCreateTeam,
  Ruoli_Sport,
} from '@/hooks/useCrud';
import SelectField from '@/components/custom/CustomSelectField';
import SelectFieldWithDescription from '@/components/custom/SelectFieldWithDescription';
import SelectFieldWithSearch from '@/components/custom/SelectFieldWithSearch';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQueryClient } from '@tanstack/react-query';

const Sport = () => {
  const form = useFormContext();
  const queryClient = useQueryClient();

  // Fetch dati
  const { data: sportData } = useSport();
  const { data: ruoliData } = useRuoli();
  const { data: teamsData } = useTeams();
  const { data: livelliData } = useLivelliSportivi();
  const { mutate: createTeam, isPending: isCreatingTeam } = useCreateTeam();

  // State per modal team
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  // Watch form values
  const selectedSportId = form.watch('sport_id');
  const selectedTeamId = form.watch('team_id');

  // Filtra ruoli per sport selezionato
  const filteredRuoli = selectedSportId
    ? (ruoliData?.data || []).filter(
        (ruolo: Ruoli_Sport) => ruolo.sport_id === Number(selectedSportId)
      )
    : [];

  // Reset ruolo quando cambia sport
  const handleSportChange = (sportId: string) => {
    form.setValue('sport_id', sportId, { shouldValidate: true });
    form.setValue('ruolo_sport_id', '', { shouldValidate: true });
  };

  // Handler creazione team
  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;

    createTeam(
      { nome: newTeamName.trim() },
      {
        onSuccess: (response) => {
          // Invalida e ricarica la cache dei teams
          queryClient.invalidateQueries({ queryKey: ['teams'] });
          
          // Estrai l'id dal nuovo team (gestisce sia response.data.id che response.id)
          const newTeamId = response?.data?.id || response?.id;
          
          if (newTeamId) {
            // Seleziona automaticamente il nuovo team
            form.setValue('team_id', String(newTeamId), { shouldValidate: true });
          }
          
          // Reset e chiudi modal
          setNewTeamName('');
          setIsTeamModalOpen(false);
        },
        onError: (error) => {
          console.error('Errore creazione team:', error);
        },
      }
    );
  };

  return (
    <section className="space-y-6 bg-gradient-to-br from-background to-muted/20 p-6 rounded-lg border border-border/60 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Dropdown Sport con ricerca */}
        <SelectFieldWithSearch
          id="sport"
          options={sportData?.data}
          selectedId={form.watch('sport_id')}
          onSelectChange={handleSportChange}
          label="Sport"
          placeholder="Seleziona uno sport..."
          searchPlaceholder="Cerca sport..."
        />

        {/* Dropdown Ruolo con ricerca (filtrato per sport) */}
        {selectedSportId ? (
          <SelectFieldWithDescription
            id="ruolo"
            options={filteredRuoli}
            selectedId={form.watch('ruolo_sport_id')}
            onSelectChange={(value: string) => {
              form.setValue('ruolo_sport_id', value, { shouldValidate: true });
            }}
            label="Ruolo Sportivo"
            placeholder="Seleziona un ruolo..."
            searchPlaceholder="Cerca ruolo..."
            emptyText="Nessun ruolo disponibile per questo sport"
          />
        ) : (
          <div className="flex flex-col space-y-1 pb-2">
            <Label className="text-sm font-medium leading-none text-foreground pb-1">
              Ruolo Sportivo
            </Label>
            <div className="px-3 py-2 text-sm text-muted-foreground border border-amber-200 dark:border-amber-800 rounded-md bg-amber-50/50 dark:bg-amber-950/20">
              Seleziona prima uno sport
            </div>
          </div>
        )}

        {/* Dropdown Team con pulsante creazione */}
        <div className="flex flex-col space-y-1 pb-2">
          <div className="flex items-center justify-between pb-1">
            <Label className="text-sm font-medium leading-none text-foreground">
              Team
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTeamModalOpen(true)}
              className="h-7 text-xs hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
            >
              + Nuovo Team
            </Button>
          </div>
          <SelectFieldWithSearch
            id="team"
            options={teamsData?.data}
            selectedId={form.watch('team_id')}
            onSelectChange={(value: string) => {
              form.setValue('team_id', value, { shouldValidate: true });
            }}
            label=""
            placeholder="Seleziona un team..."
            searchPlaceholder="Cerca team..."
          />
        </div>

        {/* Dropdown Livello Sportivo con ricerca */}
        <SelectFieldWithSearch
          id="livello-sportivo"
          options={livelliData?.data}
          selectedId={form.watch('livello_sportivo_id')}
          onSelectChange={(value: string) => {
            form.setValue('livello_sportivo_id', value, { shouldValidate: true });
          }}
          label="Livello Sportivo"
          placeholder="Seleziona un livello sportivo..."
          searchPlaceholder="Cerca livello sportivo..."
        />
      </div>

      {/* Modal per creare nuovo team */}
      <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crea Nuovo Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Nome Team</Label>
              <Input
                id="team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Inserisci il nome del team"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTeamName.trim()) {
                    handleCreateTeam();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsTeamModalOpen(false);
                setNewTeamName('');
              }}
              className="hover:bg-muted/50"
            >
              Annulla
            </Button>
            <Button
              type="button"
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim() || isCreatingTeam}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isCreatingTeam ? 'Creazione...' : 'Crea Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Sport;
