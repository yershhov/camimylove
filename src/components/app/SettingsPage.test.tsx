import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "@jest/globals";
import SettingsPage from "./SettingsPage";
import { renderWithProviders } from "../../test/test-utils";
import { LANGUAGE_STORAGE_KEY } from "../../i18n/resources";

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: () => undefined,
    });
  });

  it("switches language and persists the explicit selection", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SettingsPage />, { language: "en" });

    expect(screen.getByText("Settings")).toBeTruthy();

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Italiano" }));

    await waitFor(() => expect(screen.getByText("Impostazioni")).toBeTruthy());
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("it");
  });
});
