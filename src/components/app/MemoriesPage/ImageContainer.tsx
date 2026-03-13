import { Center, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { Memory } from "../../../types";
import Loader from "../../ui/Loader";

type ImageContainerProps = {
  memory: Memory | null;
  isLoading: boolean;
};

function ImageContainer({ memory, isLoading }: ImageContainerProps) {

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [memory?.url]);

  return (
    <Center
      roundedTop={"16px"}
      w="100%"
      overflow={"hidden"}
      minH={isLoading || !imageLoaded ? "400px" : "unset"}
      position="relative"
    >
      {(isLoading || !imageLoaded) && (
        <Center
          bg="white"
          position={"absolute"}
          zIndex={1}
          h="100%"
          w="100%"
          top={0}
          left={0}
        >
          <Loader />
        </Center>
      )}

      <Image
        src={memory?.url}
        borderRadius="inherit"
        objectFit={"cover"}
        onLoad={() => setImageLoaded(true)}
        w="100%"
        h="100%"
        style={{
          visibility: imageLoaded ? "visible" : "hidden",
        }}
      />
    </Center>
  );
}

export default ImageContainer;
