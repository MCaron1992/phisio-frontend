export interface Lato {
  id: 'dx' | 'sx';
  nome: string;
  icona: string;
}

export interface EpisodioStruttura {
  id: string;
  regioneId: number | null;
  latoCoinvolto: 'dx' | 'sx' | null;
  strutturaPrincipaleId: number | null;
  strutturaSpecificaId: number | null;
  meccanismoId: number | null;
  approccioId: number | null;
}

export interface EpisodioStrutturaFormData {
  regioneId: number | null;
  latoCoinvolto: 'dx' | 'sx' | null;
  strutturaPrincipaleId: number | null;
  strutturaSpecificaId: number | null;
  meccanismoId: number | null;
  approccioId: number | null;
}

export interface EpisodioClinico {
  id: string;
  dataEpisodio: string;
  notaEpisodio: string;
  episodiStruttura: EpisodioStruttura[];
}

export interface EpisodioClinicoFormData {
  dataEpisodio: string;
  notaEpisodio: string;
  episodiStruttura: EpisodioStruttura[];
}

