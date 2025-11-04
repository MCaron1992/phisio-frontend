import React, { memo } from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import { EpisodioClinico } from '../types/episodio.types';
import { formatDate } from '../utils/episodio.utils';

interface EpisodioClinicoCardProps {
  episodio: EpisodioClinico;
  index: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const EpisodioClinicoCard = memo(
  ({ episodio, index, onSelect, onDelete }: EpisodioClinicoCardProps) => {
    return (
      <div
        className="group relative bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
        onClick={() => onSelect(episodio.id)}
      >
        {/* Badge numero */}
        <div className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full bg-green-600 dark:bg-green-500 text-white text-xs font-bold shadow-sm">
          {index + 1}
        </div>

        {/* Pulsante elimina */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onDelete(episodio.id);
          }}
          className="absolute top-3 left-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30 z-10"
          title="Elimina episodio clinico"
        >
          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
        </button>

        {/* Contenuto */}
        <div className="pr-10 pl-10">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-sm text-foreground">
              {formatDate(episodio.dataEpisodio)}
            </span>
          </div>
          {episodio.notaEpisodio && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {episodio.notaEpisodio}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
              {episodio.episodiStruttura.length}{' '}
              {episodio.episodiStruttura.length === 1 ? 'episodio' : 'episodi'}{' '}
              struttura
            </span>
          </div>
        </div>
      </div>
    );
  }
);

EpisodioClinicoCard.displayName = 'EpisodioClinicoCard';

export default EpisodioClinicoCard;

