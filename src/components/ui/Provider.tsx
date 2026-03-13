"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type { ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
};

export function Provider(props: ProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      {props.children}
    </ChakraProvider>
  );
}
