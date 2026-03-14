import type { AppLanguage } from "./metadata";
import { supportedLanguages } from "./metadata";

export const LANGUAGE_STORAGE_KEY = "camimylove_language";

export async function loadLocale(language: AppLanguage) {
  switch (language) {
    case "it":
      return (await import("./locales/it")).default;
    case "es":
      return (await import("./locales/es")).default;
    case "uk":
      return (await import("./locales/uk")).default;
    case "de":
      return (await import("./locales/de")).default;
    case "fr":
      return (await import("./locales/fr")).default;
    case "nl":
      return (await import("./locales/nl")).default;
    default:
      throw new Error(`Unsupported locale requested: ${language}`);
  }
}

export function normalizeLanguage(
  rawLanguage: string | null | undefined,
): AppLanguage {
  if (!rawLanguage) return "en";

  const normalized = rawLanguage.toLowerCase().split("-")[0] as AppLanguage;
  return supportedLanguages.includes(normalized) ? normalized : "en";
}

export function detectInitialLanguage() {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage) {
    return normalizeLanguage(storedLanguage);
  }

  const browserLanguage =
    window.navigator.languages?.[0] ?? window.navigator.language;
  return normalizeLanguage(browserLanguage);
}
