import { VStack } from "@chakra-ui/react";
import ImageContainer from "./ImageContainer";
import MemoryData from "./MemoryData";

const MemoryCard = (props: any) => {
  return (
    <VStack
      w="100%"
      rounded={"32px"}
      bg="white"
      maxH="640px"
      p={6}
      boxShadow="4px 9px 20px rgba(213, 63, 140, 0.3)"
    >
      <ImageContainer {...props} />
      <MemoryData {...props} />
    </VStack>
  );
};

export default MemoryCard;
