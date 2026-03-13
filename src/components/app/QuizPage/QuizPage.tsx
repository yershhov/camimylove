import { Button, VStack, Text, Flex, HStack, Box } from "@chakra-ui/react";
import { useContext, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AppContext } from "../../../context/AppContext";
import { MdDone } from "react-icons/md";
import PageContainer from "../../ui/PageContainer";
import { createAppToast, toaster } from "../../ui/appToaster";
import PinField from "./PinField";
import AppleStyleConfetti from "../../ui/AppleStyleConfetti";
import QuizPageTypeWriter from "./QuizPageTypeWriter";
import { FiArrowRight } from "react-icons/fi";
import BackHomeButton from "../../ui/BackHomeButton";

const responses = {
  nickname: "POLITOS",
  nickname2: "GATITOS",
  where: "TRESESSANTA",
  plush: "PELUCHITA",
  love: "TANTO",
  coffee: "DOSCAPPUCCINOS",
  kids: "TRE",
  miau: "BAUR",
  switzerland: "SVIZZERA",
};

type ResponseKey = keyof typeof responses;
type QuizFormData = Partial<Record<ResponseKey, string>>;
type QuizFormErrors = Partial<Record<ResponseKey, boolean>>;

const randomErrorToasters = [
  {
    title: "Sappaaaa",
    description: "Come fai a non rispondere",
  },
  {
    title: "Aha, well played!",
    description: 'Say "home"',
  },
  {
    title: "Nope!",
    description: "Tieni🧠",
  },
  {
    title: "😭😭😭",
    description: "Un po' di sforzo daiii",
  },
].map((t) => ({ ...t, type: "error" }));

type QuizPageProps = {
  mode?: "legacy" | "standalone";
  onComplete?: () => void;
  onSkip?: () => void;
};

const QuizPage = ({ mode = "legacy", onComplete, onSkip }: QuizPageProps) => {
  const { handlePage } = useContext(AppContext);

  const [finishedTypingRows, setFinishedTypingRows] = useState(
    mode === "standalone" ? 1 : 0,
  );

  const [formData, setFormData] = useState<QuizFormData>({});
  const [formErrors, setFormErrors] = useState<QuizFormErrors>({});
  const [quizEnd, setQuizEnd] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const isSubmitted = useRef(false);
  const lastToastId = useRef<string>("");
  const firstTimeError = useRef(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSuccessfulQuizSubmit = () => {
    setShowConfetti(true);
    setTimeout(() => {
      if (mode === "standalone") {
        setQuizEnd(false);
        if (onComplete) onComplete();
        return;
      }

      setQuizEnd(true);
      if (onComplete) {
        setTimeout(onComplete, 1000);
        return;
      }
      setTimeout(handlePage, 1000);
    }, 2000);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    isSubmitted.current = true;
    e.preventDefault();

    if (/iPhone/.test(navigator.userAgent)) window.scrollBy(0, 1);

    const newErrors: QuizFormErrors = {};

    for (const [key, expected] of Object.entries(responses)) {
      const responseKey = key as ResponseKey;
      const actual = formData[responseKey] ?? "";
      if (actual.trim() !== expected) {
        newErrors[responseKey] = true;
      }
    }

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSuccessfulQuizSubmit();
    } else {
      toaster.remove(lastToastId.current);
      if (!firstTimeError.current) {
        firstTimeError.current = true;
        lastToastId.current = createAppToast(randomErrorToasters[1]);
      } else {
        lastToastId.current = createAppToast({
          ...randomErrorToasters[
            Math.floor(Math.random() * randomErrorToasters!.length)
          ],
        });
      }
    }
  };

  const sharedProps = { isSubmitted: isSubmitted.current, handleChange };

  return (
    <PageContainer
      gap={6}
      alignItems="stretch"
      data-state={quizEnd ? "closed" : ""}
      _closed={{
        animationName: "fade-out",
        animationDuration: "1200ms",
      }}
      {...(mode === "standalone"
        ? { overflowY: "auto", h: "100%", minH: 0 }
        : {})}
    >
      {showConfetti && <AppleStyleConfetti />}

      {mode === "standalone" && (
        <Box position="sticky" top={0} zIndex={2} bg="pink.100">
          <HStack justifyContent="center" w="100%" position={"relative"}>
            <Box position={"absolute"} left={0}>
              <BackHomeButton iconOnly />
            </Box>
            <Text
              fontFamily="'Dancing Script', cursive"
              fontSize="4xl"
              textAlign="center"
            >
              Quiz #1 anno
            </Text>
          </HStack>
        </Box>
      )}

      {mode === "legacy" && (
        <QuizPageTypeWriter
          finishedRows={finishedTypingRows}
          setFinishedRows={setFinishedTypingRows}
        />
      )}

      {finishedTypingRows === 1 && mode === "legacy" && (
        <>
          <QuizForm
            handleSubmit={handleSubmit}
            formErrors={formErrors}
            formData={formData}
            sharedProps={sharedProps}
            showConfetti={showConfetti}
            mode={mode}
            onSkip={onSkip}
            handlePage={handlePage}
          />
        </>
      )}

      {finishedTypingRows === 1 && mode === "standalone" && (
        <Box overflowY="auto" flex={1} minH={0}>
          <QuizForm
            handleSubmit={handleSubmit}
            formErrors={formErrors}
            formData={formData}
            sharedProps={sharedProps}
            showConfetti={showConfetti}
            mode={mode}
            onSkip={onSkip}
            handlePage={handlePage}
          />
        </Box>
      )}
    </PageContainer>
  );
};

const QuizForm = ({
  handleSubmit,
  formErrors,
  formData,
  sharedProps,
  showConfetti,
  mode,
  onSkip,
  handlePage,
}: {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  formErrors: QuizFormErrors;
  formData: QuizFormData;
  sharedProps: {
    isSubmitted: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
  showConfetti: boolean;
  mode: "legacy" | "standalone";
  onSkip?: () => void;
  handlePage: (newPage?: number) => void;
}) => {
  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <VStack
        w="100%"
        data-state={"open"}
        _open={{
          animationName: "fade-in",
          animationDuration: "1200ms",
        }}
        gap={8}
      >
        <VStack alignItems={"start"} w="100%">
          <PinField
            label="Il primo nomignolo che abbiamo usato:"
            name="nickname"
            error={formErrors.nickname}
            value={formData.nickname}
            numCells={7}
            emoji="🐣🐥"
            {...sharedProps}
          />

          <PinField
            label="Il secondo invece?"
            name="nickname2"
            error={formErrors.nickname2}
            value={formData.nickname2}
            numCells={7}
            emoji="😽😻"
            {...sharedProps}
          />

          <PinField
            label="Dove ci siamo messi insieme?"
            name="where"
            error={formErrors.where}
            value={formData.where}
            numCells={11}
            emoji="3️⃣6️⃣0️⃣"
            {...sharedProps}
          />

          <PinField
            label="Tu eres mi ..."
            name="plush"
            error={formErrors.plush}
            value={formData.plush}
            numCells={9}
            emoji="🧸"
            {...sharedProps}
          />

          <PinField
            label="Ti amo quanto?"
            name="love"
            error={formErrors.love}
            value={formData.love}
            numCells={5}
            emoji={
              <Flex gap={44} display={"inline-flex"}>
                <span>🫲🏼</span> <span>🫱🏼</span>
              </Flex>
            }
            {...sharedProps}
          />

          <PinField
            label="Nell'ora del pranzo si ordina..."
            name="coffee"
            error={formErrors.coffee}
            value={formData.coffee}
            numCells={15}
            emoji="☕️☕️"
            disabledCells={[3]}
            {...sharedProps}
          />

          <PinField
            label="Quanti figli avremo in futuro?)"
            name="kids"
            error={formErrors.kids}
            value={formData.kids}
            numCells={3}
            emoji="👼👼👼"
            {...sharedProps}
          />

          <PinField
            label="Miau"
            name="miau"
            error={formErrors.miau}
            value={formData.miau}
            numCells={4}
            emoji="🐶"
            {...sharedProps}
          />

          <PinField
            label="Da ricchi avremo la casa in..."
            name="switzerland"
            error={formErrors.switzerland}
            value={formData.switzerland}
            numCells={8}
            emoji="💶⛰🌄"
            {...sharedProps}
          />
        </VStack>

        <VStack w="100%">
          {showConfetti ? (
            <Text fontSize={"4xl"}>🥳🥳🥳🥳🥳🥳🥳</Text>
          ) : (
            <Button
              type="submit"
              colorPalette={"pink"}
              size={"xl"}
              w="100%"
              disabled={showConfetti}
            >
              <MdDone /> Invia
            </Button>
          )}

          {mode === "legacy" && (
            <Button
              onClick={() => {
                if (onSkip) {
                  onSkip();
                  return;
                }
                handlePage(4);
              }}
              color="pink.800"
              variant={"plain"}
              fontWeight={"bold"}
              textDecoration={"underline"}
              size="sm"
            >
              Salta <FiArrowRight />
            </Button>
          )}
        </VStack>
      </VStack>
    </form>
  );
};

export default QuizPage;
