import { createCrudHooks } from '@/lib/crudFactory';

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

export const {
  useIndex: useArti,
  useShow: useArto,
  useStore: useCreateArto,
  useUpdate: useUpdateArto,
  useDestroy: useDeleteArto,
} = createCrudHooks<any>('/system/arti', 'arti');

export const {
  useIndex: useCategorieFunzionali,
  useShow: useCategoriaFunzionale,
  useStore: useCreateCategoriaFunzionale,
  useUpdate: useUpdateCategoriaFunzionale,
  useDestroy: useDeleteCategoriaFunzionale,
} = createCrudHooks<any>(
  '/system/categorie-funzionali',
  'categorie-funzionali'
);

export const {
  useIndex: useEpisodiClinici,
  useShow: useEpisodioClinico,
  useStore: useCreateEpisodioClinico,
  useUpdate: useUpdateEpisodioClinico,
  useDestroy: useDeleteEpisodioClinico,
} = createCrudHooks<any>('/system/episodi-clinici', 'episodi-clinici');

export const {
  useIndex: useEpisodiStruttura,
  useShow: useEpisodioStruttura,
  useStore: useCreateEpisodioStruttura,
  useUpdate: useUpdateEpisodioStruttura,
  useDestroy: useDeleteEpisodioStruttura,
} = createCrudHooks<any>('/system/episodi-struttura', 'episodi-struttura');

export const {
  useIndex: useFasceEta,
  useShow: useFasciaEta,
  useStore: useCreateFasciaEta,
  useUpdate: useUpdateFasciaEta,
  useDestroy: useDeleteFasciaEta,
} = createCrudHooks<any>('/system/fasce', 'fasce');

export const {
  useIndex: useFasiTemporali,
  useShow: useFaseTemporale,
  useStore: useCreateFaseTemporale,
  useUpdate: useUpdateFaseTemporale,
  useDestroy: useDeleteFaseTemporale,
} = createCrudHooks<any>('/system/fasi-temporali', 'fasi-temporali');

export const {
  useIndex: useLivelliSportivi,
  useShow: useLivelloSportivo,
  useStore: useCreateLivelloSportivo,
  useUpdate: useUpdateLivelloSportivo,
  useDestroy: useDeleteLivelloSportivo,
} = createCrudHooks<any>('/system/livelli-sportivi', 'livelli-sportivi');

export const {
  useIndex: useMeccanismiProblema,
  useShow: useMeccanismoProblema,
  useStore: useCreateMeccanismoProblema,
  useUpdate: useUpdateMeccanismoProblema,
  useDestroy: useDeleteMeccanismoProblema,
} = createCrudHooks<any>('/system/meccanismi-problema', 'meccanismi-problema');

export const {
  useIndex: useMetriche,
  useShow: useMetrica,
  useStore: useCreateMetrica,
  useUpdate: useUpdateMetrica,
  useDestroy: useDeleteMetrica,
} = createCrudHooks<any>('/system/metriche', 'metriche');

export const {
  useIndex: useRegioniAnatomiche,
  useShow: useRegioneAnatomica,
  useStore: useCreateRegioneAnatomica,
  useUpdate: useUpdateRegioneAnatomica,
  useDestroy: useDeleteRegioneAnatomica,
} = createCrudHooks<any>('/system/regioni-anatomiche', 'regioni-anatomiche');

export const {
  useIndex: useRuoli,
  useShow: useRuolo,
  useStore: useCreateRuolo,
  useUpdate: useUpdateRuolo,
  useDestroy: useDeleteRuolo,
} = createCrudHooks<any>('/system/ruoli', 'ruoli');

export const {
  useIndex: useSport,
  useShow: useSingoloSport,
  useStore: useCreateSport,
  useUpdate: useUpdateSport,
  useDestroy: useDeleteSport,
} = createCrudHooks<any>('/system/sport', 'sport');

export const {
  useIndex: useStatiSalute,
  useShow: useStatoSalute,
  useStore: useCreateStatoSalute,
  useUpdate: useUpdateStatoSalute,
  useDestroy: useDeleteStatoSalute,
} = createCrudHooks<any>('/system/stati-salute', 'stati-salute');

export const {
  useIndex: useStrumenti,
  useShow: useStrumento,
  useStore: useCreateStrumento,
  useUpdate: useUpdateStrumento,
  useDestroy: useDeleteStrumento,
} = createCrudHooks<any>('/system/strumenti', 'strumenti');

export const {
  useIndex: useStrutturePrincipali,
  useShow: useStrutturaPrincipale,
  useStore: useCreateStrutturaPrincipale,
  useUpdate: useUpdateStrutturaPrincipale,
  useDestroy: useDeleteStrutturaPrincipale,
} = createCrudHooks<any>(
  '/system/strutture-principali',
  'strutture-principali'
);

export const {
  useIndex: useStruttureSpecifiche,
  useShow: useStrutturaSpecifica,
  useStore: useCreateStrutturaSpecifica,
  useUpdate: useUpdateStrutturaSpecifica,
  useDestroy: useDeleteStrutturaSpecifica,
} = createCrudHooks<any>(
  '/system/strutture-specifiche',
  'strutture-specifiche'
);

export const {
  useIndex: useTeams,
  useShow: useTeam,
  useStore: useCreateTeam,
  useUpdate: useUpdateTeam,
  useDestroy: useDeleteTeam,
} = createCrudHooks<any>('/system/teams', 'teams');

export const {
  useIndex: useUnitaMisura,
  useShow: useSingolaUnitaMisura,
  useStore: useCreateUnitaMisura,
  useUpdate: useUpdateUnitaMisura,
  useDestroy: useDeleteUnitaMisura,
} = createCrudHooks<any>('/system/unita-misura', 'unita-misura');
