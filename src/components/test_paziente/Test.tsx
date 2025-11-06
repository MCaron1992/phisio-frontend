'use client';

import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import {
  useCategorieFunzionali,
  useTests,
  useMetriche,
  useUnitaMisura,
  useStrumenti,
  useFasiTemporali,
  Test as TestType,
  CategoriaFunzionale,
} from '@/hooks/useCrud';
import SelectFieldWithSearch from '@/components/custom/SelectFieldWithSearch';
import SelectFieldWithDescription from '@/components/custom/SelectFieldWithDescription';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  FileText,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
} from 'lucide-react';
import { TestItem, TestFormData } from '@/types/test';
import {
  getTestName,
  getTestDescription,
  filterTestsByCategory,
  getEntityNameById,
  createEmptyTestItem,
} from '@/lib/helpers/test.helpers';
import {
  MOCK_TESTS,
  KEYBOARD_SHORTCUTS,
  VALUE_BADGE_COLORS,
} from '@/lib/constants/test.constants';

const Test = () => {
  const form = useFormContext();

  const { data: categorieData } = useCategorieFunzionali();
  const { data: testsData } = useTests();
  const { data: metricheData } = useMetriche();
  const { data: unitaData } = useUnitaMisura();
  const { data: strumentiData } = useStrumenti();
  const { data: fasiTemporaliData } = useFasiTemporali();

  const formTests = form.watch('tests') || [];
  const [tests, setTests] = useState<TestItem[]>(
    formTests.length > 0 ? formTests : MOCK_TESTS
  );
  const [currentTest, setCurrentTest] = useState<Partial<TestFormData>>(
    createEmptyTestItem()
  );
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  useEffect(() => {
    if (formTests.length > 0 && tests.length === MOCK_TESTS.length) {
      setTests(formTests);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoriaChange = useCallback((categoriaId: string) => {
    setCurrentTest(prev => ({
      ...prev,
      categoria_funzionale_id: categoriaId,
      test_id: '',
    }));
  }, []);

  const handleSelectTest = useCallback(
    (testId: string) => {
      setSelectedTestId(testId);
      const test = tests.find(t => t.id === testId);
      if (test) {
        setCurrentTest(test);
        setTimeout(() => {
          const element = document.getElementById(`test-${testId}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    },
    [tests]
  );

  const currentIndex = selectedTestId
    ? tests.findIndex(t => t.id === selectedTestId)
    : -1;

  const handlePreviousTest = useCallback(() => {
    if (currentIndex > 0) {
      const prevTestId = tests[currentIndex - 1].id;
      handleSelectTest(prevTestId);
    }
  }, [currentIndex, tests, handleSelectTest]);

  const handleNextTest = useCallback(() => {
    if (currentIndex < tests.length - 1) {
      const nextTestId = tests[currentIndex + 1].id;
      handleSelectTest(nextTestId);
    }
  }, [currentIndex, tests, handleSelectTest]);

  useEffect(() => {
    if (tests.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifierPressed = e.ctrlKey || e.metaKey;
      if (!isModifierPressed) return;

      if (e.key === KEYBOARD_SHORTCUTS.PREVIOUS_TEST[0]) {
        e.preventDefault();
        handlePreviousTest();
      } else if (e.key === KEYBOARD_SHORTCUTS.NEXT_TEST[0]) {
        e.preventDefault();
        handleNextTest();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tests.length, handlePreviousTest, handleNextTest]);

  const handleNewTest = useCallback(() => {
    setCurrentTest(createEmptyTestItem());
    setSelectedTestId(null);
  }, []);

  const filteredTests = filterTestsByCategory(
    testsData,
    currentTest.categoria_funzionale_id || ''
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      <div className="lg:col-span-2 space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {selectedTestId ? 'Modifica Test' : 'Nuovo Test'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {selectedTestId
                ? 'Modifica i dati del test selezionato'
                : 'Compila tutti i campi per registrare un nuovo test'}
            </p>
          </div>

          {tests.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {selectedTestId && currentIndex !== -1 && (
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md text-sm">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Test {currentIndex + 1} di {tests.length}
                  </span>
                </div>
              )}

              {selectedTestId && (
                <div className="flex items-center gap-1 border border-primary/20 bg-primary/5 rounded-md">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handlePreviousTest}
                    disabled={currentIndex === 0}
                    className="h-10 sm:h-8 w-12 sm:w-8 p-0 touch-manipulation hover:bg-primary/10 disabled:opacity-40"
                    title="Test precedente (Ctrl + ←)"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4 text-primary" />
                  </Button>
                  <div className="h-8 sm:h-6 w-px bg-border" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleNextTest}
                    disabled={currentIndex === tests.length - 1}
                    className="h-10 sm:h-8 w-12 sm:w-8 p-0 touch-manipulation hover:bg-primary/10 disabled:opacity-40"
                    title="Test successivo (Ctrl + →)"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4 text-primary" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {tests.length > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-2 py-2 overflow-x-auto pb-3">
            {tests.map((test, index) => (
              <button
                key={test.id}
                type="button"
                onClick={() => handleSelectTest(test.id)}
                className={cn(
                  'transition-all touch-manipulation p-1.5 sm:p-1',
                  selectedTestId === test.id
                    ? 'text-blue-600 dark:text-blue-400 scale-125'
                    : 'text-muted-foreground hover:text-blue-500 dark:hover:text-blue-400 active:scale-110'
                )}
                title={`Vai al test ${index + 1}`}
              >
                <Circle
                  className={cn(
                    'h-3 w-3 sm:h-2 sm:w-2',
                    selectedTestId === test.id ? 'fill-current' : ''
                  )}
                />
              </button>
            ))}
          </div>
        )}

        <div className="space-y-6">
          <SelectFieldWithDescription
            id="categoria-funzionale"
            options={categorieData}
            selectedId={currentTest.categoria_funzionale_id || ''}
            onSelectChange={handleCategoriaChange}
            label="Categoria Funzionale *"
            placeholder="Seleziona una categoria funzionale..."
            searchPlaceholder="Cerca categoria..."
          />

          {currentTest.categoria_funzionale_id ? (
            filteredTests.length > 0 ? (
              <SelectFieldWithDescription
                id="test"
                options={filteredTests.map((test: TestType) => ({
                  id: test.id,
                  nome: getTestName(test),
                  descrizione: getTestDescription(test),
                }))}
                selectedId={currentTest.test_id || ''}
                onSelectChange={(value: string) => {
                  setCurrentTest(prev => ({
                    ...prev,
                    test_id: value,
                  }));
                }}
                label="Test *"
                placeholder="Seleziona un test..."
                searchPlaceholder="Cerca test..."
              />
            ) : (
              <div className="flex flex-col space-y-1 pb-2">
                <Label className="text-sm font-medium leading-none text-foreground pb-1">
                  Test *
                </Label>
                <div className="px-3 py-2 text-sm text-muted-foreground border rounded-md bg-muted/50">
                  Nessun test disponibile per questa categoria
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col space-y-1 pb-2">
              <Label className="text-sm font-medium leading-none text-foreground pb-1">
                Test *
              </Label>
              <div className="px-3 py-2 text-sm text-muted-foreground border rounded-md bg-muted/50">
                Seleziona prima una categoria funzionale
              </div>
            </div>
          )}

          <SelectFieldWithDescription
            id="metrica"
            options={metricheData}
            selectedId={currentTest.metrica_id || ''}
            onSelectChange={(value: string) => {
              setCurrentTest(prev => ({
                ...prev,
                metrica_id: value,
              }));
            }}
            label="Metrica *"
            placeholder="Seleziona una metrica..."
            searchPlaceholder="Cerca metrica..."
          />

          <SelectFieldWithDescription
            id="unita-misura"
            options={unitaData}
            selectedId={currentTest.unita_misura_id || ''}
            onSelectChange={(value: string) => {
              setCurrentTest(prev => ({
                ...prev,
                unita_misura_id: value,
              }));
            }}
            label="Unità di Misura *"
            placeholder="Seleziona un'unità di misura..."
            searchPlaceholder="Cerca unità..."
          />

          <SelectFieldWithSearch
            id="strumento"
            options={strumentiData}
            selectedId={currentTest.strumento_id || ''}
            onSelectChange={(value: string) => {
              setCurrentTest(prev => ({
                ...prev,
                strumento_id: value,
              }));
            }}
            label="Strumento *"
            placeholder="Seleziona uno strumento..."
            searchPlaceholder="Cerca strumento..."
          />

          {/*        <SelectFieldWithSearch
            id="fase-temporale"
            options={fasiTemporaliData}
            selectedId={currentTest.fase_temporale_id || ''}
            onSelectChange={(value: string) => {
              setCurrentTest(prev => ({
                ...prev,
                fase_temporale_id: value,
              }));
            }}
            label="Fase Temporale *"
            placeholder="Seleziona una fase temporale..."
            searchPlaceholder="Cerca fase temporale..."
          />*/}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="valore-test-1" className="text-sm font-medium">
                Valore Test 1
              </Label>
              <Input
                id="valore-test-1"
                type="number"
                step="any"
                value={currentTest.valore_test_1 || ''}
                onChange={e =>
                  setCurrentTest(prev => ({
                    ...prev,
                    valore_test_1: e.target.value,
                  }))
                }
                placeholder="Inserisci valore"
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="valore-test-2" className="text-sm font-medium">
                Valore Test 2
              </Label>
              <Input
                id="valore-test-2"
                type="number"
                step="any"
                value={currentTest.valore_test_2 || ''}
                onChange={e =>
                  setCurrentTest(prev => ({
                    ...prev,
                    valore_test_2: e.target.value,
                  }))
                }
                placeholder="Inserisci valore"
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="valore-test-3" className="text-sm font-medium">
                Valore Test 3
              </Label>
              <Input
                id="valore-test-3"
                type="number"
                step="any"
                value={currentTest.valore_test_3 || ''}
                onChange={e =>
                  setCurrentTest(prev => ({
                    ...prev,
                    valore_test_3: e.target.value,
                  }))
                }
                placeholder="Inserisci valore"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleNewTest}
              className="w-full sm:w-auto touch-manipulation hover:bg-muted/50"
            >
              Reset
            </Button>
            <Button
              type="button"
              className="gap-2 w-full sm:w-auto touch-manipulation bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
              disabled={!currentTest.test_id}
            >
              <Check className="h-4 w-4" />
              Salva Test
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 order-first lg:order-last">
        <div className="lg:sticky lg:top-6 bg-gradient-to-br from-muted/40 to-muted/20 rounded-lg p-4 border border-border/60 shadow-sm max-h-[calc(100vh-8rem)] lg:max-h-none flex flex-col backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Riepilogo
          </h3>

          <div className="space-y-3 mb-4 overflow-y-auto flex-1 min-h-0 lg:overflow-visible lg:flex-none">
            {tests.map((test, index) => {
              const testInfo = testsData?.find(
                (t: TestType) => String(t.id) === test.test_id
              );
              const categoriaInfo = categorieData?.find(
                (c: CategoriaFunzionale) =>
                  String(c.id) === test.categoria_funzionale_id
              );

              return (
                <div
                  key={test.id}
                  id={`test-${test.id}`}
                  onClick={() => handleSelectTest(test.id)}
                  className={cn(
                    'p-3 sm:p-3 rounded-lg border cursor-pointer transition-all hover:shadow-lg active:scale-[0.98] relative touch-manipulation',
                    selectedTestId === test.id
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50/80 dark:bg-blue-950/30 ring-2 ring-blue-500/30 dark:ring-blue-400/30 shadow-md'
                      : 'border-border bg-background hover:border-blue-300 dark:hover:border-blue-600 active:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-2 right-2 flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 rounded-full text-xs font-medium transition-all',
                      selectedTestId === test.id
                        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                        : 'bg-muted text-muted-foreground group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50'
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="font-medium text-sm">
                    {testInfo ? getTestName(testInfo) : 'Test senza nome'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {categoriaInfo?.nome || 'Categoria'}
                  </div>
                  {(test.valore_test_1 ||
                    test.valore_test_2 ||
                    test.valore_test_3) && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {test.valore_test_1 && (
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-md text-xs font-medium shadow-sm',
                            VALUE_BADGE_COLORS.VALUE_1.light,
                            VALUE_BADGE_COLORS.VALUE_1.text
                          )}
                        >
                          {test.valore_test_1}
                        </span>
                      )}
                      {test.valore_test_2 && (
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-md text-xs font-medium shadow-sm',
                            VALUE_BADGE_COLORS.VALUE_2.light,
                            VALUE_BADGE_COLORS.VALUE_2.text
                          )}
                        >
                          {test.valore_test_2}
                        </span>
                      )}
                      {test.valore_test_3 && (
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-md text-xs font-medium shadow-sm',
                            VALUE_BADGE_COLORS.VALUE_3.light,
                            VALUE_BADGE_COLORS.VALUE_3.text
                          )}
                        >
                          {test.valore_test_3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {tests.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">
                Nessun test salvato
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleNewTest}
            className="w-full gap-2 touch-manipulation mt-auto lg:mt-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
          >
            <Plus className="h-4 w-4" />
            Nuovo Test
          </Button>

          <div className="hidden lg:block mt-6 pt-6 border-t space-y-3 text-xs">
            <div className="pb-2 border-b border-border">
              <span className="text-muted-foreground block mb-1">
                Categoria
              </span>
              <span className="text-foreground font-medium">
                {getEntityNameById(
                  currentTest.categoria_funzionale_id || '',
                  categorieData?.data
                )}
              </span>
            </div>
            <div className="pb-2 border-b border-border">
              <span className="text-muted-foreground block mb-1">Test</span>
              <span className="text-foreground font-medium">
                {currentTest.test_id
                  ? getEntityNameById(currentTest.test_id, testsData?.data)
                  : '—'}
              </span>
            </div>
            <div className="pb-2 border-b border-border">
              <span className="text-muted-foreground block mb-1">Metrica</span>
              <span className="text-foreground font-medium">
                {getEntityNameById(
                  currentTest.metrica_id || '',
                  metricheData?.data
                )}
              </span>
            </div>
            <div className="pb-2 border-b border-border">
              <span className="text-muted-foreground block mb-1">Unità</span>
              <span className="text-foreground font-medium">
                {getEntityNameById(
                  currentTest.unita_misura_id || '',
                  unitaData?.data
                )}
              </span>
            </div>
            <div className="pb-2 border-b border-border">
              <span className="text-muted-foreground block mb-1">
                Strumento
              </span>
              <span className="text-foreground font-medium">
                {getEntityNameById(
                  currentTest.strumento_id || '',
                  strumentiData?.data
                )}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Fase</span>
              <span className="text-foreground font-medium">
                {getEntityNameById(
                  currentTest.fase_temporale_id || '',
                  fasiTemporaliData?.data
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
