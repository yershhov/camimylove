import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import GalleryPage from "./GalleryPage";
import { renderWithProviders } from "../../test/test-utils";

const navigateMock = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom") as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

jest.mock("../ui/BackHomeButton", () => ({
  __esModule: true,
  default: () => <div data-testid="back-home" />,
}));

jest.mock("./MemoriesPage/MemoryCard", () => ({
  __esModule: true,
  default: ({
    memory,
    onDelete,
    onEdit,
  }: {
    memory: { id: number };
    onDelete?: (memory: { id: number }) => void;
    onEdit?: (memory: { id: number }) => void;
  }) => (
    <div>
      <div>dialog-memory-{memory.id}</div>
      <button onClick={() => onEdit?.(memory)} type="button">
        edit-memory
      </button>
      <button onClick={() => onDelete?.(memory)} type="button">
        delete-memory
      </button>
    </div>
  ),
}));

function galleryResponse({
  memories,
  hasMore,
  nextBeforeId,
}: {
  memories: Array<{ id: number; url: string; date: string | null; location: string | null }>;
  hasMore: boolean;
  nextBeforeId: number | null;
}) {
  return Promise.resolve({
    ok: true,
    json: async () => ({
      ok: true,
      memories,
      hasMore,
      nextBeforeId,
    }),
  } as Response);
}

describe("GalleryPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    global.fetch = jest.fn() as typeof fetch;
  });

  it("loads the initial gallery page and fetches more on scroll near the bottom", async () => {
    const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
    fetchMock
      .mockImplementationOnce(() =>
        galleryResponse({
          memories: [
            { id: 3, url: "https://example.com/3.jpg", date: null, location: null },
            { id: 2, url: "https://example.com/2.jpg", date: null, location: null },
          ],
          hasMore: true,
          nextBeforeId: 2,
        }),
      )
      .mockImplementationOnce(() =>
        galleryResponse({
          memories: [
            { id: 1, url: "https://example.com/1.jpg", date: null, location: null },
          ],
          hasMore: false,
          nextBeforeId: null,
        }),
      );

    const { container } = renderWithProviders(<GalleryPage />);

    expect(await screen.findByAltText("Memory 3")).toBeTruthy();
    expect(screen.getByAltText("Memory 2")).toBeTruthy();

    const scrollArea = container.querySelector('[style*="overflow-y: auto"], [style*="overflowY: auto"]') as HTMLDivElement | null;
    const target = scrollArea ?? screen.getByText("Gallery").parentElement?.parentElement?.nextElementSibling as HTMLDivElement;
    Object.defineProperty(target, "scrollTop", { value: 900, configurable: true });
    Object.defineProperty(target, "clientHeight", { value: 400, configurable: true });
    Object.defineProperty(target, "scrollHeight", { value: 1100, configurable: true });

    fireEvent.scroll(target);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(await screen.findByAltText("Memory 1")).toBeTruthy();
  });

  it("opens a memory dialog and routes edit actions back to the gallery", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
      galleryResponse({
        memories: [
          { id: 5, url: "https://example.com/5.jpg", date: null, location: null },
        ],
        hasMore: false,
        nextBeforeId: null,
      }),
    );

    renderWithProviders(<GalleryPage />);

    await user.click(await screen.findByAltText("Memory 5"));
    expect(screen.getByText("dialog-memory-5")).toBeTruthy();

    await user.click(screen.getByText("edit-memory"));
    expect(navigateMock).toHaveBeenCalledWith("/memories/edit/5", {
      state: { from: "/gallery" },
    });
  });
});
