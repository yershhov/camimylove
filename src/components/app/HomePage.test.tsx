import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import HomePage from "./HomePage";
import { renderWithProviders } from "../../test/test-utils";

const navigateMock = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom") as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

jest.mock("../ui/AppleStyleConfetti", () => ({
  __esModule: true,
  default: () => <div data-testid="womens-day-confetti" />,
}));

describe("HomePage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    global.fetch = jest.fn() as typeof fetch;
  });

  it("shows the Women's Day variant and confetti when enabled", async () => {
    renderWithProviders(<HomePage womensDayMode />);

    expect(screen.getByText(/Happy Women's Day, Baby!/i)).toBeTruthy();
    expect(screen.getByText(/And Happy Monthiversary/i)).toBeTruthy();
    expect(await screen.findByTestId("womens-day-confetti")).toBeTruthy();
  });

  it("navigates to upload with the expected origin state", async () => {
    const user = userEvent.setup();

    renderWithProviders(<HomePage />);

    await user.click(screen.getByText(/Add memories/i));

    expect(navigateMock).toHaveBeenCalledWith("/upload", {
      state: { from: "/home" },
    });
  });

  it("logs out, clears session auth, and redirects to login", async () => {
    const user = userEvent.setup();
    const setSessionAuthenticated = jest.fn();
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
    } as Response);

    renderWithProviders(<HomePage />, { appContext: { setSessionAuthenticated } });

    await user.click(screen.getByText(/^Logout$/i));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/logout", { method: "POST" }),
    );
    expect(setSessionAuthenticated).toHaveBeenCalledWith(false);
    expect(navigateMock).toHaveBeenCalledWith("/login", { replace: true });
  });
});
