'use client';

import React, { useCallback, useMemo, useState, memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  Ruoli_Sport,
  useCreateTeam,
  useLivelliSportivi,
  useRuoli,
  useSport,
  useTeams,
} from '@/hooks/useCrud';
import SelectFieldWithDescription from '@/components/custom/SelectFieldWithDescription';
import SelectFieldWithSearch from '@/components/custom/SelectFieldWithSearch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useQueryClient } from '@tanstack/react-query';
import AnimatedButton from '@/components/custom/AnimatedButton';
import CustomDialog from '@/components/custom/CustomDialog';

interface Team {
  id: string | number;
  nome: string;
  _optimistic?: boolean;
}

interface FormValues {
  sport_id: string;
  team_id: string;
  ruolo_sport_id: string;
  livello_sportivo_id: string;
}

const Sport = () => {
  const form = useFormContext<FormValues>();
  const { control, setValue } = form;
  const queryClient = useQueryClient();

  const { data: sportData = [], isLoading: isLoadingSport } = useSport();
  const { data: ruoliData = [], isLoading: isLoadingRuoli } = useRuoli();
  const { data: teamsData = [], isLoading: isLoadingTeams } = useTeams();
  const { data: livelliData = [], isLoading: isLoadingLivelli } =
    useLivelliSportivi();

  const { mutate: createTeam, isPending: isCreatingTeam } = useCreateTeam<
    Team,
    { previous: Team[] | undefined }
  >({
    onMutate: async payload => {
      if (!payload.nome) {
        throw new Error('Nome is required');
      }
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previous = queryClient.getQueryData<Team[]>(['teams']);

      const optimistic: Team[] = [
        ...(previous ?? []),
        {
          id: 'temp-' + Date.now(),
          nome: payload.nome,
          _optimistic: true,
        },
      ];

      queryClient.setQueryData(['teams'], optimistic);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['teams'], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onSuccess: (response: Team) => {
      if (response?.id) {
        setValue('team_id', String(response.id), {
          shouldValidate: true,
        });
      }
      setIsTeamModalOpen(false);
    },
  });

  const [
    selectedSportId,
    selectedTeamId,
    selectedRuoloSportId,
    selectedLivelloId,
  ] = useWatch({
    control,
    name: ['sport_id', 'team_id', 'ruolo_sport_id', 'livello_sportivo_id'],
  });

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const ruoliBySportId = useMemo(() => {
    const all: Ruoli_Sport[] = Array.isArray(ruoliData)
      ? ruoliData
      : (ruoliData as unknown as Ruoli_Sport[]);

    const map = new Map<
      string,
      Array<{ id: number; nome: string; descrizione?: string }>
    >();

    for (const r of all) {
      const sid = String(r.sport_id ?? r.sport?.id ?? '');
      if (!sid) continue;
      const arr = map.get(sid) ?? [];
      arr.push({
        id: Number(r.id),
        nome: r.nome,
        descrizione: r.descrizione,
      });
      map.set(sid, arr);
    }

    return map;
  }, [ruoliData]);

  const filteredRuoli = useMemo(() => {
    if (!selectedSportId) return [];
    return ruoliBySportId.get(String(selectedSportId)) ?? [];
  }, [ruoliBySportId, selectedSportId]);

  const handleSportChange = useCallback(
    (sportId: string) => {
      setValue('sport_id', sportId, { shouldValidate: true });
      setValue('ruolo_sport_id', '', { shouldValidate: true });
    },
    [setValue]
  );

  const handleSelectRuolo = useCallback(
    (value: string) =>
      setValue('ruolo_sport_id', value, { shouldValidate: true }),
    [setValue]
  );

  const handleSelectTeam = useCallback(
    (value: string) => setValue('team_id', value, { shouldValidate: true }),
    [setValue]
  );

  const handleSelectLivello = useCallback(
    (value: string) =>
      setValue('livello_sportivo_id', value, { shouldValidate: true }),
    [setValue]
  );

  const handleCreateTeam = useCallback(
    (name: string) => {
      if (!name.trim()) return;
      createTeam({ nome: name });
    },
    [createTeam]
  );

  return (
    <section
      className="
        space-y-6 p-4 sm:p-6
        rounded-lg border border-border/60 shadow-sm
        bg-gradient-to-br from-background to-muted/20
      "
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6">
        <SelectFieldWithSearch
          id="sport"
          options={sportData}
          selectedId={selectedSportId}
          onSelectChange={handleSportChange}
          label="Sport"
          placeholder="Seleziona uno sport…"
          searchPlaceholder="Cerca sport…"
          isLoading={isLoadingSport}
          loadingText="Caricamento sport…"
        />

        {selectedSportId ? (
          <SelectFieldWithDescription
            id="ruolo"
            options={filteredRuoli}
            selectedId={selectedRuoloSportId}
            onSelectChange={handleSelectRuolo}
            label="Ruolo sportivo"
            placeholder="Seleziona un ruolo…"
            searchPlaceholder="Cerca ruolo…"
            emptyText="Nessun ruolo disponibile per questo sport"
            disabled={
              !selectedSportId || isLoadingRuoli || filteredRuoli.length === 0
            }
            isLoading={isLoadingRuoli}
            loadingText="Caricamento ruoli…"
          />
        ) : (
          <div className="flex flex-col space-y-1 pb-2">
            <Label className="text-sm font-medium leading-none text-foreground pb-1">
              Ruolo sportivo
            </Label>
            <div className="px-3 py-2 text-sm text-muted-foreground border border-amber-200 dark:border-amber-800 rounded-md bg-amber-50/50 dark:bg-amber-950/20">
              Seleziona prima uno sport
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2 pb-2">
          <Label className="text-sm font-medium leading-none text-foreground">
            Squadra
          </Label>

          <SelectFieldWithSearch
            id="team"
            options={teamsData}
            selectedId={selectedTeamId}
            onSelectChange={handleSelectTeam}
            label=""
            placeholder="Seleziona una squadra…"
            searchPlaceholder="Cerca squadra…"
            isLoading={isLoadingTeams}
            loadingText="Caricamento squadre…"
          />

          <div className="flex items-center justify-between rounded-md border border-dashed border-border/60 bg-muted/30 px-3 py-2 mt-2">
            <span className="text-sm text-muted-foreground">
              Non trovi la tua squadra?
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTeamModalOpen(true)}
              className="h-7 text-xs font-medium border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 dark:text-blue-300 dark:border-blue-700 transition-all"
            >
              + Crea nuova
            </Button>
          </div>
        </div>

        <SelectFieldWithSearch
          id="livello-sportivo"
          options={livelliData}
          selectedId={selectedLivelloId}
          onSelectChange={handleSelectLivello}
          label="Livello sportivo"
          placeholder="Seleziona un livello…"
          searchPlaceholder="Cerca livello…"
          isLoading={isLoadingLivelli}
          loadingText="Caricamento livelli…"
        />
      </div>

      <div className="md:flex md:justify-end mt-4">
        <div className="md:static fixed bottom-4 left-4 right-4 z-30 md:z-auto">
          <AnimatedButton />
        </div>
      </div>

      <CustomDialog
        open={isTeamModalOpen}
        mode="create"
        title="Crea nuova squadra"
        isTeamDialog
        isCreating={isCreatingTeam}
        onSave={() => handleCreateTeam}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </section>
  );
};

export default memo(Sport);
