import { VStack, Center, Button } from "@chakra-ui/react";
import Loader from "../Loader";
import { useState, useEffect } from "react";
import { getPlaceName } from "../../../utils";
import { FaHeart } from "react-icons/fa";
import type { Memory } from "../../../types";
import MemoryCard from "./MemoryCard";
import { toaster } from "../../ui/toaster";

const MemoriesPage = () => {
  const [memories, setMemories] = useState<Memory[] | null>(null);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  const getRandomMemory = (givenMemories?: Memory[]) => {
    const memoriesList = givenMemories ?? memories;
    const id = Math.floor(Math.random() * memoriesList!.length);
    setMemory(memoriesList![id]);
    return memoriesList![id];
  };

  const handleDelayedLoadingEnd = (first?: boolean) => {
    setTimeout(
      () => {
        if (first) {
          setIsFirstLoad(false);
          setFirstLoadDone(true);
        } else {
          setIsLoading(false);
        }
      },
      first ? 5000 : 2000
    );
  };

  const getMemoryData = async (memory: Memory) => {
    // return new Promise((resolve) => setTimeout(resolve, 2000));
    if (memory?.place.latitude && memory?.place.longitude) {
      const placeName = await getPlaceName(
        memory?.place.latitude,
        memory?.place.longitude
      );
      setPlaceName(placeName);
    } else {
      setPlaceName(null);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/metadata.json");
        const memories = await res.json();
        setMemories(memories);

        const memory = getRandomMemory(memories);
        await getMemoryData(memory);
        handleDelayedLoadingEnd(true);
      } catch (error: any) {
        console.error(error);
        toaster.create({
          title: "Errore, oopsie 🥺",
          type: "error",
        });
      }
    };

    if (isFirstLoad) fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstLoad]);

  useEffect(() => {
    setTimeout(() => {
      setIsFirstLoad(true);
    }, 1000);
  }, []);

  const loadNewMemory = async () => {
    const memory = getRandomMemory();

    try {
      setIsLoading(true);
      await getMemoryData(memory);
    } finally {
      handleDelayedLoadingEnd();
    }
  };

  useEffect(() => {
    if (!isFirstLoad && firstLoadDone) loadNewMemory();
  }, [isFirstLoad, firstLoadDone]);

  if (isFirstLoad) {
    return (
      <Center h="100%" w="100%">
        <Loader animate />
      </Center>
    );
  }

  if (firstLoadDone) {
    return (
      <VStack
        h="100%"
        w="100%"
        // pt={12}
        pb={20}
        gap={10}
        data-state="open"
        _open={{
          animationName: "fade-in, scale-in",
          animationDuration: "1200ms",
        }}
      >
        <MemoryCard
          memory={memory}
          placeName={placeName}
          isLoading={isLoading}
        />

        <Button
          colorPalette={"pink"}
          size={"xl"}
          w="100%"
          onClick={loadNewMemory}
          rounded={"16px"}
          disabled={isLoading}
        >
          <FaHeart />
          Carica un altro ricordo
        </Button>
      </VStack>
    );
  }

  return null;
};

export default MemoriesPage;
