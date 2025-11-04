/**
 * Tipi e interfacce per la gestione dei giocatori
 */

import { TestItem } from '@/types/test';

export interface PlayerFormData {
  nome: string;
  cognome: string;
  sesso: string;
  data_nascita: string;
  etnia: string;
  id_studio: string;
  sport_id?: string;
  ruolo_sport_id?: string;
  team_id?: string;
  livello_sportivo_id?: string;
  tests?: TestItem[];
}

export type StepStatus = 'completed' | 'current' | 'upcoming';

