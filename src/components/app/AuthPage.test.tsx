import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import AuthPage from "./AuthPage";
import { renderWithProviders } from "../../test/test-utils";

describe("AuthPage", () => {
  beforeEach(() => {
    global.fetch = jest.fn() as typeof fetch;
  });

  it("submits the answers and calls onAuthSuccess on success", async () => {
    const user = userEvent.setup();
    const onAuthSuccess = jest.fn();
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
    } as Response);

    const { container } = renderWithProviders(<AuthPage onAuthSuccess={onAuthSuccess} />);
    const inputs = Array.from(container.querySelectorAll("input"));

    await user.type(inputs[0] as HTMLInputElement, "2024-01-01");
    await user.type(inputs[1] as HTMLInputElement, "gattina");
    await user.click(screen.getByRole("button", { name: /Entra/i }));

    await waitFor(() => expect(onAuthSuccess).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/validate-auth",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("falls back to handlePage when no onAuthSuccess callback is provided", async () => {
    const user = userEvent.setup();
    const handlePage = jest.fn();
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
    } as Response);

    const { container } = renderWithProviders(<AuthPage />, { appContext: { handlePage } });
    const inputs = Array.from(container.querySelectorAll("input"));

    await user.type(inputs[0] as HTMLInputElement, "2024-01-01");
    await user.type(inputs[1] as HTMLInputElement, "gattina");
    await user.click(screen.getByRole("button", { name: /Entra/i }));

    await waitFor(() => expect(handlePage).toHaveBeenCalledTimes(1));
  });

  it("shows the auth error message on invalid answers", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
    } as Response);

    renderWithProviders(<AuthPage />);

    await user.click(screen.getByRole("button", { name: /Entra/i }));

    expect(await screen.findByText(/Le risposte non sono corrette/i)).toBeTruthy();
  });
});
