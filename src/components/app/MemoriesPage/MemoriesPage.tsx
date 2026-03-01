import {
  VStack,
  Center,
  Button,
  Text,
  IconButton,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect, useContext, useMemo } from "react";
import { FaHeart } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import type { Memory, RandomMemoryResponse } from "../../../types";
import MemoryCard from "./MemoryCard";
import { createAppToast } from "../../ui/toaster";
import Loader from "../../ui/Loader";
import { AppContext } from "../../../context/AppContext";
import BackHomeButton from "../../ui/BackHomeButton";

type MemoriesPageProps = {
  mode?: "legacy" | "standalone";
  onOpenUpload?: () => void;
};

const MemoriesPage = ({ mode = "legacy", onOpenUpload }: MemoriesPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handlePage } = useContext(AppContext);
  const [memory, setMemory] = useState<Memory | null>(null);

  const [isLoadingMemory, setIsLoadingMemory] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const [skipIntroLoader] = useState(false);
  const requestedMemoryId = useMemo(() => {
    const idRaw = new URLSearchParams(location.search).get("id");
    if (!idRaw) return null;
    const parsed = Number(idRaw);
    if (!Number.isInteger(parsed) || parsed < 0) return null;
    return parsed;
  }, [location.search]);

  const handleDelayedLoadingEnd = (first?: boolean) => {
    setTimeout(
      () => {
        if (first) {
          setIsFirstLoad(false);
          setFirstLoadDone(true);
        } else {
          setIsLoadingMemory(false);
        }
      },
      first ? 5000 : 2000,
    );
  };

  const fetchRandomMemory = async () => {
    const query =
      requestedMemoryId !== null ? `?id=${String(requestedMemoryId)}` : "";
    const response = await fetch(`/api/memories/random${query}`);
    if (!response.ok) {
      throw new Error("Failed to fetch random memory");
    }

    const payload = (await response.json()) as RandomMemoryResponse;
    if (!payload.ok || !payload.memory) {
      throw new Error(payload.error ?? "No memory returned");
    }
    return payload.memory as Memory;
  };

  const loadNewMemory = async () => {
    try {
      setIsLoadingMemory(true);
      const newMemory = await fetchRandomMemory();
      setMemory(newMemory);
    } finally {
      handleDelayedLoadingEnd();
    }
  };

  const handleDeleteMemory = async (_memory: Memory) => {
    await loadNewMemory();
  };

  const handleEditMemory = (memoryToEdit: Memory) => {
    navigate(`/memories/edit/${memoryToEdit.id}`, {
      state: { from: "/random-memories" },
    });
  };

  useEffect(() => {
    // const shouldSkipIntro =
    //   sessionStorage.getItem("skip_memories_intro_loader") === "true";

    // if (shouldSkipIntro) {
    //   sessionStorage.removeItem("skip_memories_intro_loader");
    //   setSkipIntroLoader(true);
    //   setIsFirstLoad(true);
    //   return;
    // }

    setTimeout(() => {
      setIsFirstLoad(true);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const initialMemory = await fetchRandomMemory();
        setMemory(initialMemory);
      } catch (error: any) {
        console.error(error);
        createAppToast({
          title: "Errore, oopsie :(",
          type: "error",
        });
      } finally {
        handleDelayedLoadingEnd(true);
      }
    };

    if (isFirstLoad) fetchInitialData();
  }, [isFirstLoad, skipIntroLoader, requestedMemoryId]);

  useEffect(() => {
    if (!isFirstLoad && firstLoadDone) {
      setIsLoadingMemory(true);
      handleDelayedLoadingEnd();
    }
  }, [isFirstLoad, firstLoadDone]);

  return (
    <Center h="100%" w="100%" flex={1}>
      {isFirstLoad && !skipIntroLoader && <Loader animate />}

      {firstLoadDone && (
        <Box h="100%" w="100%" position="relative">
          <VStack
            h="100%"
            w="100%"
            pb={20}
            data-state="open"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "1200ms",
            }}
          >
            {mode === "standalone" && (
              <HStack justifyContent="flex-start" w="100%">
                <BackHomeButton />
              </HStack>
            )}

            <Text fontFamily="'Dancing Script', cursive" fontSize={"4xl"}>
              Nostri ricordi
            </Text>

            <MemoryCard
              memory={memory}
              isLoading={isLoadingMemory}
              onDelete={handleDeleteMemory}
              onEdit={handleEditMemory}
            />

            <Button
              colorPalette={"pink"}
              size={"xl"}
              w="100%"
              onClick={loadNewMemory}
              rounded={"16px"}
              disabled={isLoadingMemory}
              mt={6}
            >
              <FaHeart />
              Carica un altro ricordo
            </Button>
          </VStack>
          <IconButton
            aria-label="Apri pagina upload"
            rounded="full"
            size="xl"
            colorPalette="pink"
            position="fixed"
            right={{ base: 6, md: 12 }}
            bottom={{ base: 8, md: 12 }}
            shadow="lg"
            onClick={() => {
              if (onOpenUpload) {
                onOpenUpload();
                return;
              }
              if (mode === "legacy") {
                handlePage(5);
              }
            }}
          >
            <IoAdd />
          </IconButton>
        </Box>
      )}
    </Center>
  );
};

export default MemoriesPage;
