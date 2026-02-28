import { Center, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Loader from "../../ui/Loader";

const ImageContainer = (props: any) => {
  const { memory, isLoading } = props;

  const [imageLoaded, setImageLoaded] = useState(false);

  const [hasAlreadyMounted] = useState(
    sessionStorage.getItem("image_container_mounted"),
  );

  useEffect(() => {
    sessionStorage.setItem("image_container_mounted", "true");
  }, []);

  return (
    <Center
      roundedTop={"16px"}
      w="100%"
      overflow={"hidden"}
      minH={!hasAlreadyMounted ? "240px" : "unset"}
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
};

export default ImageContainer;
