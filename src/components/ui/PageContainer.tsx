import { VStack } from "@chakra-ui/react";

const PageContainer = (props: any) => {
  return (
    <VStack h="100%" w="100%" flex={1} minH={0} {...props}>
      {props.children}
    </VStack>
  );
};

export default PageContainer;
