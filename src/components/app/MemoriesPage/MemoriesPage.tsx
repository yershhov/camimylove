import { VStack, Center, Button, Text } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { getPlaceName } from "../../../utils";
import { FaHeart } from "react-icons/fa";
import type { Memory } from "../../../types";
import MemoryCard from "./MemoryCard";
import { toaster } from "../../ui/toaster";
import Loader from "../../ui/Loader";
import { AppContext } from "../../../App";

const MemoriesPage = () => {
  const { setShowSettings } = useContext(AppContext);

  const [memories, setMemories] = useState<Memory[] | null>(null);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);

  const [isLoadingMemory, setIsLoadingMemory] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  // const [recentIds, setRecentIds] = useState<number[]>([]);

  const getRandomMemory = (givenMemories?: Memory[]) => {
    // const memoriesList = givenMemories ?? memories;

    // const available = memoriesList!.filter((m) => !recentIds.includes(m.id));
    // const pickFrom = available.length > 0 ? available : memoriesList!;

    // const index = Math.floor(Math.random() * pickFrom.length);
    // const picked = pickFrom[index];
    // setMemory(picked);
    // setRecentIds((prev) => {
    //   const next = [...prev, picked.id];
    //   return next.length > 30 ? next.slice(next.length - 30) : next;
    // });

    // return picked;
    const memoriesList = givenMemories ?? memories;
    const index = Math.floor(Math.random() * memoriesList!.length);
    setMemory(memoriesList![index]);
    return memoriesList![index];
  };

  const getMemoryPlaceName = async (memory: Memory) => {
    if (!memory?.place.latitude || !memory?.place.longitude) {
      setPlaceName(null);
      return;
    }

    try {
      const placeName = await getPlaceName(
        memory?.place.latitude,
        memory?.place.longitude
      );
      setPlaceName(placeName);
    } catch (_) {
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
