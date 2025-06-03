import { Button, Spacer, VStack } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { useContext, useState } from "react";
import { AppContext } from "../../../App";
import IndependentContainer from "../../ui/independent-container";
import WelcomePageTypewriter from "./WelcomePageTypewriter";

const WelcomePage = () => {
  const [clicked, setClicked] = useState(false);
  const { handlePage } = useContext(AppContext);

  const [finishedTypingRows, setFinishedTypingRows] = useState(0);

  const goAhead = (page?: number) => {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => {
      handlePage(page);
    }, 600);
  };

  return (
    <IndependentContainer
      data-state={clicked ? "closed" : ""}
      _closed={{
        animationName: "fade-out, scale-out",
        animationDuration: "600ms",
        animationFillMode: "forwards",
      }}
    >
      <WelcomePageTypewriter
        finishedRows={finishedTypingRows}
        setFinishedRows={setFinishedTypingRows}
      />

      <Spacer />

      {finishedTypingRows === 3 && (
        <>
          <Button
            onClick={() => goAhead()}
            colorPalette={"pink"}
            size={"xl"}
            data-state={"open"}
            _open={{
              animationName: "fade-in",
              animationDuration: "1200ms",
            }}
            mb={12}
          >
            <FiArrowRight /> Avanti
          </Button>

          <VStack
            fontSize="sm"
            alignItems={"center"}
            fontWeight={"semibold"}
            data-state={"open"}
            _open={{
              animationName: "fade-in",
              animationDuration: "1200ms",
            }}
          >
            <span>Non sei Camila?</span>

            <Button
              onClick={() => goAhead(3)}
              color="pink.800"
              variant={"plain"}
              fontWeight={"bold"}
              textDecoration={"underline"}
              size="sm"
              position={"relative"}
              bottom={3}
            >
              Clicca qui per procedere
            </Button>
          </VStack>
        </>
      )}
    </IndependentContainer>
  );
};

export default WelcomePage;
