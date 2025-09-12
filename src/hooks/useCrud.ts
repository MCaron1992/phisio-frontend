import { createCrudHooks } from '@/lib/crudFactory';

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
 *
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

export interface RegioniAnatomiche {
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
} = createCrudHooks<RegioniAnatomiche>(
  '/system/regioni-anatomiche',
  'regioni-anatomiche'
);

/**
 *
 * Ruolo-Sport
 * */

export interface Ruoli {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}
export const {
  useIndex: useRuoli,
  useShow: useRuolo,
  useStore: useCreateRuolo,
  useUpdate: useUpdateRuolo,
  useDestroy: useDeleteRuolo,
} = createCrudHooks<Ruoli>('/system/ruoli', 'ruoli');
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
 *
 * */

export interface Teams {
  id: number;
  nome: string;
  descrizione?: string;
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
 * Terapia
 * */

export interface Test {
  id: number;
  nome: string;
  descrizione?: string;
  created_at?: string;
  updated_at?: string;
}

export const {
  useIndex: useTests,
  useShow: useuseTest,
  useStore: useCreateuseTest,
  useUpdate: useUpdateTest,
  useDestroy: useDeleteTest,
} = createCrudHooks<Test>('/system/test', 'test');

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
