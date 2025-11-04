/**
 * Tipi e interfacce per la gestione dei test del paziente
 */

export interface TestItem {
  id: string;
  categoria_funzionale_id: string;
  test_id: string;
  metrica_id: string;
  unita_misura_id: string;
  strumento_id: string;
  fase_temporale_id: string;
  valore_test_1: string;
  valore_test_2: string;
  valore_test_3: string;
}

export interface TestFormData {
  categoria_funzionale_id: string;
  test_id: string;
  metrica_id: string;
  unita_misura_id: string;
  strumento_id: string;
  fase_temporale_id: string;
  valore_test_1: string;
  valore_test_2: string;
  valore_test_3: string;
}

export interface EntityWithId {
  id: number | string;
  nome: string;
}

export interface EntityWithDescription extends EntityWithId {
  descrizione?: string;
}

// Re-export per compatibilità
export type { TestItem as TestItemType };

