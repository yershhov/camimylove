import {
  AspectRatio,
  Box,
  Dialog,
  HStack,
  IconButton,
  Image,
  Portal,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import PageContainer from "../ui/PageContainer";
import BackHomeButton from "../ui/BackHomeButton";
import type { GalleryMemoriesResponse, Memory } from "../../types";
import MemoryCard from "./MemoriesPage/MemoryCard";
import { AppContext } from "../../context/AppContext";

const GalleryPage = () => {
  const navigate = useNavigate();
  const { memoriesVersion } = useContext(AppContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const noFocusRef = useRef<HTMLDivElement>(null);

  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextBeforeId, setNextBeforeId] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const canLoadMore = useMemo(
    () =>
      hasMore && !isInitialLoading && !isLoadingMore && nextBeforeId !== null,
    [hasMore, isInitialLoading, isLoadingMore, nextBeforeId],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setSelectedMemory(null);
        setIsDeleteConfirmOpen(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const fetchGallerySlice = async (params?: {
    beforeId?: number | null;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    query.set("limit", String(params?.limit ?? 40));
    if (params?.beforeId) {
      query.set("beforeId", String(params.beforeId));
    }

    const response = await fetch(`/api/memories/gallery?${query.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to load gallery memories");
    }

    const payload = (await response.json()) as GalleryMemoriesResponse;
    if (!payload.ok) {
      throw new Error(payload.error ?? "Gallery API returned error");
    }

    return {
      memoriesDesc: payload.memories ?? [],
      hasMore: Boolean(payload.hasMore),
      nextBeforeId: payload.nextBeforeId ?? null,
    };
  };

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setIsInitialLoading(true);
        const result = await fetchGallerySlice({ limit: 40 });
        if (!mountedRef.current) return;

        setMemories(result.memoriesDesc);
        setSelectedMemory((current) => {
          if (!current) return current;
          return result.memoriesDesc.find((item) => item.id === current.id) ?? null;
        });
        setHasMore(result.hasMore);
        setNextBeforeId(result.nextBeforeId);
      } catch (error) {
        console.error(error);
      } finally {
        if (mountedRef.current) {
          setIsInitialLoading(false);
        }
      }
    };

    void loadInitial();
  }, [memoriesVersion]);

  const loadOlderMemories = async () => {
    if (!canLoadMore) return;
    setIsLoadingMore(true);

    try {
      const result = await fetchGallerySlice({
        beforeId: nextBeforeId,
        limit: 40,
      });
      if (!mountedRef.current) return;
      setMemories((prev) => [...prev, ...result.memoriesDesc]);
      setHasMore(result.hasMore);
      setNextBeforeId(result.nextBeforeId);
    } catch (error) {
      console.error(error);
    } finally {
      if (mountedRef.current) {
        setIsLoadingMore(false);
      }
    }
  };

  const handleDeleteMemory = async (memoryToDelete: Memory) => {
    setMemories((prev) =>
      prev.filter((memory) => memory.id !== memoryToDelete.id),
    );
    setSelectedMemory((current) =>
      current?.id === memoryToDelete.id ? null : current,
    );
    setIsDeleteConfirmOpen(false);
  };

  const handleEditMemory = (memoryToEdit: Memory) => {
    navigate(`/memories/edit/${memoryToEdit.id}`, {
      state: { from: "/gallery" },
    });
  };

  return (
    <PageContainer
      alignItems="stretch"
      gap={4}
      h="100%"
      minH={0}
      overflow="hidden"
    >
      <Box position="sticky" top={0} zIndex={2} bg="pink.100">
        <HStack justifyContent="space-between" w="100%">
          <BackHomeButton iconOnly />
          <Text
            fontFamily="'Dancing Script', cursive"
            fontSize="4xl"
            textAlign="center"
          >
            Galleria
          </Text>
          <IconButton
            aria-label="Apri pagina upload"
            colorPalette="pink"
            rounded="full"
            onClick={() => navigate("/upload", { state: { from: "/gallery" } })}
          >
            <IoAdd />
          </IconButton>
        </HStack>
      </Box>

      <Box
        ref={scrollRef}
        flex={1}
        minH={0}
        overflowY="auto"
        pr={1}
        onScroll={() => {
          const element = scrollRef.current;
          if (!element) return;
          if (!canLoadMore) return;
          if (
            element.scrollTop + element.clientHeight >=
            element.scrollHeight - 240
          ) {
            void loadOlderMemories();
          }
        }}
      >
        {isInitialLoading ? (
          <VStack h="100%" justifyContent="center">
            <Spinner color="pink.500" size="lg" />
          </VStack>
        ) : (
          <VStack alignItems="stretch" gap={0}>
            <SimpleGrid columns={3} gap={0.5} pb={1}>
              {memories.map((memory) => (
                <AspectRatio key={memory.id} ratio={1}>
                  <Box
                    as="button"
                    w="100%"
                    h="100%"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => setSelectedMemory(memory)}
                  >
                    <Image
                      src={memory.url}
                      alt={`Ricordo ${memory.id}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </Box>
                </AspectRatio>
              ))}
            </SimpleGrid>
            {isLoadingMore && (
              <HStack justifyContent="center" py={1}>
                <Spinner color="pink.500" size="sm" />
              </HStack>
            )}
          </VStack>
        )}
      </Box>

      <Dialog.Root
        open={Boolean(selectedMemory)}
        closeOnInteractOutside={!isDeleteConfirmOpen}
        initialFocusEl={() => noFocusRef.current}
        onOpenChange={(event) => {
          if (!event.open) {
            setSelectedMemory(null);
            setIsDeleteConfirmOpen(false);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner mt={6}>
            <Dialog.Content
              bg="transparent"
              shadow="none"
              maxW={{ base: "95vw", md: "640px" }}
              overflow="visible"
              position="relative"
            >
              <Dialog.Body p={0}>
                <div
                  ref={noFocusRef}
                  tabIndex={-1}
                  style={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                  aria-hidden
                />
                {selectedMemory && (
                  <MemoryCard
                    memory={selectedMemory}
                    isLoading={false}
                    isDialog
                    onDelete={handleDeleteMemory}
                    onEdit={handleEditMemory}
                    onClose={() => setSelectedMemory(null)}
                    onDeleteDialogOpenChange={setIsDeleteConfirmOpen}
                  />
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </PageContainer>
  );
};

export default GalleryPage;
