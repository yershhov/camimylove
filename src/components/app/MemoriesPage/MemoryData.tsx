import { VStack, Text, SkeletonText, Box } from "@chakra-ui/react";
import { format } from "date-fns";

const MemoryData = (props: any) => {
  const { memory, isLoading } = props;

  const hasData = memory?.date || memory?.location;

  if (isLoading) {
    return (
      <SkeletonText noOfLines={3} gap={4} background={"pink.200"} height={5} />
    );
  }

  return (
    <Box w="100%" ml={2} pt={4} minH={"64px"}>
      {!hasData && <Box h="64px" />}

      {hasData && (
        <VStack w="100%" alignItems={"start"} fontSize={"xl"}>
          <>
            {memory?.date && (
              <Text>📅 {format(memory?.date, "dd/MM/yyyy, HH:mm")}</Text>
            )}

            {memory?.location && <Text>📍 {memory.location}</Text>}
          </>
        </VStack>
      )}
    </Box>
  );
};

export default MemoryData;
