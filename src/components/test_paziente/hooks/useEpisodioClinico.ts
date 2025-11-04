import { useState, useCallback } from 'react';
import {
  EpisodioClinico,
  EpisodioClinicoFormData,
} from '../types/episodio.types';
import {
  createEmptyEpisodioClinico,
  generateEpisodioClinicoId,
} from '../utils/episodio.utils';

export const useEpisodioClinico = () => {
  const [episodiClinici, setEpisodiClinici] = useState<EpisodioClinico[]>([]);
  const [currentEpisodioClinico, setCurrentEpisodioClinicoState] =
    useState<EpisodioClinicoFormData>(createEmptyEpisodioClinico());
  const [selectedEpisodioClinicoId, setSelectedEpisodioClinicoId] = useState<
    string | null
  >(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Wrap setter in useCallback for stability
  const setCurrentEpisodioClinico = useCallback(
    (value: EpisodioClinicoFormData | ((prev: EpisodioClinicoFormData) => EpisodioClinicoFormData)) => {
      setCurrentEpisodioClinicoState(value);
    },
    []
  );

  const handleNew = useCallback(() => {
    setCurrentEpisodioClinico(createEmptyEpisodioClinico());
    setSelectedEpisodioClinicoId(null);
    setIsFormVisible(true);
  }, []);

  const handleSelect = useCallback(
    (episodioId: string) => {
      const episodio = episodiClinici.find(e => e.id === episodioId);
      if (episodio) {
        setSelectedEpisodioClinicoId(episodioId);
        setCurrentEpisodioClinico({
          dataEpisodio: episodio.dataEpisodio,
          notaEpisodio: episodio.notaEpisodio,
          episodiStruttura: episodio.episodiStruttura,
        });
        setIsFormVisible(true);
        setTimeout(() => {
          const element = document.getElementById('form-episodio-clinico');
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    },
    [episodiClinici]
  );

  const handleSave = useCallback(() => {
    if (!currentEpisodioClinico.dataEpisodio) return false;
    if (currentEpisodioClinico.episodiStruttura.length === 0) return false;

    const episodioToSave: EpisodioClinico = {
      id: selectedEpisodioClinicoId || generateEpisodioClinicoId(),
      dataEpisodio: currentEpisodioClinico.dataEpisodio,
      notaEpisodio: currentEpisodioClinico.notaEpisodio,
      episodiStruttura: currentEpisodioClinico.episodiStruttura,
    };

    if (selectedEpisodioClinicoId) {
      setEpisodiClinici(prev =>
        prev.map(e => (e.id === selectedEpisodioClinicoId ? episodioToSave : e))
      );
    } else {
      setEpisodiClinici(prev => [...prev, episodioToSave]);
    }

    setCurrentEpisodioClinico(createEmptyEpisodioClinico());
    setSelectedEpisodioClinicoId(null);
    setIsFormVisible(false);
    return true;
  }, [currentEpisodioClinico, selectedEpisodioClinicoId]);

  const handleCancel = useCallback(() => {
    setCurrentEpisodioClinico(createEmptyEpisodioClinico());
    setSelectedEpisodioClinicoId(null);
    setIsFormVisible(false);
  }, []);

  const handleDelete = useCallback(
    (episodioId: string) => {
      setEpisodiClinici(prev => prev.filter(e => e.id !== episodioId));
      if (selectedEpisodioClinicoId === episodioId) {
        handleCancel();
      }
    },
    [selectedEpisodioClinicoId, handleCancel]
  );

  const handleReset = useCallback(() => {
    setEpisodiClinici([]);
    setCurrentEpisodioClinico(createEmptyEpisodioClinico());
    setSelectedEpisodioClinicoId(null);
    setIsFormVisible(false);
  }, []);

  const isValid = useCallback((): boolean => {
    return (
      currentEpisodioClinico.dataEpisodio !== '' &&
      currentEpisodioClinico.episodiStruttura.length > 0
    );
  }, [currentEpisodioClinico]);

  return {
    episodiClinici,
    currentEpisodioClinico,
    selectedEpisodioClinicoId,
    isFormVisible,
    setCurrentEpisodioClinico,
    handleNew,
    handleSelect,
    handleSave,
    handleCancel,
    handleDelete,
    handleReset,
    isValid,
  };
};

