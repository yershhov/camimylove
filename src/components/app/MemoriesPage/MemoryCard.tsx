import { VStack } from "@chakra-ui/react";
import ImageContainer from "./ImageContainer";
import MemoryData from "./MemoryData";

const MemoryCard = (props: any) => {
  return (
    <VStack
      w="100%"
      rounded={"32px"}
      bg="white"
      color="pink.800"
      fontWeight="bold"
      maxH={{ base: "600px", md: "1200px" }}
      p={6}
      boxShadow="4px 7px 15px rgba(213, 63, 140, 0.3)"
      className={true ? "jump" : ""}
    >
      <ImageContainer {...props} />
      <MemoryData {...props} />
    </VStack>
  );
};

export default MemoryCard;
