import { VStack, Text, SkeletonText, Box } from "@chakra-ui/react";
import { format } from "date-fns";

const MemoryData = (props: any) => {
  const { memory, isLoading, placeName } = props;

  const hasData = memory?.date || placeName;

  if (isLoading) {
    return <SkeletonText noOfLines={3} gap={4} background={"pink.200"} />;
  }

  return (
    <>
      {!hasData && <Box h="64px" />}

      {hasData && (
        <VStack w="100%" alignItems={"start"} fontSize={"2xl"} ml={1}>
          <>
            {memory?.date && (
              <Text>📅 {format(memory?.date, "dd/MM/yyyy, HH:mm")}</Text>
            )}

            {placeName && <Text>📍 {placeName}</Text>}
          </>
        </VStack>
      )}
    </>
  );
};

export default MemoryData;
