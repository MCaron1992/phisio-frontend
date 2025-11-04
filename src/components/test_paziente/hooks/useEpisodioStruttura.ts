import { useState, useCallback, useMemo } from 'react';
import {
  EpisodioStruttura,
  EpisodioStrutturaFormData,
} from '../types/episodio.types';
import {
  createEmptyEpisodioStruttura,
  generateEpisodioStrutturaId,
} from '../utils/episodio.utils';
import { REGIONI_RICHIEDONO_LATO } from '../constants/episodio.constants';

interface UseEpisodioStrutturaProps {
  regioniData: any;
  struttureSpecificheData: any;
}

export const useEpisodioStruttura = ({
  regioniData,
  struttureSpecificheData,
}: UseEpisodioStrutturaProps) => {
  const [currentEpisodio, setCurrentEpisodio] =
    useState<EpisodioStrutturaFormData>(createEmptyEpisodioStruttura());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const regioneSelezionata = useMemo(
    () =>
      regioniData?.data?.find((r: any) => r.id === currentEpisodio.regioneId),
    [regioniData?.data, currentEpisodio.regioneId]
  );

  const richiedeLato = useMemo(
    () =>
      regioneSelezionata
        ? REGIONI_RICHIEDONO_LATO.includes(currentEpisodio.regioneId || 0)
        : false,
    [regioneSelezionata, currentEpisodio.regioneId]
  );

  const struttureSpecificheDisponibili = useMemo(() => {
    if (!currentEpisodio.regioneId || !currentEpisodio.strutturaPrincipaleId)
      return [];
    return (
      struttureSpecificheData?.data?.filter(
        (s: any) =>
          s.id_regione_anatomica === currentEpisodio.regioneId &&
          s.id_struttura_principale === currentEpisodio.strutturaPrincipaleId
      ) || []
    );
  }, [
    currentEpisodio.regioneId,
    currentEpisodio.strutturaPrincipaleId,
    struttureSpecificheData?.data,
  ]);

  const isValid = useCallback((): boolean => {
    const baseValid =
      currentEpisodio.regioneId &&
      currentEpisodio.strutturaPrincipaleId &&
      currentEpisodio.strutturaSpecificaId &&
      currentEpisodio.meccanismoId &&
      currentEpisodio.approccioId;

    if (richiedeLato) {
      return Boolean(baseValid && currentEpisodio.latoCoinvolto !== null);
    }

    return Boolean(baseValid);
  }, [currentEpisodio, richiedeLato]);

  const handleNew = useCallback(() => {
    setCurrentEpisodio(createEmptyEpisodioStruttura());
    setSelectedId(null);
    setIsFormVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setCurrentEpisodio(createEmptyEpisodioStruttura());
    setSelectedId(null);
    setIsFormVisible(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentEpisodio(createEmptyEpisodioStruttura());
    setSelectedId(null);
    setIsFormVisible(false);
  }, []);

  return {
    currentEpisodio,
    setCurrentEpisodio,
    selectedId,
    setSelectedId,
    isFormVisible,
    setIsFormVisible,
    richiedeLato,
    struttureSpecificheDisponibili,
    isValid,
    handleNew,
    handleCancel,
    reset,
  };
};

