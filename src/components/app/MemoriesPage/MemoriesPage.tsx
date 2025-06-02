import { VStack, Center, Button } from "@chakra-ui/react";
import Loader from "../../ui/Loader";
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

  const [isLoadingMemory, setIsLoadingMemory] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  const getRandomMemory = (givenMemories?: Memory[]) => {
    const memoriesList = givenMemories ?? memories;
    const id = Math.floor(Math.random() * memoriesList!.length);
    setMemory(memoriesList![id]);
    return memoriesList![id];
  };

  const getMemoryPlaceName = async (memory: Memory) => {
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
  }, [isFirstLoad]);

  useEffect(() => {
    if (!isFirstLoad && firstLoadDone) {
      setIsLoadingMemory(true);
      handleDelayedLoadingEnd();
    }
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
          isLoading={isLoadingMemory}
        />

        <Button
          colorPalette={"pink"}
          size={"xl"}
          w="100%"
          onClick={loadNewMemory}
          rounded={"16px"}
          disabled={isLoadingMemory}
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
