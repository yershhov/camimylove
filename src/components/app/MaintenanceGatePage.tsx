import { Button, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FieldWrapper from "../ui/FieldWrapper";
import FormInput from "../ui/FormInput";
import PageContainer from "../ui/PageContainer";

type MaintenanceGatePageProps = {
  onUnlock: () => void;
};

const MaintenanceGatePage = ({ onUnlock }: MaintenanceGatePageProps) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/maintenance-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (res.ok && data.ok) {
        onUnlock();
      } else {
        setErrorMessage(data.error ?? t("maintenance.invalidPassword"));
      }
    } catch {
      setErrorMessage(t("maintenance.connectionError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer justifyContent="center" gap={8}>
      <Text textAlign="center">{t("maintenance.title")}</Text>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <VStack gap={5} w="100%">
          <FieldWrapper label={t("maintenance.placeholder")}>
            <FormInput
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t("maintenance.placeholder")}
            />
          </FieldWrapper>

          {errorMessage && (
            <Text fontSize="sm" color="red.500" textAlign="center">
              {errorMessage}
            </Text>
          )}

          <Button
            type="submit"
            colorPalette="pink"
            size="lg"
            w="100%"
            mt={2}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("common.verify") : t("maintenance.submit")}
          </Button>
        </VStack>
      </form>
    </PageContainer>
  );
};

export default MaintenanceGatePage;
