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
    act(() => {
      jest.runOnlyPendingTimers();
    });
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

  it("fetches immediately in standalone mode but keeps the memory reveal delay", async () => {
    const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
    const response = await createRandomMemoryResponse(7);
    let resolveFetch: (value: Response) => void = () => undefined;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    fetchMock.mockReturnValue(fetchPromise);

    renderWithProviders(<MemoriesPage mode="standalone" />);

    await act(async () => {});

    expect(fetchMock).toHaveBeenCalled();
    expect(screen.queryByTestId("intro-loader")).toBeNull();
    expect(screen.getByTestId("back-home-button")).toBeTruthy();
    expect(screen.getByTestId("memory-card").getAttribute("data-loading")).toBe(
      "true",
    );

    await act(async () => {
      resolveFetch(response);
      await fetchPromise;
    });

    expect(screen.getByTestId("memory-card").textContent).toContain("memory-7");
    expect(screen.getByTestId("memory-card").getAttribute("data-loading")).toBe(
      "true",
    );

    await act(async () => {
      jest.advanceTimersByTime(1999);
    });

    expect(screen.getByTestId("memory-card").getAttribute("data-loading")).toBe(
      "true",
    );

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.getByTestId("memory-card").getAttribute("data-loading")).toBe(
      "false",
    );
  });
});
