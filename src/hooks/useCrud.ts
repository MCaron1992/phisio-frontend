import { createCrudHooks } from '@/lib/crudFactory';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

/**
 *
 *
 * */
export interface Arto {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}
export const {
  useIndex: useArti,
  useShow: useArto,
  useStore: useCreateArto,
  useUpdate: useUpdateArto,
  useDestroy: useDeleteArto,
} = createCrudHooks<Arto>('/system/arti', 'arto');

/**
 *
 *
 * */

export interface CategoriaFunzionale {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useCategorieFunzionali,
  useShow: useCategoriaFunzionale,
  useStore: useCreateCategoriaFunzionale,
  useUpdate: useUpdateCategoriaFunzionale,
  useDestroy: useDeleteCategoriaFunzionale,
} = createCrudHooks<CategoriaFunzionale>(
  '/system/categorie-funzionali',
  'categorie-funzionali'
);

/**
 *
 * FasceEta
 * */

export interface FasceEta {
  id: number;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}
export const {
  useIndex: useFasceEta,
  useShow: useFasciaEta,
  useStore: useCreateFasciaEta,
  useUpdate: useUpdateFasciaEta,
  useDestroy: useDeleteFasciaEta,
} = createCrudHooks<FasceEta>('/system/fasce', 'fasce');

/**
 *
 *
 * */

export interface LivelloSportivi {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useLivelliSportivi,
  useShow: useLivelloSportivo,
  useStore: useCreateLivelloSportivo,
  useUpdate: useUpdateLivelloSportivo,
  useDestroy: useDeleteLivelloSportivo,
} = createCrudHooks<LivelloSportivi>(
  '/system/livelli-sportivi',
  'livelli-sportivi'
);

/**
 *
 *
 * */

export interface MeccanismoProblema {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useMeccanismiProblema,
  useShow: useMeccanismoProblema,
  useStore: useCreateMeccanismoProblema,
  useUpdate: useUpdateMeccanismoProblema,
  useDestroy: useDeleteMeccanismoProblema,
} = createCrudHooks<MeccanismoProblema>(
  '/system/meccanismi-problema',
  'meccanismi-problema'
);

/**
 * Metrica
 *
 * */

export interface Metrica {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useMetriche,
  useShow: useMetrica,
  useStore: useCreateMetrica,
  useUpdate: useUpdateMetrica,
  useDestroy: useDeleteMetrica,
} = createCrudHooks<Metrica>('/system/metriche', 'metriche');
/**
 *
 *
 * */

export interface RegioniAnatomicha {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useRegioniAnatomiche,
  useShow: useRegioneAnatomica,
  useStore: useCreateRegioneAnatomica,
  useUpdate: useUpdateRegioneAnatomica,
  useDestroy: useDeleteRegioneAnatomica,
} = createCrudHooks<RegioniAnatomicha>(
  '/system/regioni-anatomiche',
  'regioni-anatomiche'
);

/**
 *
 * Ruolo-Sport
 * */

export interface Ruoli_Sport {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
  sport?: Sport;
  sport_id?: number;
}
export const {
  useIndex: useRuoli,
  useShow: useRuolo,
  useStore: useCreateRuolo,
  useUpdate: useUpdateRuolo,
  useDestroy: useDeleteRuolo,
} = createCrudHooks<Ruoli_Sport>('/system/ruoli', 'ruoli');
/**
 *Sport
 *
 * */

export interface Sport {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useSport,
  useShow: useSingoloSport,
  useStore: useCreateSport,
  useUpdate: useUpdateSport,
  useDestroy: useDeleteSport,
} = createCrudHooks<Sport>('/system/sport', 'sport');

/**
 * Stati di Salute
 *
 * */

export interface StatiSalute {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useStatiSalute,
  useShow: useStatoSalute,
  useStore: useCreateStatoSalute,
  useUpdate: useUpdateStatoSalute,
  useDestroy: useDeleteStatoSalute,
} = createCrudHooks<StatiSalute>('/system/stati-salute', 'stati-salute');

/**
 *
 * Strumenti
 * */

export interface Strumenti {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useStrumenti,
  useShow: useStrumento,
  useStore: useCreateStrumento,
  useUpdate: useUpdateStrumento,
  useDestroy: useDeleteStrumento,
} = createCrudHooks<Strumenti>('/system/strumenti', 'strumenti');

/**
 *
 * StrutturePrincipali
 * */

export interface StrutturePrincipali {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useStrutturePrincipali,
  useShow: useStrutturaPrincipale,
  useStore: useCreateStrutturaPrincipale,
  useUpdate: useUpdateStrutturaPrincipale,
  useDestroy: useDeleteStrutturaPrincipale,
} = createCrudHooks<StrutturePrincipali>(
  '/system/strutture-principali',
  'strutture-principali'
);

/**
 *
 * StruttureSpecifiche
 * */

export interface StruttureSpecifiche {
  id: number;
  nome: string;
  descrizione?: string;
  regione_anatomica?: RegioniAnatomicha;
  struttura_principale?: StrutturePrincipali;
  id_regione_anatomica?: number;
  id_struttura_principale?: number;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useStruttureSpecifiche,
  useShow: useStrutturaSpecifica,
  useStore: useCreateStrutturaSpecifica,
  useUpdate: useUpdateStrutturaSpecifica,
  useDestroy: useDeleteStrutturaSpecifica,
} = createCrudHooks<StruttureSpecifiche>(
  '/system/strutture-specifiche',
  'strutture-specifiche'
);

/**
 *
 * Terapia
 * */

export interface Approccio {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useApprocci,
  useShow: useApproccio,
  useStore: useCreateApproccio,
  useUpdate: useUpdateApproccio,
  useDestroy: useDeleteApproccio,
} = createCrudHooks<Approccio>('/system/approcci', 'approcci');

/**
 *
 * tests
 * */

export interface Test {
  id: number;
  nome_abbreviato?: string;
  nome_esteso?: string;
  id_categoria_funzionale: number;
  lateralita?: string;
  istruzioni_verbali?: string;
  categoria_funzionale?: CategoriaFunzionale;
  tempo_di_recupero?: number;
  foto?: string;
  video?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useTests,
  useShow: useTest,
  useStore: useCreateTest,
  useUpdate: useUpdateTest,
  useDestroy: useDeleteTest,
} = createCrudHooks<Test>('/system/tests', 'test');

/**
 *
 *
 * */

export interface Teams {
  id: number;
  nome: string;
  _optimistic?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useTeams,
  useShow: useTeam,
  useStore: useCreateTeam,
  useUpdate: useUpdateTeam,
  useDestroy: useDeleteTeam,
} = createCrudHooks<Teams>('/system/teams', 'teams');

/**
 * Hook custom per ottenere i pazienti di una squadra specifica
 * */
export const usePazientiByTeam = (teamId: string | number) => {
  return useQuery({
    queryKey: ['pazienti-team', teamId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/system/teams/${teamId}/pazienti`);
      return data;
    },
    enabled: !!teamId,
  });
};

/**
 *
 *
 * */
export interface UnitaMisura {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useUnitaMisura,
  useShow: useSingolaUnitaMisura,
  useStore: useCreateUnitaMisura,
  useUpdate: useUpdateUnitaMisura,
  useDestroy: useDeleteUnitaMisura,
} = createCrudHooks<UnitaMisura>('/system/unita-misura', 'unita-misura');

/**
 *
 * Test Metrica Unità
 * */

export interface TestMetricaUnita {
  id: number;
  id_test: number;
  id_metrica: number;
  id_unita: number;
  nome: string;
  test?: Test;
  metrica?: Metrica;
  unita?: UnitaMisura;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useTestMetricaUnita,
  useShow: useSingolaTestMetricaUnita,
  useStore: useCreateTestMetricaUnita,
  useUpdate: useUpdateTestMetricaUnita,
  useDestroy: useDeleteTestMetricaUnita,
} = createCrudHooks<TestMetricaUnita>('/system/test-metrica-unita', 'test-metrica-unita');

/**
 * boh da vedere
 *
 * */

export interface Arto {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}
export const {
  useIndex: useFasiTemporali,
  useShow: useFaseTemporale,
  useStore: useCreateFaseTemporale,
  useUpdate: useUpdateFaseTemporale,
  useDestroy: useDeleteFaseTemporale,
} = createCrudHooks<any>('/system/fasi-temporali', 'fasi-temporali');

/**
 * Utente
 *
 * */
export interface Utente {
  id: number;
  nome: string;
  cognome?: string;
  email: string;
  email_verified_at?: string;
  ruolo?: string;
  attivo?: boolean;
  studi?: Studio[];
  created_at?: string;
  updated_at?: string;
}
export const {
  useIndex: useUtenti,
  useShow: useUtente,
  useStore: useCreateUtente,
  useUpdate: useUpdateUtente,
  useDestroy: useDeleteUtente,
} = createCrudHooks<Utente>('/user', 'users');

/**
 * Studio
 *
 * */
export interface Studio {
  id: number;
  nome: string;
  email: string;
  email_verified_at?: string;
  ruolo?: string;
  attivo?: boolean;
  created_at?: string;
  updated_at?: string;
}
export const {
  useIndex: useStudi,
  useShow: useStudio,
  useStore: useCreateStudio,
  useUpdate: useUpdateStudio,
  useDestroy: useDeleteStudio,
} = createCrudHooks<Studio>('/system/studio', 'studio');

/**
 * Giocatore
 *
 * */
export interface Paziente {
  id: number;
  nome?: string;
  cognome?: string;
  data_nascita: string;
  sesso?: string;
  etnia?: string;
  id_studio?: number;
  codice_fiscale?: string;
  attivo?: boolean;
  sport_id?: number;
  ruolo_sport_id?: number;
  team_id?: number;
  livello_sportivo_id?: number;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: usePazienti,
  useShow: usePaziente,
  useStore: useCreatePaziente,
  useUpdate: useUpdatePaziente,
  useDestroy: useDeletePaziente,
} = createCrudHooks<Paziente>('/paziente', 'paziente');

/**
 * Fatti Giocatore
 *
 * */
export interface FattiGiocatore {
  id: number;
}
export const {
  useIndex: useFattiGiocatori,
  useShow: useFattiGiocatore,
  useStore: useCreateFattiGiocatore,
  useUpdate: useUpdateFattiGiocatore,
  useDestroy: useDeleteFattiGiocatore,
} = createCrudHooks<FattiGiocatore>('/fatti-giocatore', 'fatti-giocatore');

/**
 * Test Squadra - Configurazione test per una squadra
 *
 * */
export interface TestSquadra {
  id: number;
  team_id: number;
  categoria_funzionale_id: number;
  test_id: number;
  metrica_id: number;
  unita_misura_id: number;
  strumento_id: number;
  fase_temporale_id: number;
  categoria_funzionale?: CategoriaFunzionale;
  test?: Test;
  metrica?: Metrica;
  unita?: UnitaMisura;
  strumento?: Strumenti;
  fase_temporale?: any;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useTestiSquadra,
  useShow: useTestSquadra,
  useStore: useCreateTestSquadra,
  useUpdate: useUpdateTestSquadra,
  useDestroy: useDeleteTestSquadra,
} = createCrudHooks<TestSquadra>('/system/test-squadra', 'test-squadra');

/**
 * Risultato Test Giocatore - Valori test per singolo giocatore
 *
 * */
export interface RisultatoTestGiocatore {
  id: number;
  test_squadra_id: number;
  paziente_id: number;
  valore_test_1?: string;
  valore_test_2?: string;
  valore_test_3?: string;
  data_esecuzione?: string;
  test_squadra?: TestSquadra;
  paziente?: Paziente;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useRisultatiTest,
  useShow: useRisultatoTest,
  useStore: useCreateRisultatoTest,
  useUpdate: useUpdateRisultatoTest,
  useDestroy: useDeleteRisultatoTest,
} = createCrudHooks<RisultatoTestGiocatore>('/system/risultato-test', 'risultato-test');
