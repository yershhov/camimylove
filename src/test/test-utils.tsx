import { render, type RenderOptions } from "@testing-library/react";
import type { ContextType, ReactElement } from "react";
import { MemoryRouter, type InitialEntry } from "react-router-dom";
import { Provider } from "../components/ui/Provider";
import { AppContext } from "../context/AppContext";

type AppContextOverrides = Partial<ContextType<typeof AppContext>>;

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  appContext?: AppContextOverrides;
  initialEntries?: InitialEntry[];
};

export function createAppContextValue(
  overrides: AppContextOverrides = {},
): ContextType<typeof AppContext> {
  return {
    handlePage: () => undefined,
    fixedHeightEnabled: true,
    setFixedHeightEnabled: () => undefined,
    memoriesChangeToken: 0,
    notifyMemoriesChanged: () => undefined,
    sessionAuthenticated: true,
    setSessionAuthenticated: () => undefined,
    ...overrides,
  };
}

export function renderWithProviders(
  ui: ReactElement,
  { appContext, initialEntries = ["/"], ...options }: RenderWithProvidersOptions = {},
) {
  const contextValue = createAppContextValue(appContext);

  return render(
    <Provider>
      <MemoryRouter initialEntries={initialEntries}>
        <AppContext.Provider value={contextValue}>{ui}</AppContext.Provider>
      </MemoryRouter>
    </Provider>,
    options,
  );
}
