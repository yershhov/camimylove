import { VStack, Center, Spacer, Button } from "@chakra-ui/react";
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
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const getRandomMemory = (givenMemories?: Memory[]) => {
    const memoriesList = givenMemories ?? memories;
    const id = Math.floor(Math.random() * memoriesList!.length);
    setMemory(memoriesList![id]);
    return memoriesList![id];
  };

  const handleDelayedLoadingEnd = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
        setIsFirstLoad(false);
      } catch (error: any) {
        console.error(error);
        toaster.create({
          title: "Errore, oopsie 🥺",
          type: "error",
        });
      }
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!isFirstLoad) loadNewMemory();
  }, [isFirstLoad]);

  if (isFirstLoad) {
    return (
      <Center h="100%" w="100%">
        <Loader />
      </Center>
    );
  }

  return (
    <VStack h="100%" w="100%">
      <Center h="100%" mb={24}>
        <MemoryCard
          memory={memory}
          placeName={placeName}
          isLoading={isLoading}
        />
      </Center>

      <Spacer />

      <Center w="100%">
        <Button
          colorPalette={"pink"}
          size={"2xl"}
          w="100%"
          onClick={loadNewMemory}
          mb={16}
          rounded={"16px"}
          disabled={isLoading}
        >
          <FaHeart />
          Carica un altro ricordo
        </Button>
      </Center>
    </VStack>
  );
};

export default MemoriesPage;
