import React, { memo, useMemo } from 'react';
import { FileText, Calendar, ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EpisodioClinicoFormData } from '../types/episodio.types';
import { getEntityNameById, formatDate } from '../utils/episodio.utils';

interface RiepilogoSidebarProps {
  statoSaluteId: number | null;
  statiSaluteData: any;
  episodiClinicoCount: number;
  currentEpisodioClinico: EpisodioClinicoFormData | null;
  isFullHealth: boolean;
  isFormVisible: boolean;
  onNewEpisodioClinico: () => void;
}

const RiepilogoSidebar = memo(
  ({
    statoSaluteId,
    statiSaluteData,
    episodiClinicoCount,
    currentEpisodioClinico,
    isFullHealth,
    isFormVisible,
    onNewEpisodioClinico,
  }: RiepilogoSidebarProps) => {
    const statoSaluteNome = useMemo(
      () => getEntityNameById(statoSaluteId, statiSaluteData?.data),
      [statoSaluteId, statiSaluteData?.data]
    );

    const dataFormattata = useMemo(
      () =>
        currentEpisodioClinico?.dataEpisodio
          ? formatDate(currentEpisodioClinico.dataEpisodio)
          : '—',
      [currentEpisodioClinico?.dataEpisodio]
    );

    return (
      <div className="lg:sticky lg:top-6 bg-gradient-to-br from-muted/40 to-muted/20 rounded-lg p-4 border border-border/60 shadow-sm max-h-[calc(100vh-8rem)] lg:max-h-none flex flex-col backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Riepilogo
        </h3>

        {/* Stato di Salute */}
        <div className="pb-4 border-b border-border mb-4">
          <div className="text-xs mb-2">
            <span className="text-muted-foreground block mb-1">
              Stato di Salute
            </span>
            <span className="text-foreground font-medium">{statoSaluteNome}</span>
          </div>
        </div>

        {/* Contatore Episodi Clinici */}
        {!isFullHealth && statoSaluteId && (
          <div className="pb-4 border-b border-border mb-4">
            <div className="text-xs">
              <span className="text-muted-foreground block mb-1">
                Episodi Clinici
              </span>
              <span className="text-foreground font-medium text-lg">
                {episodiClinicoCount}
              </span>
              <span className="text-muted-foreground text-xs ml-2">
                {episodiClinicoCount === 1 ? 'episodio' : 'episodi'}
              </span>
            </div>
          </div>
        )}

        {/* Dettagli Episodio Clinico Corrente */}
        {!isFullHealth &&
          statoSaluteId &&
          isFormVisible &&
          currentEpisodioClinico?.dataEpisodio && (
            <div className="pb-4 border-b border-border mb-4 space-y-3">
              <div className="text-xs">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Data Episodio</span>
                </div>
                <span className="text-foreground font-medium">
                  {dataFormattata}
                </span>
              </div>
              {currentEpisodioClinico.notaEpisodio && (
                <div className="text-xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ClipboardList className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Nota</span>
                  </div>
                  <span className="text-foreground text-xs leading-relaxed line-clamp-3">
                    {currentEpisodioClinico.notaEpisodio}
                  </span>
                </div>
              )}
              <div className="text-xs">
                <span className="text-muted-foreground block mb-1">
                  Episodi Struttura
                </span>
                <span className="text-foreground font-medium text-lg">
                  {currentEpisodioClinico.episodiStruttura.length}
                </span>
                <span className="text-muted-foreground text-xs ml-2">
                  {currentEpisodioClinico.episodiStruttura.length === 1
                    ? 'episodio'
                    : 'episodi'}
                </span>
              </div>
            </div>
          )}

        {/* Bottone Nuovo Episodio Clinico */}
        {!isFullHealth && statoSaluteId && !isFormVisible && (
          <Button
            type="button"
            onClick={onNewEpisodioClinico}
            className="w-full gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nuovo Episodio Clinico
          </Button>
        )}
      </div>
    );
  }
);

RiepilogoSidebar.displayName = 'RiepilogoSidebar';

export default RiepilogoSidebar;

