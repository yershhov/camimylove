import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import PrepPage from "./PrepPage";
import { renderWithProviders } from "../../test/test-utils";

jest.mock("react-type-animation", () => ({
  TypeAnimation: ({
    sequence,
  }: {
    sequence: Array<string | number | (() => void)>;
  }) => {
    const finish = sequence.find(
      (item): item is () => void => typeof item === "function",
    );
    return (
      <button
        onClick={() => {
          finish?.();
        }}
        type="button"
      >
        trigger typing
      </button>
    );
  },
}));

describe("PrepPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("reveals the GIF and continue button after the typing finishes", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderWithProviders(<PrepPage />);

    await user.click(screen.getByText(/trigger typing/i));

    expect(screen.getByAltText(/Christmas excitement/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Avanti/i })).toBeNull();

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByRole("button", { name: /Avanti/i })).toBeTruthy();
  });

  it("advances the flow once when continue is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const handlePage = jest.fn();

    renderWithProviders(<PrepPage />, { appContext: { handlePage } });

    await user.click(screen.getByText(/trigger typing/i));
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    await user.click(screen.getByRole("button", { name: /Avanti/i }));

    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    expect(handlePage).toHaveBeenCalledTimes(1);
  });
});
