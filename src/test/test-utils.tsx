import { render, type RenderOptions } from "@testing-library/react";
import type { ContextType, ReactElement } from "react";
import { MemoryRouter, type InitialEntry } from "react-router-dom";
import { Provider } from "../components/ui/Provider";
import { AppContext } from "../context/AppContext";
import i18n, { ensureLanguageLoaded } from "../i18n";
import type { AppLanguage } from "../i18n/metadata";

type AppContextOverrides = Partial<ContextType<typeof AppContext>>;

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  appContext?: AppContextOverrides;
  initialEntries?: InitialEntry[];
  language?: AppLanguage;
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
  {
    appContext,
    initialEntries = ["/"],
    language = "en",
    ...options
  }: RenderWithProvidersOptions = {},
) {
  const contextValue = createAppContextValue(appContext);
  void ensureLanguageLoaded(language).then(() => i18n.changeLanguage(language));

  return render(
    <Provider>
      <MemoryRouter initialEntries={initialEntries}>
        <AppContext.Provider value={contextValue}>{ui}</AppContext.Provider>
      </MemoryRouter>
    </Provider>,
    options,
  );
}
