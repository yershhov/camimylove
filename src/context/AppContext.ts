import { createContext } from "react";

type AppContextValue = {
  handlePage: (newPage?: number) => void;
  fixedHeightEnabled: boolean;
  setFixedHeightEnabled: (enabled: boolean) => void;
};

export const AppContext = createContext<AppContextValue>({
  handlePage: () => undefined,
  fixedHeightEnabled: true,
  setFixedHeightEnabled: () => undefined,
});
