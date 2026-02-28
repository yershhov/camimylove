import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import PageContainer from "../../ui/PageContainer";

type AuthPageProps = {
  onAuthSuccess?: () => void;
};

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const { handlePage } = useContext(AppContext);
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
        setErrorMessage("Le risposte non sono corrette. Riprova.");
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
            <Text fontSize="sm">Quando ci siamo messi insieme?</Text>
            <Input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              bg="white"
            />
          </VStack>

          <VStack alignItems="start" gap={2} w="100%">
            <Text fontSize="sm">Il primo "pet name" che abbiamo usato?</Text>
            <Input
              value={petNameInput}
              onChange={(e) => setPetNameInput(e.target.value)}
              bg="white"
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
            {isSubmitting ? "Verifica..." : "Entra"}
          </Button>
        </VStack>
      </form>
    </PageContainer>
  );
};

export default AuthPage;
