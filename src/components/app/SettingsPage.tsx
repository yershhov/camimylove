import { HStack, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ensureLanguageLoaded } from "../../i18n";
import { createAppToast } from "../ui/appToaster";
import PageContainer from "../ui/PageContainer";
import BackHomeButton from "../ui/BackHomeButton";
import {
  LANGUAGE_STORAGE_KEY,
} from "../../i18n/resources";
import {
  languages,
  supportedLanguages,
  type AppLanguage,
} from "../../i18n/metadata";

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = supportedLanguages.includes(
    i18n.resolvedLanguage as AppLanguage,
  )
    ? (i18n.resolvedLanguage as AppLanguage)
    : "en";

  const handleLanguageChange = async (nextLanguage: AppLanguage) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    await ensureLanguageLoaded(nextLanguage);
    await i18n.changeLanguage(nextLanguage);
    createAppToast({
      type: "success",
      title: t("settings.languageSaved"),
    });
  };

  return (
    <PageContainer justifyContent="center" alignItems="stretch">
      <HStack justifyContent="flex-start" w="100%">
        <BackHomeButton />
      </HStack>

      <VStack gap={4} alignItems="stretch">
        <Text fontFamily="'Dancing Script', cursive" fontSize="4xl">
          {t("settings.title")}
        </Text>

        <VStack
          gap={2}
          alignItems="stretch"
          bg="white"
          borderWidth="1px"
          borderColor="pink.200"
          rounded="2xl"
          p={5}
          shadow="sm"
        >
          <Text fontSize="sm" color="pink.700">
            {t("settings.languageLabel")}
          </Text>
          <select
            value={currentLanguage}
            onChange={(event) => {
              const nextLanguage = event.target.value as AppLanguage;
              void handleLanguageChange(nextLanguage);
            }}
            style={{
              background: "white",
              border: "1px solid var(--chakra-colors-pink-300)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              fontSize: "16px",
            }}
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
          <Text fontSize="sm" color="pink.700">
            {t("settings.languageHelp")}
          </Text>
        </VStack>

        <Text textAlign="center" color="pink.700" fontSize="sm">
          {t("settings.exclusions")}
        </Text>
      </VStack>
    </PageContainer>
  );
};

export default SettingsPage;
