import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, jest } from "@jest/globals";
import React from "react";
import LegacyFlowPage from "./LegacyFlowPage";
import { AppContext } from "../../context/AppContext";
import { renderWithProviders } from "../../test/test-utils";

function createStepMock(label: string) {
  return function StepMock() {
    const { handlePage } = React.useContext(AppContext);

    return (
      <button onClick={() => handlePage()} type="button">
        {label}
      </button>
    );
  };
}

jest.mock("../ui/BackHomeButton", () => ({
  __esModule: true,
  default: () => <div data-testid="back-home-button" />,
}));

jest.mock("./WelcomePage/WelcomePage", () => ({
  __esModule: true,
  default: createStepMock("WelcomePage"),
}));

jest.mock("./QuizPage/QuizPage", () => ({
  __esModule: true,
  default: createStepMock("QuizPage"),
}));

jest.mock("./PrepPage", () => ({
  __esModule: true,
  default: createStepMock("PrepPage"),
}));

jest.mock("./MemoriesPage/MemoriesPage", () => ({
  __esModule: true,
  default: createStepMock("MemoriesPage"),
}));

jest.mock("./UploadPage", () => ({
  __esModule: true,
  default: () => <div>UploadPage</div>,
}));

describe("LegacyFlowPage", () => {
  it("keeps the user inside the guided legacy sequence", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LegacyFlowPage />);

    expect(screen.getByText("WelcomePage")).toBeTruthy();
    await user.click(screen.getByText("WelcomePage"));

    expect(screen.getByText("QuizPage")).toBeTruthy();
    await user.click(screen.getByText("QuizPage"));

    expect(screen.getByText("PrepPage")).toBeTruthy();
    await user.click(screen.getByText("PrepPage"));

    expect(screen.getByText("MemoriesPage")).toBeTruthy();
  });
});
