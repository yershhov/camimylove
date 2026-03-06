import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import exifr from "exifr";
import heic2any from "heic2any";
import { IoArrowBack } from "react-icons/io5";
import PageContainer from "../../ui/PageContainer";
import Loader from "../../ui/Loader";
import { createAppToast } from "../../ui/toaster";
import { AppContext } from "../../../context/AppContext";
import { getPlaceName } from "../../../utils";
import type {
  Memory,
  RandomMemoryResponse,
  UpdateMemoryResponse,
} from "../../../types";

const ACCEPTED_FILE_TYPES =
  ".heic,.heif,.jpg,.jpeg,.png,image/heic,image/heif,image/jpeg,image/png";

function isHeicFile(file: File) {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return (
    name.endsWith(".heic") ||
    name.endsWith(".heif") ||
    type.includes("heic") ||
    type.includes("heif")
  );
}

function normalizeExifDate(value: unknown) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 16);
  }
  const asString = String(value).trim();
  if (!asString) return "";

  // EXIF often uses "YYYY:MM:DD HH:MM:SS".
  const replaced = asString.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
  const date = new Date(replaced.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

async function fileToBase64(file: Blob) {
  const arrayBuffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

type UploadPageProps = {
  mode?: "legacy" | "standalone";
  onBack?: () => void;
  variant?: "create" | "edit";
  memoryId?: number;
};

function toDateTimeLocalInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (num: number) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const UploadPage = ({
  mode = "legacy",
  onBack,
  variant = "create",
  memoryId,
}: UploadPageProps) => {
  const { handlePage, invalidateMemories } = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const goBackToMemories = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (mode === "legacy") {
      sessionStorage.setItem("skip_memories_intro_loader", "true");
      handlePage(4);
    }
  };

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedBlob, setSelectedBlob] = useState<Blob | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  const [dateValue, setDateValue] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [dateInputKey, setDateInputKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEditMemory, setIsLoadingEditMemory] = useState(false);

  const canSubmit = useMemo(
    () =>
      variant === "edit"
        ? Boolean(editingMemory) && !isSubmitting
        : Boolean(selectedBlob) && !isSubmitting,
    [editingMemory, isSubmitting, selectedBlob, variant],
  );

  const resetForm = (keepFileInput?: boolean) => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setSelectedBlob(null);
    setSelectedMimeType("");
    setSelectedFileName("");
    setDateValue("");
    setLocationValue("");
    setDateInputKey((value) => value + 1);
    if (!keepFileInput && inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    if (variant !== "edit") return;
    if (!Number.isInteger(memoryId) || (memoryId ?? -1) < 0) {
      createAppToast({
        type: "error",
        title: "Ricordo non valido",
        description: "Id ricordo non valido per la modifica.",
      });
      return;
    }

    const loadMemoryForEdit = async () => {
      try {
        setIsLoadingEditMemory(true);
        const query = new URLSearchParams({
          id: String(memoryId),
          t: String(Date.now()),
        });
        const response = await fetch(
          `/api/memories/random?${query.toString()}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Impossibile caricare il ricordo");
        }

        const payload = (await response.json()) as RandomMemoryResponse;
        if (!payload.ok || !payload.memory) {
          throw new Error(payload.error ?? "Ricordo non trovato");
        }

        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setEditingMemory(payload.memory);
        setPreviewUrl(payload.memory.url);
        setDateValue(toDateTimeLocalInput(payload.memory.date));
        setLocationValue(payload.memory.location ?? "");
        setDateInputKey((value) => value + 1);
      } catch (error) {
        createAppToast({
          type: "error",
          title: "Errore caricamento",
          description:
            error instanceof Error
              ? error.message
              : "Riprova tra qualche secondo.",
        });
      } finally {
        setIsLoadingEditMemory(false);
      }
    };

    void loadMemoryForEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoryId, variant]);

  const extractExif = async (file: File) => {
    try {
      const exifData = await exifr.parse(file, { gps: true });
      if (!exifData) return;

      const extractedDate =
        normalizeExifDate(exifData.DateTimeOriginal) ||
        normalizeExifDate(exifData.CreateDate) ||
        normalizeExifDate(exifData.ModifyDate);

      const latitude = exifData.latitude;
      const longitude = exifData.longitude;

      if (extractedDate) setDateValue(extractedDate);
      if (
        typeof latitude === "number" &&
        Number.isFinite(latitude) &&
        typeof longitude === "number" &&
        Number.isFinite(longitude)
      ) {
        try {
          const locationName = await getPlaceName(latitude, longitude);
          if (locationName) {
            setLocationValue(locationName);
          }
        } catch {
          // Keep location empty if reverse geocode fails.
        }
      }
    } catch {
      // Metadata extraction is best-effort and optional.
    }
  };

  const processFile = async (file: File) => {
    const mimeType = file.type.toLowerCase();
    const isImage = mimeType.startsWith("image/");
    if (!isImage) {
      throw new Error("Unsupported file type");
    }

    await extractExif(file);

    let blobForUpload: Blob = file;
    let targetMime = mimeType || "image/jpeg";
    let targetName = file.name;

    if (isHeicFile(file)) {
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.92,
      });
      blobForUpload = Array.isArray(converted) ? converted[0] : converted;
      targetMime = "image/jpeg";
      targetName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const localPreviewUrl = URL.createObjectURL(blobForUpload);
    setPreviewUrl(localPreviewUrl);
    setSelectedBlob(blobForUpload);
    setSelectedMimeType(targetMime);
    setSelectedFileName(targetName);
  };

  const onFileSelected = async (file: File | undefined) => {
    if (!file || isProcessingFile) return;
    resetForm(true);
    setIsDragging(false);
    setIsProcessingFile(true);
    try {
      await processFile(file);
    } catch {
      const isHeic = isHeicFile(file);
      createAppToast({
        type: "error",
        title: isHeic ? "Errore conversione HEIC" : "Formato non supportato",
        description: isHeic
          ? "Non sono riuscito a convertire questo file HEIC :( Prova a esportarlo come JPG o PNG e caricarlo di nuovo."
          : "Carica un file HEIC, JPG, JPEG o PNG.",
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleSubmit = async () => {
    if (variant === "edit") {
      if (!editingMemory) return;
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/memories/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMemory.id,
            date: dateValue ? new Date(dateValue).toISOString() : null,
            location: locationValue ? locationValue.trim() : null,
          }),
        });
        const payload = (await response.json()) as UpdateMemoryResponse;
        if (!response.ok || !payload.ok || !payload.memory) {
          throw new Error(payload.error ?? "Salvataggio fallito");
        }

        setEditingMemory(payload.memory);
        setDateValue(toDateTimeLocalInput(payload.memory.date));
        setLocationValue(payload.memory.location ?? "");
        setDateInputKey((value) => value + 1);
        invalidateMemories();
        createAppToast({
          type: "success",
          title: "Ricordo aggiornato",
          description: "Le modifiche sono state salvate.",
        });
      } catch {
        createAppToast({
          type: "error",
          title: "Aggiornamento fallito",
          description: "Riprova tra qualche secondo.",
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!selectedBlob) return;
    setIsSubmitting(true);

    try {
      const dataBase64 = await fileToBase64(selectedBlob);
      const response = await fetch("/api/memories/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFileName,
          mimeType: selectedMimeType,
          dataBase64,
          date: dateValue ? new Date(dateValue).toISOString() : null,
          location: locationValue ? locationValue.trim() : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      createAppToast({
        type: "success",
        title: "Ricordo salvato",
      });
      invalidateMemories();
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      createAppToast({
        type: "error",
        title: "Upload fallito",
        description: "Riprova tra qualche secondo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer alignItems="stretch" gap={5}>
      <HStack justifyContent="flex-start" w="100%">
        <Button
          variant="outline"
          colorPalette="pink"
          onClick={goBackToMemories}
        >
          <IoArrowBack />
          Indietro
        </Button>
      </HStack>

      <Text
        fontFamily="'Dancing Script', cursive"
        fontSize="4xl"
        textAlign="center"
      >
        {variant === "edit"
          ? "Modifica questo ricordo"
          : "Aggiungi un nuovo ricordo"}
      </Text>

      <VStack gap={4} w="100%" alignItems="stretch">
        {variant === "create" && (
          <Box
            position="relative"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor={isDragging ? "pink.500" : "pink.300"}
            rounded="16px"
            p={6}
            bg={isDragging ? "pink.50" : "white"}
            textAlign="center"
            cursor={isProcessingFile ? "not-allowed" : "pointer"}
            onClick={() => {
              if (isProcessingFile) return;
              inputRef.current?.click();
            }}
            onDragOver={(event) => {
              if (isProcessingFile) return;
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              if (isProcessingFile) return;
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(event) => {
              if (isProcessingFile) return;
              event.preventDefault();
              setIsDragging(false);
              const file = event.dataTransfer.files?.[0];
              void onFileSelected(file);
            }}
          >
            <Input
              ref={inputRef}
              type="file"
              display="none"
              accept={ACCEPTED_FILE_TYPES}
              disabled={isProcessingFile}
              onChange={(event) => {
                const file = event.target.files?.[0];
                void onFileSelected(file);
              }}
            />
            <Text fontWeight="bold">
              Trascina qui la foto o clicca per selezionare
            </Text>
            <Text mt={2} color="pink.700" fontSize="sm">
              Formati supportati: HEIC, JPG, JPEG, PNG
            </Text>

            {isProcessingFile && (
              <Center
                position="absolute"
                inset={0}
                rounded="inherit"
                bg="rgba(255,255,255,0.65)"
                backdropFilter="blur(2px)"
                zIndex={2}
              >
                <Loader fitContainer />
              </Center>
            )}
          </Box>
        )}

        {variant === "edit" && isLoadingEditMemory && (
          <Center minH="280px">
            <Spinner color="pink.500" size="lg" />
          </Center>
        )}

        {previewUrl && (
          <Box rounded="16px" overflow="hidden">
            <Image
              src={previewUrl}
              alt="Preview"
              w="100%"
              maxH="440px"
              objectFit="contain"
            />
          </Box>
        )}

        {(variant === "edit"
          ? Boolean(editingMemory)
          : Boolean(previewUrl)) && (
          <>
            <VStack gap={5} w="100%">
              <VStack alignItems="start" gap={2} w="100%">
                <Text fontSize="sm">Data (opzionale)</Text>
                <Input
                  key={dateInputKey}
                  type="datetime-local"
                  bg="white"
                  fontSize="16px"
                  value={dateValue}
                  onChange={(event) => setDateValue(event.target.value)}
                />
              </VStack>

              <VStack alignItems="start" gap={2} w="100%">
                <Text fontSize="sm">Posizione (opzionale)</Text>
                <Input
                  placeholder="Es. Jesolo, Via Dante Alighieri"
                  bg="white"
                  fontSize="16px"
                  value={locationValue}
                  onChange={(event) => setLocationValue(event.target.value)}
                />
              </VStack>
            </VStack>

            <Button
              colorPalette="pink"
              size="lg"
              onClick={handleSubmit}
              disabled={!canSubmit || isProcessingFile || isLoadingEditMemory}
            >
              {isSubmitting
                ? variant === "edit"
                  ? "Salvataggio..."
                  : "Caricamento..."
                : variant === "edit"
                  ? "Salva modifiche"
                  : "Salva ricordo"}
            </Button>
          </>
        )}
      </VStack>
    </PageContainer>
  );
};

export default UploadPage;
