import React, { memo, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { EpisodioStruttura } from '../types/episodio.types';
import { LATI } from '../constants/episodio.constants';

interface EpisodioStrutturaCardProps {
  episodio: EpisodioStruttura;
  index: number;
  regioniData: any;
  strutturePrincipaliData: any;
  struttureSpecificheData: any;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const EpisodioStrutturaCard = memo(
  ({
    episodio,
    index,
    regioniData,
    strutturePrincipaliData,
    struttureSpecificheData,
    onSelect,
    onDelete,
  }: EpisodioStrutturaCardProps) => {
    const regioneInfo = useMemo(
      () => regioniData?.data?.find((r: any) => r.id === episodio.regioneId),
      [regioniData?.data, episodio.regioneId]
    );

    const strutturaPrincipaleInfo = useMemo(
      () =>
        strutturePrincipaliData?.data?.find(
          (s: any) => s.id === episodio.strutturaPrincipaleId
        ),
      [strutturePrincipaliData?.data, episodio.strutturaPrincipaleId]
    );

    const strutturaSpecificaInfo = useMemo(
      () =>
        struttureSpecificheData?.data?.find(
          (s: any) => s.id === episodio.strutturaSpecificaId
        ),
      [struttureSpecificheData?.data, episodio.strutturaSpecificaId]
    );

    return (
      <div className="group relative bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800 rounded-lg p-3 hover:shadow-md transition-all">
        <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-green-600 dark:bg-green-500 text-white text-xs font-bold shadow-sm">
          {index + 1}
        </div>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onDelete(episodio.id);
          }}
          className="absolute top-2 left-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30 z-10"
          title="Elimina episodio"
        >
          <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
        </button>

        <div
          className="pr-8 pl-8 cursor-pointer"
          onClick={() => onSelect(episodio.id)}
        >
          <div className="font-semibold text-sm text-foreground mb-1">
            {regioneInfo?.nome || 'Regione non specificata'}
            {episodio.latoCoinvolto && (
              <span className="ml-2 text-xs font-normal text-green-600 dark:text-green-400">
                {LATI.find(l => l.id === episodio.latoCoinvolto)?.icona}{' '}
                {LATI.find(l => l.id === episodio.latoCoinvolto)?.nome}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {strutturaPrincipaleInfo?.nome}
            {strutturaSpecificaInfo && (
              <span> • {strutturaSpecificaInfo.nome}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

EpisodioStrutturaCard.displayName = 'EpisodioStrutturaCard';

export default EpisodioStrutturaCard;

