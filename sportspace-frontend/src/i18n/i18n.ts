import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import estonian from "./estonian.json";
import english from "./english.json";

const resources = {
  et: {
    translation: estonian,
  },
  en: {
    translation: english,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: determineLanguage(),

  interpolation: {
    escapeValue: false,
  },
});

function determineLanguage() {
  const language = localStorage.getItem("language");
  if (!language || !Object.keys(resources).includes(language)) {
    localStorage.setItem("language", "et");
    return "et";
  }
  return language;
}

export default i18n;
