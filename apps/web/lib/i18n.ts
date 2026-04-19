'use client';

export const TRANSLATIONS = {
  en: {
    home: 'Home',
    dashboard: 'Dashboard',
    planner: 'AI Planner',
    more: 'More',
    pulse: 'The Pulse',
    communities: 'Communities',
    rewards: 'Rewards',
    listen: 'Listen to Narration',
    record: 'Record Archive',
    connecting: 'Connecting to heritage...',
    explorers: 'Explorers',
    hp: 'HP',
  },
  hi: {
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    planner: 'AI प्लानर',
    more: 'अधिक',
    pulse: 'पल्स',
    communities: 'समुदाय',
    rewards: 'इनाम',
    listen: 'वर्णन सुनें',
    record: 'आर्काइव रिकॉर्ड करें',
    connecting: 'विरासत से जुड़ रहे हैं...',
    explorers: 'अन्वेषक',
    hp: 'HP',
  },
} as const;

export type Language = keyof typeof TRANSLATIONS;

export function getTranslation(lang: Language) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
