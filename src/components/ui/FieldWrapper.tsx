import { Text, VStack, type StackProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type FieldWrapperProps = {
  label: string;
  children: ReactNode;
} & Omit<StackProps, "children">;

const FieldWrapper = ({ label, children, ...props }: FieldWrapperProps) => {
  return (
    <VStack alignItems="start" gap={2} w="100%" {...props}>
      <Text fontSize="sm">{label}</Text>
      {children}
    </VStack>
  );
};

export default FieldWrapper;
