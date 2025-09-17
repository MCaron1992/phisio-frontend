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
    key: 'utente-elenco',
    label: 'Elenco',
    icon: Activity,
    href: '/utente/elenco',
  },
  {
    key: 'utente-nuovo',
    label: 'Nuovo',
    icon: Zap,
    href: '/utente/new',
    onClick: () => console.log('Nuovo clicked!'),
  },
];

export const itemsStudio = [
  {
    key: 'studio-elenco',
    label: 'Elenco',
    icon: Activity,
    href: '/studio/elenco',
  },
  {
    key: 'studio-nuovo',
    label: 'Nuovo',
    icon: Zap,
    href: '/studio/new',
    onClick: () => console.log('Nuovo clicked!'),
  },
];
export const itemsUtenteRuoli = [
  {
    key: 'fascia-eta',
    label: 'Fascia età',
    icon: Users,
    href: '/system/fascia-eta',
  },
  {
    key: 'stato-salute',
    label: 'Stato di salute',
    icon: Heart,
    href: '/system/stato-salute',
  },
];

// ⚕️ Terapia & Problema
export const itemsTerapiaProblema = [
  {
    key: 'approccio-terapeutico',
    label: 'Approccio terapeutico',
    icon: Stethoscope,
    href: '/system/terapia',
  },
  {
    key: 'meccanismi-problema',
    label: 'Meccanismo problema',
    icon: Brain,
    href: '/system/meccanismi-problema',
  },
];

// 🏋️ Test & Metriche
export const itemsTestMetriche = [
  {
    key: 'test-elenco',
    label: 'Test',
    icon: Activity,
    href: '/system/test',
  },
  {
    key: 'categoria-funzionale',
    label: 'Categoria funzionale',
    icon: LineChart,
    href: '/system/categoria-funzionale',
  },
  {
    key: 'metrica-elenco',
    label: 'Metrica',
    icon: BarChart2,
    href: '/system/metrica',
  },
  {
    key: 'unita-misura',
    label: 'Unità di misura',
    icon: Ruler,
    href: '/system/unita-misura',
  },
  {
    key: 'test-metrica-unita',
    label: 'Test - Metrica - Unità',
    icon: TestTube,
    href: '/system/test-metrica-unita',
  },
];

// 🦵 Anatomia
export const itemsAnatomia = [
  {
    key: 'arto',
    label: 'Arto',
    icon: Activity,
    href: '/system/arto',
  },
  {
    key: 'regione-anatomica',
    label: 'Regione anatomica',
    icon: Layers,
    href: '/system/regione-anatomica',
  },
  {
    key: 'struttura-principale',
    label: 'Struttura principale',
    icon: Dumbbell,
    href: '/system/struttura-principale',
  },
  {
    key: 'struttura-specifica',
    label: 'Struttura specifica',
    icon: Microscope,
    href: '/system/struttura-specifica',
  },
];

export const itemsSportStrumenti = [
  {
    key: 'sport-elenco',
    label: 'Sport',
    icon: Trophy,
    href: '/system/sport',
  },
  {
    key: 'squadra-elenco',
    label: 'Squadre',
    icon: Trophy,
    href: '/system/teams',
  },
  {
    key: 'ruolo-elenco',
    label: 'Ruolo',
    icon: Shield,
    href: '/system/ruolo-sport',
  },
  {
    key: 'livello-sportivo',
    label: 'Livello sportivo',
    icon: Trophy,
    href: '/system/livello-sportivo',
  },
  {
    key: 'strumento-elenco',
    label: 'Strumento',
    icon: Zap,
    href: '/system/strumento',
  },
];
