import {
  EpisodioStrutturaFormData,
  EpisodioClinicoFormData,
} from '../types/episodio.types';

export const generateEpisodioStrutturaId = (): string => {
  return `ep-str-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateEpisodioClinicoId = (): string => {
  return `ep-cli-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createEmptyEpisodioStruttura = (): EpisodioStrutturaFormData => ({
  regioneId: null,
  latoCoinvolto: null,
  strutturaPrincipaleId: null,
  strutturaSpecificaId: null,
  meccanismoId: null,
  approccioId: null,
});

export const createEmptyEpisodioClinico = (): EpisodioClinicoFormData => ({
  dataEpisodio: '',
  notaEpisodio: '',
  episodiStruttura: [],
});

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const getEntityNameById = (
  id: number | null,
  data?: any[]
): string => {
  if (!id || !data) return '—';
  const item = data.find((d: any) => d.id === id);
  return item?.nome || '—';
};

