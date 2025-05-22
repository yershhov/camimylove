import { useEffect, useState } from "react";
import type { PhotoMetadata } from "./types";
import {
  Button,
  Center,
  Container,
  Image,
  Spacer,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { getPlaceName } from "./utils";
import { format } from "date-fns";

function App() {
  const [metadata, setMetadata] = useState<PhotoMetadata[] | null>(null);

  const [id, setId] = useState<number | null>(null);
  const [placeNameLoading, setPlaceNameLoading] = useState(true);
  // const [imageLoading, setImageLoading] = useState(true);

  const [placeName, setPlaceName] = useState<string | null>(null);

  const handleRandomId = () => {
    // setImageLoading(true);
    setId(Math.floor(Math.random() * metadata!.length));
  };

  const handleDelayedLoadingEnd = () => {
    setTimeout(() => {
      setPlaceNameLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetch("../public/metadata.json")
      .then((res) => res.json())
      .then((metadata) => setMetadata(metadata));
  }, []);

  useEffect(() => {
    if (metadata) handleRandomId();
  }, [metadata]);

  const memory = id ? metadata![id] : null;

  useEffect(() => {
    if (!(memory?.place?.latitude && memory?.place?.longitude)) {
      setPlaceName(null);
      return;
    }

    if (memory) {
      setPlaceNameLoading(true);

      getPlaceName(memory?.place.latitude, memory?.place?.longitude)
        .then((placeName) => {
          setPlaceName(placeName);
        })
        .catch(() => setPlaceName(null))
        .finally(() => handleDelayedLoadingEnd());
    }
  }, [memory]);

  if (!memory) return null;

  const hasData = memory?.date || placeName;

  return (
    <Container
      h="100vh"
      maxH={"100vh"}
      w="100%"
      bg="pink.50"
      color={"pink.800"}
      fontWeight={"bold"}
      p={6}
    >
      <VStack h="100%" w="100%">
        <VStack
          w="100%"
          rounded={"32px"}
          bg="white"
          p={6}
          shadow={"lg"}
          maxH={"645px"}
          minH={"500px"}
          h={placeNameLoading ? "625px" : "initial"}
        >
          {placeNameLoading && <Spinner />}

          {!placeNameLoading && (
            <>
              <Center
                roundedTop={"16px"}
                pb={hasData ? 0 : 32}
                overflow={"hidden"}
                w="100%"
              >
                <Image
                  src={memory?.url}
                  // maxH={"100%"}
                  // maxW="100%"
                  borderRadius="inherit"
                  objectFit="cover"
                  flexShrink={0}
                  // onLoad={() => setImageLoading(true)}
                />
              </Center>

              <Spacer />

              {!hasData && (
                <Text fontSize={"2xl"}>No data available unfortunately🥹</Text>
              )}

              {hasData && (
                <VStack w="100%" alignItems={"start"} fontSize={"2xl"}>
                  <>
                    {memory?.date && (
                      <Text>📆 {format(memory?.date, "dd/MM/yyyy")}</Text>
                    )}
                    {placeName && <Text>📌 {placeName}</Text>}
                  </>
                </VStack>
              )}
            </>
          )}
        </VStack>

        <Spacer />

        <Center w="100%">
          <Button
            colorPalette={"pink"}
            size={"2xl"}
            w="100%"
            onClick={handleRandomId}
            mb={16}
            rounded={"16px"}
            disabled={placeNameLoading}
            // isDisabled={imageLoading || placeNameLoading}
          >
            Carica un altro ricordo
          </Button>
        </Center>
      </VStack>
    </Container>
  );
}

export default App;
