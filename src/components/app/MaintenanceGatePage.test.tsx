import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import MaintenanceGatePage from "./MaintenanceGatePage";
import { renderWithProviders } from "../../test/test-utils";

describe("MaintenanceGatePage", () => {
  beforeEach(() => {
    global.fetch = jest.fn() as typeof fetch;
  });

  it("unlocks successfully with the correct password", async () => {
    const user = userEvent.setup();
    const onUnlock = jest.fn();
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);

    renderWithProviders(<MaintenanceGatePage onUnlock={onUnlock} />);

    await user.type(screen.getByPlaceholderText(/Admin password/i), "secret");
    await user.click(screen.getByRole("button", { name: /Accedi/i }));

    await waitFor(() => expect(onUnlock).toHaveBeenCalledTimes(1));
  });

  it("shows the API error when the password is invalid", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Password non valida." }),
    } as Response);

    renderWithProviders(<MaintenanceGatePage onUnlock={jest.fn()} />);

    await user.type(screen.getByPlaceholderText(/Admin password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /Accedi/i }));

    expect(await screen.findByText(/Password non valida/i)).toBeTruthy();
  });

  it("shows the connection error when the request fails", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
      new Error("network"),
    );

    renderWithProviders(<MaintenanceGatePage onUnlock={jest.fn()} />);

    await user.type(screen.getByPlaceholderText(/Admin password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /Accedi/i }));

    expect(await screen.findByText(/Errore di connessione/i)).toBeTruthy();
  });
});
