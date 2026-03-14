import { VStack, Text, SkeletonText, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { Memory } from "../../../types";

type MemoryDataProps = {
  memory: Memory | null;
  isLoading: boolean;
};

function MemoryData({ memory, isLoading }: MemoryDataProps) {
  const { i18n } = useTranslation();
  const hasData = memory?.date || memory?.location;
  const formattedDate = memory?.date
    ? new Intl.DateTimeFormat(i18n.resolvedLanguage ?? "en", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(memory.date))
    : null;

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
            {formattedDate && <Text>📅 {formattedDate}</Text>}

            {memory?.location && <Text>📍 {memory.location}</Text>}
          </>
        </VStack>
      )}
    </Box>
  );
}

export default MemoryData;
