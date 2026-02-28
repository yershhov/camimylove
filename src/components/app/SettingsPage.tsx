import { HStack, Text, VStack } from "@chakra-ui/react";
import PageContainer from "../ui/PageContainer";
import BackHomeButton from "../ui/BackHomeButton";

const SettingsPage = () => {
  return (
    <PageContainer justifyContent="center" alignItems="stretch">
      <HStack justifyContent="flex-start" w="100%">
        <BackHomeButton />
      </HStack>

      <VStack gap={3}>
        <Text fontFamily="'Dancing Script', cursive" fontSize="4xl">
          Impostazioni
        </Text>
        <Text textAlign="center" color="pink.700">
          Pagina mock: impostazioni in arrivo.
        </Text>
      </VStack>
    </PageContainer>
  );
};

export default SettingsPage;
