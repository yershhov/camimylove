export const APP_NAME = "Camimylove";

export const languages = [
  { code: "en", label: "English" },
  { code: "it", label: "Italiano" },
  { code: "es", label: "Español" },
  { code: "uk", label: "Українська" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "nl", label: "Nederlands" },
] as const;

export type AppLanguage = (typeof languages)[number]["code"];

export const supportedLanguages = languages.map((language) => language.code);
