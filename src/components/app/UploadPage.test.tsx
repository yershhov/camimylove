import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import UploadPage from "./UploadPage";
import { renderWithProviders } from "../../test/test-utils";

jest.mock("../ui/Loader", () => ({
  __esModule: true,
  default: () => <div data-testid="loader" />,
}));

const createAppToast = jest.fn();

jest.mock("../ui/appToaster", () => ({
  createAppToast: (...args: unknown[]) => createAppToast(...args),
}));

describe("UploadPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    createAppToast.mockReset();
  });

  it("uses onBack directly in standalone mode", async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();
    const handlePage = jest.fn();

    renderWithProviders(<UploadPage mode="standalone" onBack={onBack} />, {
      appContext: { handlePage },
    });

    await user.click(screen.getByRole("button", { name: /Indietro/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(handlePage).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("skip_memories_intro_loader")).toBeNull();
  });

  it("routes back into the legacy memories step in legacy mode", async () => {
    const user = userEvent.setup();
    const handlePage = jest.fn();

    renderWithProviders(<UploadPage mode="legacy" />, {
      appContext: { handlePage },
    });

    await user.click(screen.getByRole("button", { name: /Indietro/i }));

    expect(handlePage).toHaveBeenCalledWith(4);
    expect(sessionStorage.getItem("skip_memories_intro_loader")).toBe("true");
  });
});
