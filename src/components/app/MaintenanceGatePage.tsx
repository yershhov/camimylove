import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import PageContainer from "../ui/PageContainer";

type MaintenanceGatePageProps = {
  onUnlock: () => void;
};

const MaintenanceGatePage = ({ onUnlock }: MaintenanceGatePageProps) => {
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
        setErrorMessage(data.error ?? "Password non valida.");
      }
    } catch {
      setErrorMessage("Errore di connessione. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer justifyContent="center" gap={8}>
      <Text textAlign="center">Sito temporaneamente in manutenzione.</Text>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <VStack gap={5} w="100%">
          <VStack alignItems="start" gap={2} w="100%">
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
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
            {isSubmitting ? "Verifica..." : "Accedi"}
          </Button>
        </VStack>
      </form>
    </PageContainer>
  );
};

export default MaintenanceGatePage;
