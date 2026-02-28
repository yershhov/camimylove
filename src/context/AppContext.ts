import { createContext } from "react";

type AppContextValue = {
  handlePage: (newPage?: number) => void;
};

export const AppContext = createContext<AppContextValue>({
  handlePage: () => undefined,
});
