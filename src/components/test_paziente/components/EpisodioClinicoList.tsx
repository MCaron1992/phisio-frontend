import React, { memo } from 'react';
import { EpisodioClinico } from '../types/episodio.types';
import EpisodioClinicoCard from './EpisodioClinicoCard';

interface EpisodioClinicoListProps {
  episodi: EpisodioClinico[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const EpisodioClinicoList = memo(
  ({ episodi, onSelect, onDelete }: EpisodioClinicoListProps) => {
    if (episodi.length === 0) return null;

    return (
      <div className="bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 dark:bg-green-500 text-white font-bold text-sm shadow-md">
              2
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Episodi Clinici ({episodi.length})
            </h3>
          </div>
        </div>

        <div className="space-y-2">
          {episodi.map((episodio, index) => (
            <EpisodioClinicoCard
              key={episodio.id}
              episodio={episodio}
              index={index}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    );
  }
);

EpisodioClinicoList.displayName = 'EpisodioClinicoList';

export default EpisodioClinicoList;

