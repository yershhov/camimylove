import { Button, Spacer, VStack } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { useContext, useState } from "react";
import { AppContext } from "../../../App";
import { TypeAnimation } from "react-type-animation";

const WelcomePage = () => {
  const [clicked, setClicked] = useState(false);
  const { handlePage } = useContext(AppContext);

  const [finishedTyping, setFinishedTyping] = useState(false);
  const [finishedStep, setFinishedStep] = useState(-1);

  const goAhead = (page?: number) => {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => {
      handlePage(page);
    }, 600);
  };

  return (
    <VStack
      w="100%"
      h="100%"
      data-state={clicked ? "closed" : ""}
      _closed={{
        animationName: "fade-out, scale-out",
        animationDuration: "600ms",
        animationFillMode: "forwards",
      }}
      position="absolute"
      p={{ base: 6, md: 24 }}
      py={24}
    >
      <VStack
        fontSize={"4xl"}
        lineHeight={1}
        textAlign={"start"}
        w="100%"
        mt={24}
      >
        {finishedTyping && (
          <style>
            {`
      span.index-module_type__E-SaG::after {
        display: none !important;
      }
    `}
          </style>
        )}

        <TypeAnimation
          sequence={["Hola, mi amor!", 1000, () => setFinishedStep(0)]}
          speed={1}
          cursor={!finishedTyping}
          repeat={0}
        />

        {finishedStep > -1 && (
          <TypeAnimation
            sequence={["Feliz aniversario 😘", 1000, () => setFinishedStep(1)]}
            speed={1}
            cursor={finishedStep === 0}
            repeat={0}
          />
        )}

        {finishedStep > 0 && (
          <TypeAnimation
            sequence={["Te amo mucho <3", 1000, () => setFinishedTyping(true)]}
            speed={1}
            cursor={!finishedTyping}
            repeat={0}
          />
        )}
      </VStack>

      <Spacer />

      {finishedTyping && (
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
            <span>Sei un ospite (non Camila)?</span>

            <Button
              onClick={() => goAhead(1)}
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
    </VStack>
  );
};

export default WelcomePage;
