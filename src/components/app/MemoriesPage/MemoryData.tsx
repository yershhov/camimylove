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
    <Box w="100%" ml={2}>
      {!hasData && <Box h="32px" />}

      {hasData && (
        <VStack w="100%" alignItems={"start"} fontSize={"xl"} lineHeight={1.5}>
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
