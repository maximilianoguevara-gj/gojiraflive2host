import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translates';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translations.en,
    },
    es: {
      translation: translations.es,
    },
    pt: {
      translation: translations.pt,
    },
  },
  lng: 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
