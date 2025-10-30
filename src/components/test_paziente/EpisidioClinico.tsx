import React, { useState, useMemo, useEffect } from 'react';

interface RegioneAnatomica {
  id: number;
  nome: string;
  descrizione: string;
  richiedeLato: boolean;
}

interface Lato {
  id: 'dx' | 'sx';
  nome: string;
  icona: string;
}

interface StrutturaPrincipale {
  id: number;
  nome: string;
  descrizione: string;
}

interface StrutturaSpecifica {
  id: number;
  nome: string;
  regioneId: number;
  strutturaPrincipaleId: number;
  descrizione: string;
}

interface MeccanismoProblema {
  id: number;
  nome: string;
  descrizione: string;
}

interface ApproccioTerapeutico {
  id: number;
  nome: string;
  descrizione: string;
}

interface SelectOption {
  id: number;
  nome: string;
  descrizione?: string;
}

interface SearchableSelectProps<T extends SelectOption> {
  label: string;
  options: T[];
  value: number | null;
  onChange: (id: number) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
}

interface FormDataState {
  dataEpisodio: string;
  regioneId: number | null;
  latoCoinvolto: 'dx' | 'sx' | null;
  strutturaPrincipaleId: number | null;
  strutturaSpecificaId: number | null;
  meccanismoId: number | null;
  approccioId: number | null;
}

const REGIONI_ANATOMICHE: RegioneAnatomica[] = [
  {
    id: 1,
    nome: 'Spalla',
    descrizione: 'Include articolazione scapolo-omerale...',
    richiedeLato: true,
  },
  {
    id: 7,
    nome: 'Colonna cervicale',
    descrizione: 'Tratto del collo (C1–C7).',
    richiedeLato: false,
  },
];

const LATI: Lato[] = [
  { id: 'dx', nome: 'Destro', icona: '→' },
  { id: 'sx', nome: 'Sinistro', icona: '←' },
];

const STRUTTURE_PRINCIPALI: StrutturaPrincipale[] = [
  {
    id: 1,
    nome: 'Muscolare',
    descrizione: 'Coinvolge il tessuto muscolare...',
  },
];

const STRUTTURE_SPECIFICHE: StrutturaSpecifica[] = [
  {
    id: 1,
    nome: 'Sovraspinato',
    regioneId: 1,
    strutturaPrincipaleId: 1,
    descrizione: 'Muscolo della cuffia...',
  },
];

const MECCANISMI_PROBLEMA: MeccanismoProblema[] = [
  { id: 1, nome: 'Traumatico acuto', descrizione: 'Evento improvviso...' },
];

const APPROCCI_TERAPEUTICI: ApproccioTerapeutico[] = [
  { id: 1, nome: 'Conservativo', descrizione: 'Trattamenti non chirurgici...' },
  { id: 2, nome: 'Chirurgico', descrizione: 'Intervento chirurgico...' },
];

function SearchableSelect<T extends SelectOption>({
  label,
  options,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  helpText,
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(opt =>
      opt.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 text-left bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.nome : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
            <div className="p-2 border-b sticky top-0 bg-white">
              <input
                type="text"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={e => e.stopPropagation()}
              />
            </div>
            <div className="overflow-y-auto max-h-64">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Nessun risultato
                </div>
              ) : (
                filteredOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${
                      option.id === value ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {option.nome}
                    </div>
                    {option.descrizione && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {option.descrizione}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}

interface LatoSelectorProps {
  value: 'dx' | 'sx' | null;
  onChange: (value: 'dx' | 'sx') => void;
  required?: boolean;
  disabled?: boolean;
}

const LatoSelector: React.FC<LatoSelectorProps> = ({
  value,
  onChange,
  required,
  disabled,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Lato coinvolto {required && <span className="text-red-500">*</span>}
    </label>
    <div className="grid grid-cols-2 gap-3">
      {LATI.map(lato => (
        <button
          key={lato.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(lato.id)}
          className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
            disabled
              ? 'bg-gray-50 cursor-not-allowed opacity-50'
              : value === lato.id
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white hover:border-blue-400 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{lato.icona}</span>
            <span>{lato.nome}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default function EpisidioClinico() {
  const [formData, setFormData] = useState<FormDataState>({
    dataEpisodio: new Date().toISOString().split('T')[0],
    regioneId: null,
    latoCoinvolto: null,
    strutturaPrincipaleId: null,
    strutturaSpecificaId: null,
    meccanismoId: null,
    approccioId: null,
  });

  const [showResult, setShowResult] = useState(false);

  const regioneSelezionata = REGIONI_ANATOMICHE.find(
    r => r.id === formData.regioneId
  );
  const richiedeLato = regioneSelezionata?.richiedeLato ?? false;

  const struttureSpecificheDisponibili = useMemo(() => {
    if (!formData.regioneId || !formData.strutturaPrincipaleId) return [];
    return STRUTTURE_SPECIFICHE.filter(
      s =>
        s.regioneId === formData.regioneId &&
        s.strutturaPrincipaleId === formData.strutturaPrincipaleId
    );
  }, [formData.regioneId, formData.strutturaPrincipaleId]);

  useEffect(() => {
    if (!richiedeLato) {
      setFormData(prev => ({ ...prev, latoCoinvolto: null }));
    }
  }, [richiedeLato]);

  const isFormValid = (): boolean => {
    const baseValid =
      formData.dataEpisodio &&
      formData.regioneId &&
      formData.strutturaPrincipaleId &&
      formData.strutturaSpecificaId &&
      formData.meccanismoId &&
      formData.approccioId;

    if (richiedeLato) {
      return baseValid && formData.latoCoinvolto !== null;
    }

    return Boolean(baseValid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) setShowResult(true);
  };

  const handleReset = () => {
    setFormData({
      dataEpisodio: new Date().toISOString().split('T')[0],
      regioneId: null,
      latoCoinvolto: null,
      strutturaPrincipaleId: null,
      strutturaSpecificaId: null,
      meccanismoId: null,
      approccioId: null,
    });
    setShowResult(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Registrazione Episodio Clinico
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Compila tutti i campi per registrare un nuovo episodio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Episodio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dataEpisodio}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        dataEpisodio: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <SearchableSelect
                  label="Dove si localizza l'origine del problema?"
                  options={REGIONI_ANATOMICHE}
                  value={formData.regioneId}
                  onChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      regioneId: value,
                      latoCoinvolto: null,
                      strutturaPrincipaleId: null,
                      strutturaSpecificaId: null,
                    }))
                  }
                  placeholder="Seleziona regione anatomica"
                  required
                  helpText="Indica la sede anatomica di origine del problema"
                />

                {richiedeLato && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <LatoSelector
                      value={formData.latoCoinvolto}
                      onChange={value =>
                        setFormData(prev => ({ ...prev, latoCoinvolto: value }))
                      }
                      required={true}
                      disabled={!formData.regioneId}
                    />
                    <p className="mt-2 text-xs text-blue-700">
                      <strong>Nota:</strong> Per questa regione anatomica è
                      necessario specificare il lato coinvolto
                    </p>
                  </div>
                )}

                {formData.regioneId && !richiedeLato && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs text-gray-600">
                        Per questa regione anatomica (strutture
                        assiali/centrali) non è necessario specificare il lato
                      </p>
                    </div>
                  </div>
                )}

                {/* Struttura Principale */}
                <SearchableSelect
                  label="Qual è la struttura o il tessuto primariamente coinvolto?"
                  options={STRUTTURE_PRINCIPALI}
                  value={formData.strutturaPrincipaleId}
                  onChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      strutturaPrincipaleId: value,
                      strutturaSpecificaId: null,
                    }))
                  }
                  placeholder="Seleziona struttura principale"
                  required
                  disabled={
                    !formData.regioneId ||
                    (richiedeLato && !formData.latoCoinvolto)
                  }
                  helpText="Identifica il tipo di tessuto coinvolto"
                />

                <SearchableSelect
                  label="Qual è la struttura anatomica specifica coinvolta?"
                  options={
                    struttureSpecificheDisponibili.length > 0
                      ? struttureSpecificheDisponibili
                      : [
                          {
                            id: 999,
                            nome: 'Non determinabile',
                            descrizione:
                              'Nessuna struttura specifica identificabile',
                          },
                        ]
                  }
                  value={formData.strutturaSpecificaId}
                  onChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      strutturaSpecificaId: value,
                    }))
                  }
                  placeholder="Seleziona struttura specifica"
                  required
                  disabled={!formData.strutturaPrincipaleId}
                  helpText={
                    struttureSpecificheDisponibili.length > 0
                      ? `${struttureSpecificheDisponibili.length} strutture disponibili`
                      : 'Seleziona prima regione e struttura principale'
                  }
                />

                <SearchableSelect
                  label="Qual è la natura o meccanismo di origine del problema?"
                  options={MECCANISMI_PROBLEMA}
                  value={formData.meccanismoId}
                  onChange={value =>
                    setFormData(prev => ({ ...prev, meccanismoId: value }))
                  }
                  placeholder="Seleziona meccanismo"
                  required
                  helpText="Come si è originato il problema?"
                />

                <SearchableSelect
                  label="Qual è l'approccio terapeutico adottato?"
                  options={APPROCCI_TERAPEUTICI}
                  value={formData.approccioId}
                  onChange={value =>
                    setFormData(prev => ({ ...prev, approccioId: value }))
                  }
                  placeholder="Seleziona approccio terapeutico"
                  required
                  helpText="Conservativo o chirurgico?"
                />
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Riepilogo
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="pb-2 border-b border-gray-200">
                      <span className="text-gray-500 block mb-1">Data</span>
                      <span className="text-gray-900 font-medium">
                        {formData.dataEpisodio
                          ? new Date(formData.dataEpisodio).toLocaleDateString(
                              'it-IT'
                            )
                          : '—'}
                      </span>
                    </div>
                    <div className="pb-2 border-b border-gray-200">
                      <span className="text-gray-500 block mb-1">Regione</span>
                      <span className="text-gray-900 font-medium">
                        {REGIONI_ANATOMICHE.find(
                          r => r.id === formData.regioneId
                        )?.nome || '—'}
                      </span>
                    </div>
                    {richiedeLato && (
                      <div className="pb-2 border-b border-gray-200">
                        <span className="text-gray-500 block mb-1">Lato</span>
                        <span className="text-gray-900 font-medium">
                          {formData.latoCoinvolto
                            ? LATI.find(l => l.id === formData.latoCoinvolto)
                                ?.nome
                            : '—'}
                        </span>
                      </div>
                    )}
                    <div className="pb-2 border-b border-gray-200">
                      <span className="text-gray-500 block mb-1">
                        Struttura Principale
                      </span>
                      <span className="text-gray-900 font-medium">
                        {STRUTTURE_PRINCIPALI.find(
                          s => s.id === formData.strutturaPrincipaleId
                        )?.nome || '—'}
                      </span>
                    </div>
                    <div className="pb-2 border-b border-gray-200">
                      <span className="text-gray-500 block mb-1">
                        Struttura Specifica
                      </span>
                      <span className="text-gray-900 font-medium">
                        {STRUTTURE_SPECIFICHE.find(
                          s => s.id === formData.strutturaSpecificaId
                        )?.nome || '—'}
                      </span>
                    </div>
                    <div className="pb-2 border-b border-gray-200">
                      <span className="text-gray-500 block mb-1">
                        Meccanismo
                      </span>
                      <span className="text-gray-900 font-medium">
                        {MECCANISMI_PROBLEMA.find(
                          m => m.id === formData.meccanismoId
                        )?.nome || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">
                        Approccio
                      </span>
                      <span className="text-gray-900 font-medium">
                        {APPROCCI_TERAPEUTICI.find(
                          a => a.id === formData.approccioId
                        )?.nome || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Salva Episodio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
