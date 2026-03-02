import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import PageContainer from "../ui/PageContainer";

const MAINTENANCE_ADMIN_PASSWORD = "abracadabra";

type MaintenanceGatePageProps = {
  onUnlock: () => void;
};

const MaintenanceGatePage = ({ onUnlock }: MaintenanceGatePageProps) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (password !== MAINTENANCE_ADMIN_PASSWORD) {
      setErrorMessage("Password non valida.");
      return;
    }

    onUnlock();
  };

  return (
    <PageContainer justifyContent="center" gap={8}>
      <Text textAlign="center">Sito temporaneamente in manutenzione.</Text>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <VStack gap={4}>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            bg="white"
          />

          {errorMessage && (
            <Text fontSize="sm" color="red.500" textAlign="center">
              {errorMessage}
            </Text>
          )}

          <Button type="submit" colorPalette="pink" size="lg" w="100%">
            Accedi
          </Button>
        </VStack>
      </form>
    </PageContainer>
  );
};

export default MaintenanceGatePage;
