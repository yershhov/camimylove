import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiGrid,
  FiHelpCircle,
  FiMap,
  FiSettings,
} from "react-icons/fi";
import { IoShuffle } from "react-icons/io5";
import PageContainer from "../../ui/PageContainer";

type HomeCard = {
  label: string;
  route: string;
  icon: ReactNode;
  disabled?: boolean;
};

const HomePage = () => {
  const navigate = useNavigate();
  const cards: HomeCard[] = [
    { label: "Galleria", route: "/gallery", icon: <FiGrid /> },
    { label: "Ricordi casuali", route: "/random-memories", icon: <IoShuffle /> },
    { label: "Aggiungi ricordi", route: "/upload", icon: <FiCamera /> },
    { label: "Quiz 1# anniversario", route: "/quiz", icon: <FiHelpCircle /> },
    { label: "Ricordi la prima volta?", route: "/legacy", icon: <FiMap /> },
    {
      label: "Impostazioni",
      route: "/settings",
      icon: <FiSettings />,
      disabled: true,
    },
  ];

  return (
    <PageContainer alignItems="stretch" gap={5}>
      <Text
        fontFamily="'Dancing Script', cursive"
        fontSize="5xl"
        textAlign="center"
      >
        Camimylove
      </Text>

      <VStack alignItems="stretch" gap={4} w="100%">
        {cards.map((card) => (
          <Box
            key={card.route}
            bg="white"
            borderWidth="1px"
            borderColor="pink.200"
            rounded="2xl"
            px={4}
            py={5}
            shadow="sm"
            cursor={card.disabled ? "not-allowed" : "pointer"}
            opacity={card.disabled ? 0.6 : 1}
            transition="all 0.2s ease"
            _hover={{
              transform: card.disabled ? "none" : "translateY(-2px)",
              shadow: card.disabled ? "sm" : "md",
              borderColor: card.disabled ? "pink.200" : "pink.300",
            }}
            onClick={() => {
              if (card.disabled) return;
              navigate(
                card.route,
                card.route === "/upload"
                  ? { state: { from: "/home" } }
                  : undefined,
              );
            }}
          >
            <HStack gap={3}>
              <Box color="pink.600" fontSize="xl">
                {card.icon}
              </Box>
              <Text fontWeight="semibold">{card.label}</Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </PageContainer>
  );
};

export default HomePage;
