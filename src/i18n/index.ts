import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import it from "./locales/it.json";

i18n
    .use(LanguageDetector)   // detect user language
    .use(initReactI18next)   // react-i18next integration
    .init({
        resources: {
            en: { translation: en },
            it: { translation: it },
        },
        fallbackLng: "en",          // if the language is not supported, use EN
        interpolation: {
            escapeValue: false,       // React already escapes values
        },
    });

export default i18n;