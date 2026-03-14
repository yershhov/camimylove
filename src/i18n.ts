import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./i18n/locales/en";
import { supportedLanguages } from "./i18n/metadata";
import { detectInitialLanguage, loadLocale } from "./i18n/resources";

export async function ensureLanguageLoaded(language: string) {
  const locale = supportedLanguages.includes(language as (typeof supportedLanguages)[number])
    ? (language as (typeof supportedLanguages)[number])
    : "en";

  if (i18n.hasResourceBundle(locale, "translation")) {
    return;
  }

  const translation = await loadLocale(locale);
  i18n.addResourceBundle(locale, "translation", translation, true, true);
}

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
    },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    load: "languageOnly",
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
  });

export const i18nReady = (async () => {
  const initialLanguage = detectInitialLanguage();
  await ensureLanguageLoaded(initialLanguage);
  await i18n.changeLanguage(initialLanguage);
})();

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.resolvedLanguage ?? "en";
  i18n.on("languageChanged", (language) => {
    document.documentElement.lang = language;
  });
}

export default i18n;
