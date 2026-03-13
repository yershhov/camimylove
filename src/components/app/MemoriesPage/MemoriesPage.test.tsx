import { act, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import MemoriesPage from "./MemoriesPage";
import { renderWithProviders } from "../../../test/test-utils";

jest.mock("./MemoryCard", () => ({
  __esModule: true,
  default: ({
    memory,
    isLoading,
    loaderIndex,
  }: {
    memory: { id: number } | null;
    isLoading: boolean;
    loaderIndex: number;
  }) => (
    <div
      data-testid="memory-card"
      data-loader-index={String(loaderIndex)}
      data-loading={String(isLoading)}
    >
      {memory ? `memory-${memory.id}` : "memory-none"}
    </div>
  ),
}));

jest.mock("../../ui/Loader", () => ({
  __esModule: true,
  default: ({ animate }: { animate?: boolean }) => (
    <div data-testid={animate ? "intro-loader" : "loader"} />
  ),
}));

jest.mock("../../ui/BackHomeButton", () => ({
  __esModule: true,
  default: () => <button data-testid="back-home-button">home</button>,
}));

jest.mock("../../ui/appToaster", () => ({
  createAppToast: jest.fn(),
}));

function createRandomMemoryResponse(id: number) {
  return Promise.resolve({
    ok: true,
    json: async () => ({
      ok: true,
      memory: {
        id,
        url: `https://example.com/${id}.jpg`,
        date: "2024-01-01T00:00:00.000Z",
        location: "Rome",
      },
    }),
  } as Response);
}

describe("MemoriesPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn() as typeof fetch;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("keeps the intro pacing in legacy mode and fetches the first memory only once", async () => {
    const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
    fetchMock.mockImplementation(() => createRandomMemoryResponse(1));

    renderWithProviders(<MemoriesPage mode="legacy" />);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId("memory-card")).toBeNull();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("intro-loader")).toBeTruthy();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() =>
      expect(screen.getByTestId("memory-card").textContent).toContain("memory-1"),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("loads immediately in standalone mode without the legacy intro delay", async () => {
    const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
    fetchMock.mockImplementation(() => createRandomMemoryResponse(7));

    renderWithProviders(<MemoriesPage mode="standalone" />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByTestId("memory-card").textContent).toContain("memory-7"),
    );

    expect(screen.queryByTestId("intro-loader")).toBeNull();
    expect(screen.getByTestId("back-home-button")).toBeTruthy();
  });
});
