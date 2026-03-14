import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/AppContext";
import PageContainer from "../ui/PageContainer";

type AuthPageProps = {
  onAuthSuccess?: () => void;
};

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const { handlePage } = useContext(AppContext);
  const { t } = useTranslation();
  const [dateInput, setDateInput] = useState("");
  const [petNameInput, setPetNameInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    fetch("/api/validate-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: dateInput,
        secondInput: petNameInput,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Invalid answers");
        }
        if (onAuthSuccess) {
          onAuthSuccess();
          return;
        }
        handlePage();
      })
      .catch(() => {
        setErrorMessage(t("auth.invalidAnswers"));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <PageContainer justifyContent="center" gap={8}>
      <VStack gap={2}>
        <Text fontFamily="'Dancing Script', cursive" fontSize="5xl">
          Camimylove
        </Text>
      </VStack>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <VStack gap={5} w="100%">
          <VStack alignItems="start" gap={2} w="100%">
            <Text fontSize="sm">{t("auth.promptDate")}</Text>
            <Input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              bg="white"
              fontSize="16px"
            />
          </VStack>

          <VStack alignItems="start" gap={2} w="100%">
            <Text fontSize="sm">{t("auth.promptPetName")}</Text>
            <Input
              value={petNameInput}
              onChange={(e) => setPetNameInput(e.target.value)}
              bg="white"
              fontSize="16px"
            />
          </VStack>

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
            {isSubmitting ? t("auth.submitting") : t("auth.submit")}
          </Button>
        </VStack>
      </form>
    </PageContainer>
  );
};

export default AuthPage;
