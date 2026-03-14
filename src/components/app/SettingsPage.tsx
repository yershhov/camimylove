import { HStack, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ensureLanguageLoaded } from "../../i18n";
import PageContainer from "../ui/PageContainer";
import BackHomeButton from "../ui/BackHomeButton";
import FormSelect from "../ui/FormSelect";
import { LANGUAGE_STORAGE_KEY } from "../../i18n/resources";
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
  };

  return (
    <PageContainer justifyContent="flex-start" alignItems="stretch" gap={4}>
      <HStack justifyContent="space-between" w="100%">
        <BackHomeButton iconOnly />
        <Text
          fontFamily="'Dancing Script', cursive"
          fontSize="4xl"
          textAlign="center"
        >
          {t("settings.title")}
        </Text>
        <HStack w="40px" />
      </HStack>

      <VStack gap={2} alignItems="stretch">
        <FormSelect
          label={t("settings.languageLabel")}
          name="language"
          options={languages.map((language) => ({
            label: language.label,
            value: language.code,
          }))}
          value={currentLanguage}
          onChange={(nextLanguage) => {
            void handleLanguageChange(nextLanguage as AppLanguage);
          }}
        />
      </VStack>
    </PageContainer>
  );
};

export default SettingsPage;
