import { Button, Spacer, VStack } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { useContext, useState } from "react";
import { AppContext } from "../../../App";
import PageContainer from "../../ui/PageContainer";
import WelcomePageTypeWriter from "./WelcomePageTypeWriter";

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
    <PageContainer
      data-state={clicked ? "closed" : ""}
      _closed={{
        animationName: "fade-out, scale-out",
        animationDuration: "600ms",
        animationFillMode: "forwards",
      }}
    >
      <WelcomePageTypeWriter
        finishedRows={finishedTypingRows}
        setFinishedRows={setFinishedTypingRows}
      />

      <Spacer />

      <VStack mb={16} gap={4}>
        {finishedTypingRows === 3 && (
          <Button
            onClick={() => goAhead()}
            colorPalette={"pink"}
            size={"xl"}
            data-state={"open"}
            _open={{
              animationName: "fade-in",
              animationDuration: "1200ms",
            }}
          >
            <FiArrowRight /> Avanti
          </Button>
        )}

        <Button
          onClick={() => goAhead(3)}
          color="pink.800"
          variant={"plain"}
          fontWeight={"bold"}
          textDecoration={"underline"}
          size="sm"
          position={"relative"}
          bottom={3}
          // visibility={"hidden"}
        >
          Vai ai ricordi
        </Button>
      </VStack>
    </PageContainer>
  );
};

export default WelcomePage;
