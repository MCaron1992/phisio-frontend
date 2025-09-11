import {
  Activity,
  Zap,
  Users,
  Shield,
  Heart,
  LineChart,
  Stethoscope,
  TestTube,
  Ruler,
  BarChart2,
  Layers,
  Brain,
  Dumbbell,
  Trophy,
  Microscope,
} from 'lucide-react';
export const itemsUtente = [
  {
    key: 'studio-elenco',
    label: 'Elenco',
    icon: Activity,
    href: '/exercises/stretching',
  },
  {
    key: 'studio-nuovo',
    label: 'Nuovo',
    icon: Zap,
    onClick: () => console.log('Nuovo clicked!'),
  },
];

export const itemsStudio = [
  {
    key: 'studio-elenco',
    label: 'Elenco',
    icon: Activity,
    href: '/exercises/stretching',
  },
  {
    key: 'studio-nuovo',
    label: 'Nuovo',
    icon: Zap,
    onClick: () => console.log('Nuovo clicked!'),
  },
];
export const itemsUtenteRuoli = [
  {
    key: 'fascia_eta-elenco',
    label: 'Fascia età',
    icon: Users,
    href: '/config/fascia-eta',
  },
  {
    key: 'stato_di_salute-elenco',
    label: 'Stato di salute',
    icon: Heart,
    href: '/config/stato-di-salute',
  },
  {
    key: 'livello_sportivo-elenco',
    label: 'Livello sportivo',
    icon: Trophy,
    href: '/config/livello-sportivo',
  },
];

// ⚕️ Terapia & Problema
export const itemsTerapiaProblema = [
  {
    key: 'approccio_terapeutico-elenco',
    label: 'Approccio terapeutico',
    icon: Stethoscope,
    href: '/config/approccio-terapeutico',
  },
  {
    key: 'meccanismo_problema-elenco',
    label: 'Meccanismo problema',
    icon: Brain,
    href: '/config/meccanismo-problema',
  },
];

// 🏋️ Test & Metriche
export const itemsTestMetriche = [
  {
    key: 'test-elenco',
    label: 'Test',
    icon: Activity,
    href: '/config/test',
  },
  {
    key: 'categoria_funzionale-elenco',
    label: 'Categoria funzionale',
    icon: LineChart,
    href: '/config/categoria-funzionale',
  },
  {
    key: 'metrica-elenco',
    label: 'Metrica',
    icon: BarChart2,
    href: '/config/metrica',
  },
  {
    key: 'unita_di_misura-elenco',
    label: 'Unità di misura',
    icon: Ruler,
    href: '/config/unita-di-misura',
  },
  {
    key: 'test_metrica_unita-elenco',
    label: 'Test - Metrica - Unità',
    icon: TestTube,
    href: '/config/test-metrica-unita',
  },
];

// 🦵 Anatomia
export const itemsAnatomia = [
  {
    key: 'arto-elenco',
    label: 'Arto',
    icon: Activity,
    href: '/config/arto',
  },
  {
    key: 'regione_anatomica-elenco',
    label: 'Regione anatomica',
    icon: Layers,
    href: '/config/regione-anatomica',
  },
  {
    key: 'struttura_principale-elenco',
    label: 'Struttura principale',
    icon: Dumbbell,
    href: '/config/struttura-principale',
  },
  {
    key: 'struttura_specifica-elenco',
    label: 'Struttura specifica',
    icon: Microscope,
    href: '/config/struttura-specifica',
  },
];

// 🏅 Sport & Strumenti
export const itemsSportStrumenti = [
  {
    key: 'sport-elenco',
    label: 'Sport',
    icon: Trophy,
    href: '/config/sport',
  },
  {
    key: 'ruolo-elenco',
    label: 'Ruolo',
    icon: Shield,
    href: '/config/ruolo',
  },
  {
    key: 'strumento-elenco',
    label: 'Strumento',
    icon: Zap,
    href: '/config/strumento',
  },
];
