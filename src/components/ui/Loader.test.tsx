import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Provider } from "./Provider";
import Loader from "./Loader";

function renderLoader(ui: React.ReactElement) {
  return render(<Provider>{ui}</Provider>);
}

describe("Loader", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("uses a stable loader image when loaderIndex is provided", () => {
    renderLoader(<Loader loaderIndex={0} />);

    const image = screen.getByRole("img");
    expect(image.getAttribute("src")).toContain("aMOxt0o16TQ");
  });

  it("transitions its animated state after the intro delay", () => {
    const { container } = renderLoader(<Loader animate />);
    const root = container.firstChild as HTMLElement;

    expect(root.getAttribute("data-state")).toBe("open");
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(root.getAttribute("data-state")).toBe("closed");
  });
});
