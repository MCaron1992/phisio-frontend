import React, { memo } from 'react';
import { EpisodioStruttura } from '../types/episodio.types';
import EpisodioStrutturaCard from './EpisodioStrutturaCard';

interface EpisodioStrutturaListProps {
  episodi: EpisodioStruttura[];
  regioniData: any;
  strutturePrincipaliData: any;
  struttureSpecificheData: any;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const EpisodioStrutturaList = memo(
  ({
    episodi,
    regioniData,
    strutturePrincipaliData,
    struttureSpecificheData,
    onSelect,
    onDelete,
  }: EpisodioStrutturaListProps) => {
    if (episodi.length === 0) return null;

    return (
      <div className="space-y-2 mb-4">
        {episodi.map((episodio, index) => (
          <EpisodioStrutturaCard
            key={episodio.id}
            episodio={episodio}
            index={index}
            regioniData={regioniData}
            strutturePrincipaliData={strutturePrincipaliData}
            struttureSpecificheData={struttureSpecificheData}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }
);

EpisodioStrutturaList.displayName = 'EpisodioStrutturaList';

export default EpisodioStrutturaList;

