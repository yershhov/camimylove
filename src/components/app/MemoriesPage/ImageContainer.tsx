import { Center, Image } from "@chakra-ui/react";
import Loader from "../Loader";
import { useState } from "react";

const ImageContainer = (props: any) => {
  const { memory, isLoading } = props;

  const [iamgeLoaded, setImageLoaded] = useState(false);

  return (
    <Center
      roundedTop={"16px"}
      w="100%"
      overflow={"hidden"}
      position="relative"
    >
      {(isLoading || !iamgeLoaded) && (
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
        style={{
          visibility: iamgeLoaded ? "visible" : "hidden",
        }}
      />
    </Center>
  );
};

export default ImageContainer;
