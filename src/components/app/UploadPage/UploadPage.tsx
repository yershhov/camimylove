import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useMemo, useRef, useState } from "react";
import exifr from "exifr";
import heic2any from "heic2any";
import { IoArrowBack } from "react-icons/io5";
import PageContainer from "../../ui/PageContainer";
import { createAppToast } from "../../ui/toaster";
import { AppContext } from "../../../App";
import { getPlaceName } from "../../../utils";
import Loader from "../../ui/Loader";

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

const UploadPage = () => {
  const { handlePage, isUploadEnabled } = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const goBackToMemories = () => {
    sessionStorage.setItem("skip_memories_intro_loader", "true");
    handlePage(4);
  };

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedBlob, setSelectedBlob] = useState<Blob | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const [dateValue, setDateValue] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [dateInputKey, setDateInputKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(selectedBlob) && !isSubmitting,
    [selectedBlob, isSubmitting],
  );

  const resetForm = (keepFileInput?: boolean) => {
    if (previewUrl) {
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

      console.log("Upload metadata extracted", {
        extractedDate: extractedDate || null,
        latitude:
          typeof latitude === "number" && Number.isFinite(latitude)
            ? latitude
            : null,
        longitude:
          typeof longitude === "number" && Number.isFinite(longitude)
            ? longitude
            : null,
      });
    } catch {
      // Metadata extraction is best-effort and optional.
    }
  };

  const processFile = async (file: File) => {
    const mimeType = file.type.toLowerCase();
    console.log("mimeType", mimeType);
    const isImage = mimeType.startsWith("image/");
    if (!isImage) {
      throw new Error("Unsupported file type");
    }

    await extractExif(file);

    let blobForUpload: Blob = file;
    let targetMime = mimeType || "image/jpeg";
    let targetName = file.name;

    if (isHeicFile(file)) {
      console.log("here");
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
        description: "Puoi caricarne subito un altro.",
      });
      resetForm();
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

  if (!isUploadEnabled) {
    return (
      <PageContainer justifyContent="center" gap={5}>
        <Text textAlign="center">Upload feature is currently disabled.</Text>
        <Button colorPalette="pink" onClick={goBackToMemories}>
          Torna ai ricordi
        </Button>
      </PageContainer>
    );
  }

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
        Aggiungi un nuovo ricordo
      </Text>

      <VStack gap={4} w="100%" alignItems="stretch">
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

        {previewUrl && (
          <>
            <VStack gap={5} w="100%">
              <VStack alignItems="start" gap={2} w="100%">
                <Text fontSize="sm">Data (opzionale)</Text>
                <Input
                  key={dateInputKey}
                  type="datetime-local"
                  bg="white"
                  value={dateValue}
                  onChange={(event) => setDateValue(event.target.value)}
                />
              </VStack>

              <VStack alignItems="start" gap={2} w="100%">
                <Text fontSize="sm">Posizione (opzionale)</Text>
                <Input
                  placeholder="Es. Jesolo, Via Dante Alighieri"
                  bg="white"
                  value={locationValue}
                  onChange={(event) => setLocationValue(event.target.value)}
                />
              </VStack>
            </VStack>

            <Button
              colorPalette="pink"
              size="lg"
              onClick={handleSubmit}
              disabled={!canSubmit || isProcessingFile}
            >
              {isSubmitting ? "Caricamento..." : "Salva ricordo"}
            </Button>
          </>
        )}
      </VStack>
    </PageContainer>
  );
};

export default UploadPage;
