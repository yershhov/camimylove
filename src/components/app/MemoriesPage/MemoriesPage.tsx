import { VStack, Center, Button, Text } from "@chakra-ui/react";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { getPlaceName } from "../../../utils";
import { FaHeart } from "react-icons/fa";
import type { Memory } from "../../../types";
import MemoryCard from "./MemoryCard";
import { toaster } from "../../ui/toaster";
import Loader from "../../ui/Loader";
import { AppContext } from "../../../App";

const RECENTS_LIMIT = 50;

const MemoriesPage = () => {
  const { setShowSettings } = useContext(AppContext);

  const [memories, setMemories] = useState<Memory[] | null>(null);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);

  const [isLoadingMemory, setIsLoadingMemory] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  function getInitialRecents() {
    try {
      const data = localStorage.getItem("recents");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  const recentsRef = useRef<number[]>(getInitialRecents());

  const getRandomMemory = useCallback(
    (givenMemories?: Memory[]) => {
      const memoriesList = givenMemories ?? memories!;
      const limit = Math.min(RECENTS_LIMIT, memoriesList.length);

      const recent = recentsRef.current.slice(-limit);
      const recentSet = new Set(recent);

      const available: number[] = [];
      for (let i = 0; i < memoriesList.length; i++) {
        if (!recentSet.has(i)) available.push(i);
      }

      const pickFrom =
        available.length > 0
          ? available
          : Array.from({ length: memoriesList.length }, (_, i) => i);

      const idx = pickFrom[Math.floor(Math.random() * pickFrom.length)];
      recentsRef.current.push(idx);

      if (recentsRef.current.length > RECENTS_LIMIT) {
        recentsRef.current.splice(0, recentsRef.current.length - RECENTS_LIMIT);
      }

      localStorage.setItem("recents", JSON.stringify(recentsRef.current));

      console.log(recentsRef.current);
      setMemory(memoriesList[idx]);
      return memoriesList[idx];
    },
    [memories]
  );

  const getMemoryPlaceName = async (memory: Memory) => {
    console.log(memory.id);
    if (!memory?.place.latitude || !memory?.place.longitude) {
      setPlaceName(null);
      console.log("---");
      return;
    }

    try {
      const placeName = await getPlaceName(
        memory?.place.latitude,
        memory?.place.longitude
      );
      setPlaceName(placeName);
    } catch (err: any) {
      console.error(err);
      setPlaceName(null);
    }
  };

  const handleDelayedLoadingEnd = (first?: boolean) => {
    setTimeout(
      () => {
        if (first) {
          setIsFirstLoad(false);
          setFirstLoadDone(true);
        } else {
          setShowSettings(true);
          localStorage.setItem("show_settings", "true");

          setIsLoadingMemory(false);
        }
      },
      first ? 5000 : 2000
    );
  };

  const loadNewMemory = async () => {
    const memory = getRandomMemory();
    try {
      setIsLoadingMemory(true);
      await getMemoryPlaceName(memory);
    } finally {
      handleDelayedLoadingEnd();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsFirstLoad(true);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/metadata.json");
        const memories = await res.json();
        setMemories(memories);

        const memory = getRandomMemory(memories);

        await getMemoryPlaceName(memory);
      } catch (error: any) {
        console.error(error);
        toaster.create({
          title: "Errore, oopsie :(",
          type: "error",
        });
      } finally {
        handleDelayedLoadingEnd(true);
      }
    };

    if (isFirstLoad) fetchInitialData();
  }, [isFirstLoad]);

  useEffect(() => {
    if (!isFirstLoad && firstLoadDone) {
      setIsLoadingMemory(true);
      handleDelayedLoadingEnd();
    }
  }, [isFirstLoad, firstLoadDone]);

  return (
    <Center h="100%" w="100%" flex={1}>
      {isFirstLoad && <Loader animate />}

      {firstLoadDone && (
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
          <Text fontFamily="'Dancing Script', cursive" fontSize={"4xl"}>
            Nostri ricordi
          </Text>

          <MemoryCard
            memory={memory}
            placeName={placeName}
            isLoading={isLoadingMemory}
          />

          <Button
            colorPalette={"pink"}
            size={"xl"}
            w="100%"
            onClick={loadNewMemory}
            rounded={"16px"}
            disabled={isLoadingMemory}
            mt={10}
          >
            <FaHeart />
            Carica un altro ricordo
          </Button>
        </VStack>
      )}
    </Center>
  );
};

export default MemoriesPage;
