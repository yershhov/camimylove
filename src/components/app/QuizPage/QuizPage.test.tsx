import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import QuizPage from "./QuizPage";
import { renderWithProviders } from "../../../test/test-utils";

jest.mock("./PinField", () => ({
  __esModule: true,
  default: ({
    label,
    name,
    value,
    handleChange,
  }: {
    label: string;
    name: string;
    value?: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        name={name}
        value={value ?? ""}
        onChange={handleChange}
      />
    </label>
  ),
}));

jest.mock("./QuizPageTypeWriter", () => ({
  __esModule: true,
  default: ({
    setFinishedRows,
  }: {
    setFinishedRows: (value: number) => void;
  }) => (
    <button onClick={() => setFinishedRows(1)} type="button">
      Finish typing
    </button>
  ),
}));

jest.mock("../../ui/BackHomeButton", () => ({
  __esModule: true,
  default: () => <button data-testid="back-home-button">home</button>,
}));

jest.mock("../../ui/AppleStyleConfetti", () => ({
  __esModule: true,
  default: () => <div data-testid="confetti" />,
}));

const createAppToast = jest.fn();
const toasterRemove = jest.fn();

jest.mock("../../ui/appToaster", () => ({
  createAppToast: (...args: unknown[]) => createAppToast(...args),
  toaster: {
    remove: (...args: unknown[]) => toasterRemove(...args),
  },
}));

const answersByLabel = [
  [/Il primo nomignolo/i, "POLITOS"],
  [/Il secondo invece/i, "GATITOS"],
  [/Dove ci siamo messi insieme/i, "TRESESSANTA"],
  [/Tu eres mi/i, "PELUCHITA"],
  [/Ti amo quanto/i, "TANTO"],
  [/Nell'ora del pranzo si ordina/i, "DOSCAPPUCCINOS"],
  [/Quanti figli avremo in futuro/i, "TRE"],
  [/Miau/i, "BAUR"],
  [/Da ricchi avremo la casa in/i, "SVIZZERA"],
] as const;

async function fillCorrectAnswers(user: ReturnType<typeof userEvent.setup>) {
  for (const [label, value] of answersByLabel) {
    await user.type(screen.getByLabelText(label), value);
  }
}

describe("QuizPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    createAppToast.mockReset();
    toasterRemove.mockReset();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the standalone quiz form immediately", () => {
    renderWithProviders(<QuizPage mode="standalone" />);

    expect(screen.getByText("Quiz #1 anno")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Invia/i })).toBeTruthy();
    expect(screen.queryByText("Finish typing")).toBeNull();
    expect(screen.queryByRole("button", { name: /Salta/i })).toBeNull();
  });

  it("gates the legacy quiz form behind the typewriter flow", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProviders(<QuizPage mode="legacy" />);

    expect(screen.getByText("Finish typing")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Invia/i })).toBeNull();

    await user.click(screen.getByText("Finish typing"));

    expect(screen.getByRole("button", { name: /Invia/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Salta/i })).toBeTruthy();
  });

  it("completes the standalone quiz without advancing the legacy page flow", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onComplete = jest.fn();
    const handlePage = jest.fn();

    renderWithProviders(<QuizPage mode="standalone" onComplete={onComplete} />, {
      appContext: { handlePage },
    });

    await fillCorrectAnswers(user);
    await user.click(screen.getByRole("button", { name: /Invia/i }));

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(handlePage).not.toHaveBeenCalled();
    expect(screen.getByTestId("confetti")).toBeTruthy();
  });

  it("advances the legacy page flow after a successful legacy quiz submission", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const handlePage = jest.fn();

    renderWithProviders(<QuizPage mode="legacy" />, {
      appContext: { handlePage },
    });

    await user.click(screen.getByText("Finish typing"));
    await fillCorrectAnswers(user);
    await user.click(screen.getByRole("button", { name: /Invia/i }));

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(handlePage).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(handlePage).toHaveBeenCalledTimes(1);
  });

  it("shows the first expected error toast on an incorrect standalone submission", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onComplete = jest.fn();

    renderWithProviders(<QuizPage mode="standalone" onComplete={onComplete} />);

    await user.type(screen.getByLabelText(/Il primo nomignolo/i), "WRONG");
    await user.click(screen.getByRole("button", { name: /Invia/i }));

    expect(toasterRemove).toHaveBeenCalledWith("");
    expect(createAppToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Aha, well played!",
        description: 'Say "home"',
        type: "error",
      }),
    );
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.queryByTestId("confetti")).toBeNull();
  });

  it("keeps showing error feedback for partially correct legacy submissions", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const handlePage = jest.fn();

    renderWithProviders(<QuizPage mode="legacy" />, {
      appContext: { handlePage },
    });

    await user.click(screen.getByText("Finish typing"));
    await user.type(screen.getByLabelText(/Il primo nomignolo/i), "POLITOS");
    await user.type(screen.getByLabelText(/Il secondo invece/i), "GATITOS");
    await user.click(screen.getByRole("button", { name: /Invia/i }));

    expect(createAppToast).toHaveBeenCalledTimes(1);
    expect(handlePage).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /Invia/i }));

    expect(toasterRemove).toHaveBeenCalled();
    expect(createAppToast).toHaveBeenCalledTimes(2);
    const secondToastCall = createAppToast.mock.calls[1]?.[0] as {
      type?: string;
      title?: string;
      description?: string;
    };
    expect(secondToastCall.type).toBe("error");
    expect(secondToastCall.title).toBeTruthy();
    expect(secondToastCall.description).toBeTruthy();
    expect(handlePage).not.toHaveBeenCalled();
  });
});
