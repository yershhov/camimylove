import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiGrid,
  FiHelpCircle,
  FiLogOut,
  FiMap,
  // FiSettings,
} from "react-icons/fi";
import { IoShuffle } from "react-icons/io5";
import PageContainer from "../../ui/PageContainer";

type HomeCard = {
  label: string;
  route?: string;
  icon: ReactNode;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // noop: redirect anyway so user is prompted to authenticate again.
    } finally {
      setIsLoggingOut(false);
    }

    navigate("/login", { replace: true });
  };

  const handleCardClick = (card: HomeCard) => {
    if (card.disabled) return;
    if (card.onClick) {
      void card.onClick();
      return;
    }
    if (!card.route) return;

    navigate(
      card.route,
      card.route === "/upload" ? { state: { from: "/home" } } : undefined,
    );
  };

  const cards: HomeCard[] = [
    { label: "Galleria", route: "/gallery", icon: <FiGrid /> },
    {
      label: "Ricordi casuali",
      route: "/random-memories",
      icon: <IoShuffle />,
    },
    { label: "Aggiungi ricordi", route: "/upload", icon: <FiCamera /> },
    { label: "Quiz 1# anniversario", route: "/quiz", icon: <FiHelpCircle /> },
    { label: "Ricordati com'era", route: "/legacy", icon: <FiMap /> },
    // {
    //   label: "Impostazioni",
    //   route: "/settings",
    //   icon: <FiSettings />,
    //   disabled: true,
    // },
    {
      label: "Logout",
      icon: <FiLogOut />,
      onClick: handleLogout,
      disabled: isLoggingOut,
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
            key={card.route ?? card.label}
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
              handleCardClick(card);
            }}
          >
            <HStack gap={3}>
              <Box
                color="pink.600"
                fontSize="xl"
                transform={card.label === "Logout" ? "rotate(180deg)" : "none"}
              >
                {card.icon}
              </Box>
              <Text fontWeight="semibold">
                {card.label === "Logout" && isLoggingOut
                  ? "Logging out..."
                  : card.label}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </PageContainer>
  );
};

export default HomePage;
