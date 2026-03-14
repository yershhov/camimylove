import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import SettingsPage from "./SettingsPage";
import { renderWithProviders } from "../../test/test-utils";
import { LANGUAGE_STORAGE_KEY } from "../../i18n/resources";

const createAppToast = jest.fn();

jest.mock("../ui/appToaster", () => ({
  createAppToast: (...args: unknown[]) => createAppToast(...args),
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    createAppToast.mockReset();
  });

  it("switches language and persists the explicit selection", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SettingsPage />, { language: "en" });

    expect(screen.getByText("Settings")).toBeTruthy();

    await user.selectOptions(screen.getByRole("combobox"), "it");

    await waitFor(() => expect(screen.getByText("Impostazioni")).toBeTruthy());
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("it");
    expect(createAppToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
      }),
    );
  });
});
