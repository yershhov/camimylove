import { VStack, type StackProps } from "@chakra-ui/react";

function PageContainer(props: StackProps) {
  return (
    <VStack h="100%" w="100%" flex={1} minH={0} {...props}>
      {props.children}
    </VStack>
  );
}

export default PageContainer;
