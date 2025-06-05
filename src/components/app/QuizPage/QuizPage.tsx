import { Button, VStack, Text, Flex } from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../../../App";
import { MdDone } from "react-icons/md";
import PageContainer from "../../ui/PageContainer";
import { toaster } from "../../ui/toaster";
import PinField from "./PinField";
import AppleStyleConfetti from "../../ui/AppleStyleConfetti";
import QuizPageTypeWriter from "./QuizPageTypeWriter";

// const responses = {
//   nickname: "POLITOS",
//   nickname2: "GATITOS",
//   where: "TRESESSANTA",
//   plush: "PELUCHITA",
//   love: "TANTO",
//   coffee: "DOSCAPPUCCINOS",
//   kids: "TRE",
//   miau: "BAUR",
//   switzerland: "SVIZZERA",
// };

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
];

const QuizPage = () => {
  const { handlePage } = useContext(AppContext);

  const [finishedTypingRows, setFinishedTypingRows] = useState(0);

  const [formData, setFormData] = useState<any>({});
  const [formErrors] = useState<any>({});
  // setFormErrors
  const [quizEnd, setQuizEnd] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const isSubmitted = useRef(false);
  const lastToastId = useRef<string>("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSubmit = (e: any) => {
    isSubmitted.current = true;
    e.preventDefault();

    const newErrors = {};

    // for (const [key, expected] of Object.entries(responses)) {
    //   //@ts-ignore
    //   const actual = formData[key] || "";
    //   if (actual.trim() !== expected) {
    //     //@ts-ignore
    //     newErrors[key] = true;
    //   }
    // }

    // setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowConfetti(true);
      setTimeout(() => {
        setQuizEnd(true);
        setTimeout(handlePage, 1000);
      }, 4000);
    } else {
      toaster.remove(lastToastId.current);
      lastToastId.current = toaster.create({
        ...randomErrorToasters[
          Math.floor(Math.random() * randomErrorToasters!.length)
        ],
        type: "error",
      });
    }
  };

  const sharedProps = { isSubmitted: isSubmitted.current, handleChange };

  return (
    <PageContainer
      gap={6}
      data-state={quizEnd ? "closed" : ""}
      _closed={{
        animationName: "fade-out",
        animationDuration: "1200ms",
      }}
    >
      {showConfetti && <AppleStyleConfetti />}

      <QuizPageTypeWriter
        finishedRows={finishedTypingRows}
        setFinishedRows={setFinishedTypingRows}
      />

      {finishedTypingRows === 1 && (
        <>
          <form
            onSubmit={handleSubmit}
            style={{ height: "100%", width: "100%" }}
          >
            <VStack
              h="100%"
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

              <VStack mb={12} w="100%">
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

                <Button
                  onClick={() => handlePage(3)}
                  color="pink.800"
                  variant={"plain"}
                  fontWeight={"bold"}
                  textDecoration={"underline"}
                  size="sm"
                >
                  Sono un ospite
                </Button>
              </VStack>
            </VStack>
          </form>
        </>
      )}
    </PageContainer>
  );
};

export default QuizPage;
