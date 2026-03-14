import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Suspense, lazy, useContext, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiGrid,
  FiHelpCircle,
  FiLogOut,
  FiMap,
  FiSettings,
} from "react-icons/fi";
import { IoShuffle } from "react-icons/io5";
import PageContainer from "../ui/PageContainer";
import { AppContext } from "../../context/AppContext";
import { APP_NAME } from "../../i18n/metadata";

const AppleStyleConfetti = lazy(() => import("../ui/AppleStyleConfetti"));

type HomeCard = {
  id:
    | "gallery"
    | "randomMemories"
    | "upload"
    | "quiz"
    | "legacy"
    | "settings"
    | "logout";
  route?: string;
  icon: ReactNode;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
};

type HomePageProps = {
  womensDayMode?: boolean;
};

const HomePage = ({ womensDayMode = false }: HomePageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setSessionAuthenticated } = useContext(AppContext);
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

    setSessionAuthenticated(false);
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
    { id: "gallery", route: "/gallery", icon: <FiGrid /> },
    {
      id: "randomMemories",
      route: "/random-memories",
      icon: <IoShuffle />,
    },
    { id: "upload", route: "/upload", icon: <FiCamera /> },
    { id: "quiz", route: "/quiz", icon: <FiHelpCircle /> },
    { id: "legacy", route: "/legacy", icon: <FiMap /> },
    { id: "settings", route: "/settings", icon: <FiSettings /> },
    {
      id: "logout",
      icon: <FiLogOut />,
      onClick: handleLogout,
      disabled: isLoggingOut,
    },
  ];

  return (
    <PageContainer alignItems="stretch" gap={5}>
      {womensDayMode && (
        <Suspense fallback={null}>
          <AppleStyleConfetti />
        </Suspense>
      )}

      <Box>
        <Text
          fontFamily="'Dancing Script', cursive"
          fontSize={womensDayMode ? "4xl" : "5xl"}
          textAlign="center"
        >
          {womensDayMode ? t("home.womensDayTitle") : APP_NAME}
        </Text>

        {womensDayMode && (
          <Text
            fontFamily="'Dancing Script', cursive"
            fontSize={"3xl"}
            textAlign="center"
          >
            {t("home.womensDaySubtitle")}
          </Text>
        )}
      </Box>

      <VStack alignItems="stretch" gap={4} w="100%">
        {cards.map((card) => (
          <Box
            key={card.route ?? card.id}
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
                transform={card.id === "logout" ? "rotate(180deg)" : "none"}
              >
                {card.icon}
              </Box>
              <Text fontWeight="semibold">
                {card.id === "logout" && isLoggingOut
                  ? t("home.loggingOut")
                  : t(`home.cards.${card.id}`)}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>

      {womensDayMode && (
        <Text
          textAlign="center"
          fontSize="4xl"
          lineHeight={1.2}
          whiteSpace="pre-wrap"
        >
          {
            "🌹🌹               🌹🌹\n🌹💐💐🌹     🌹💐💐🌹\n🌹🌺🌺🌺🌹🌺🌺🌺🌹\n 🌹🌸🌸🌸🌸🌸🌸🌹\n🌹🌷🌷🌷🌷🌹\n🌹🌼🌼🌹\n🌹"
          }
        </Text>
      )}
    </PageContainer>
  );
};

export default HomePage;
