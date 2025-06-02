import { Box, Button, Spacer, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AppContext } from "../../../App";
import { MdDone } from "react-icons/md";
import QuizPageTypewriter from "./QuizPageTypewriter";
import IndependentContainer from "../../ui/independent-container";

const QuizPage = () => {
  const { handlePage } = useContext(AppContext);

  const [finishedTypingRows, setFinishedTypingRows] = useState(0);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <IndependentContainer>
      <QuizPageTypewriter
        finishedRows={finishedTypingRows}
        setFinishedRows={setFinishedTypingRows}
      />

      {finishedTypingRows === 1 && (
        <>
          ...
          <Spacer />
          <form onSubmit={handleSubmit}>
            <VStack
              data-state="open"
              _open={{
                animationName: "fade-in",
                // , scale-in",
                animationDuration: "1200ms",
              }}
            >
              <Button
                onClick={() => handlePage()}
                colorPalette={"pink"}
                size={"xl"}
                mb={12}
              >
                <MdDone /> Invia
              </Button>
            </VStack>
          </form>
        </>
      )}
    </IndependentContainer>
  );
};

export default QuizPage;
