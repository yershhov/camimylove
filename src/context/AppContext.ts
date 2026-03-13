import { createContext } from "react";

type AppContextValue = {
  handlePage: (newPage?: number) => void;
  fixedHeightEnabled: boolean;
  setFixedHeightEnabled: (enabled: boolean) => void;
  memoriesChangeToken: number;
  notifyMemoriesChanged: () => void;
  sessionAuthenticated: boolean;
  setSessionAuthenticated: (authenticated: boolean) => void;
};

export const AppContext = createContext<AppContextValue>({
  handlePage: () => undefined,
  fixedHeightEnabled: true,
  setFixedHeightEnabled: () => undefined,
  memoriesChangeToken: 0,
  notifyMemoriesChanged: () => undefined,
  sessionAuthenticated: false,
  setSessionAuthenticated: () => undefined,
});
