import { VStack, Center, Button, Text, Box, HStack } from "@chakra-ui/react";
import {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import type { Memory, RandomMemoryResponse } from "../../../types";
import MemoryCard from "./MemoryCard";
import { createAppToast } from "../../ui/appToaster";
import Loader from "../../ui/Loader";
import { AppContext } from "../../../context/AppContext";
import BackHomeButton from "../../ui/BackHomeButton";
import { getRandomLoaderIndex } from "../../ui/loader-options";

type MemoriesPageProps = {
  mode?: "legacy" | "standalone";
};

const MemoriesPage = ({ mode = "legacy" }: MemoriesPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { memoriesChangeToken } = useContext(AppContext);
  const isStandaloneMode = mode === "standalone";
  const [memory, setMemory] = useState<Memory | null>(null);
  const [memoryLoaderIndex, setMemoryLoaderIndex] = useState(() =>
    getRandomLoaderIndex(),
  );
  const skipNextRefreshRef = useRef(!isStandaloneMode);

  const [isLoadingMemory, setIsLoadingMemory] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(isStandaloneMode);
  const skipIntroLoader = isStandaloneMode;
  const requestedMemoryId = useMemo(() => {
    const idRaw = new URLSearchParams(location.search).get("id");
    if (!idRaw) return null;
    const parsed = Number(idRaw);
    if (!Number.isInteger(parsed) || parsed < 0) return null;
    return parsed;
  }, [location.search]);

  const handleDelayedLoadingEnd = useCallback((first?: boolean) => {
    if (isStandaloneMode) {
      if (first) {
        setIsFirstLoad(false);
        setFirstLoadDone(true);
      } else {
        setIsLoadingMemory(false);
      }
      return;
    }

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
  }, [isStandaloneMode]);

  const fetchRandomMemory = useCallback(async () => {
    const query = new URLSearchParams();
    if (requestedMemoryId !== null) {
      query.set("id", String(requestedMemoryId));
    }

    const queryString = query.toString();
    const response = await fetch(
      queryString ? `/api/memories/random?${queryString}` : "/api/memories/random",
    );
    if (!response.ok) {
      throw new Error("Failed to fetch random memory");
    }

    const payload = (await response.json()) as RandomMemoryResponse;
    if (!payload.ok || !payload.memory) {
      throw new Error(payload.error ?? "No memory returned");
    }

    return payload.memory as Memory;
  }, [requestedMemoryId]);

  const loadNewMemory = async () => {
    try {
      setMemoryLoaderIndex((currentIndex) => getRandomLoaderIndex(currentIndex));
      setIsLoadingMemory(true);
      const newMemory = await fetchRandomMemory();
      setMemory(newMemory);
    } finally {
      handleDelayedLoadingEnd();
    }
  };

  const handleDeleteMemory = async (deletedMemory: Memory) => {
    if (memory?.id === deletedMemory.id) {
      setMemory(null);
    }
    await loadNewMemory();
  };

  const handleEditMemory = (memoryToEdit: Memory) => {
    navigate(`/memories/edit/${memoryToEdit.id}`, {
      state: { from: "/random-memories" },
    });
  };

  useEffect(() => {
    if (skipIntroLoader) return;

    setTimeout(() => {
      setIsFirstLoad(true);
    }, 1000);
  }, [skipIntroLoader]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setMemoryLoaderIndex((currentIndex) => getRandomLoaderIndex(currentIndex));
        const initialMemory = await fetchRandomMemory();
        setMemory(initialMemory);
      } catch (error: unknown) {
        console.error(error);
        createAppToast({
          title: t("memories.loadError"),
          type: "error",
        });
      } finally {
        handleDelayedLoadingEnd(true);
      }
    };

    if (!skipIntroLoader && isFirstLoad) fetchInitialData();
  }, [fetchRandomMemory, handleDelayedLoadingEnd, isFirstLoad, skipIntroLoader, t]);

  useEffect(() => {
    if (!firstLoadDone) return;

    if (skipNextRefreshRef.current) {
      skipNextRefreshRef.current = false;
      return;
    }

    const refreshCurrentMemory = async () => {
      try {
        setMemoryLoaderIndex((currentIndex) => getRandomLoaderIndex(currentIndex));
        setIsLoadingMemory(true);
        const currentMemory = await fetchRandomMemory();
        setMemory(currentMemory);
      } catch (error: unknown) {
        console.error(error);
        createAppToast({
          title: t("memories.loadError"),
          type: "error",
        });
      } finally {
        handleDelayedLoadingEnd();
      }
    };

    void refreshCurrentMemory();
  }, [fetchRandomMemory, firstLoadDone, handleDelayedLoadingEnd, memoriesChangeToken, t]);

  useEffect(() => {
    if (isStandaloneMode) return;

    if (!isFirstLoad && firstLoadDone) {
      setIsLoadingMemory(true);
      handleDelayedLoadingEnd();
    }
  }, [firstLoadDone, handleDelayedLoadingEnd, isFirstLoad, isStandaloneMode]);

  return (
    <Center h="100%" w="100%" flex={1}>
      {isFirstLoad && !skipIntroLoader && (
        <Box position={"relative"} bottom={"5%"}>
          <Loader animate />
        </Box>
      )}

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
              {t("memories.title")}
            </Text>

            <MemoryCard
              memory={memory}
              isLoading={isLoadingMemory}
              loaderIndex={memoryLoaderIndex}
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
              {t("memories.next")}
            </Button>
          </VStack>
        </Box>
      )}
    </Center>
  );
};

export default MemoriesPage;
