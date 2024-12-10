import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import frTranslation from "./fr.json";
import { defaultLanguage } from "./translationUtils.ts";

i18n.use(initReactI18next).init({
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    fr: {
      translation: frTranslation,
    },
  },
});

export default i18n;
