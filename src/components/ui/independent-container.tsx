import { VStack } from "@chakra-ui/react";

const IndependentContainer = (props: any) => {
  return (
    <VStack
      h="100%"
      w="100%"
      position="absolute"
      p={{ base: 6, md: 24 }}
      pb={36}
      {...props}
    >
      {props.children}
    </VStack>
  );
};

export default IndependentContainer;
