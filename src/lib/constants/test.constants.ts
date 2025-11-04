/**
 * Costanti per la gestione dei test
 */

import { TestItem } from '@/types/test';

/**
 * Valori di test mockati per sviluppo/testing
 * TODO: Rimuovere quando si integra con il backend
 */
export const MOCK_TESTS: TestItem[] = [
  {
    id: 'test-1',
    categoria_funzionale_id: '1',
    test_id: '1',
    metrica_id: '1',
    unita_misura_id: '1',
    strumento_id: '1',
    fase_temporale_id: '1',
    valore_test_1: '45.5',
    valore_test_2: '32.2',
    valore_test_3: '28.8',
  },
  {
    id: 'test-2',
    categoria_funzionale_id: '2',
    test_id: '2',
    metrica_id: '2',
    unita_misura_id: '2',
    strumento_id: '2',
    fase_temporale_id: '2',
    valore_test_1: '120',
    valore_test_2: '95',
    valore_test_3: '',
  },
  {
    id: 'test-3',
    categoria_funzionale_id: '1',
    test_id: '1',
    metrica_id: '3',
    unita_misura_id: '1',
    strumento_id: '1',
    fase_temporale_id: '1',
    valore_test_1: '38.9',
    valore_test_2: '',
    valore_test_3: '',
  },
];

/**
 * Configurazione per la navigazione da tastiera
 */
export const KEYBOARD_SHORTCUTS = {
  PREVIOUS_TEST: ['ArrowLeft'],
  NEXT_TEST: ['ArrowRight'],
  MODIFIER_KEY: ['ctrlKey', 'metaKey'],
} as const;

/**
 * Configurazione per i badge dei valori test
 */
export const VALUE_BADGE_COLORS = {
  VALUE_1: {
    light: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  VALUE_2: {
    light: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
  },
  VALUE_3: {
    light: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
  },
} as const;


