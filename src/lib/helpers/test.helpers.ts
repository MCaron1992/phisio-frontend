/**
 * Helper functions per la gestione dei test
 */

import { TestItem, EntityWithId } from '@/types/test';
import { Test as TestType } from '@/hooks/useCrud';

/**
 * Ottiene il nome completo di un test
 */
export const getTestName = (test: TestType): string => {
  return test.nome_esteso || test.nome_abbreviato || '';
};

/**
 * Ottiene la descrizione di un test
 */
export const getTestDescription = (
  test: TestType
): string | undefined => {
  return test.istruzioni_verbali || test.lateralita || undefined;
};

/**
 * Filtra i test per categoria funzionale
 */
export const filterTestsByCategory = (
  tests: TestType[] | undefined,
  categoriaId: string
): TestType[] => {
  if (!categoriaId || !tests) return [];
  return tests.filter(
    (test) => test.id_categoria_funzionale === Number(categoriaId)
  );
};

/**
 * Ottiene il nome di un'entità dal suo ID
 */
export const getEntityNameById = (
  id: string,
  data: EntityWithId[] | undefined
): string => {
  if (!id || !data) return '—';
  const item = data.find((item) => String(item.id) === id);
  return item?.nome || '—';
};

/**
 * Crea un nuovo test item vuoto
 */
export const createEmptyTestItem = (): Partial<TestItem> => ({
  categoria_funzionale_id: '',
  test_id: '',
  metrica_id: '',
  unita_misura_id: '',
  strumento_id: '',
  fase_temporale_id: '',
  valore_test_1: '',
  valore_test_2: '',
  valore_test_3: '',
});

/**
 * Genera un ID univoco per un nuovo test
 */
export const generateTestId = (): string => {
  return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};


