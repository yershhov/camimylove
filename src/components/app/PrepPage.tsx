import { Button, VStack, Image, Spacer, Box } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { AppContext } from "../../context/AppContext";
import { TypeAnimation } from "react-type-animation";
import PageContainer from "../ui/PageContainer";

const prepGifSrc = "/christmas-excitement.gif";

const PrepPage = () => {
  const { handlePage } = useContext(AppContext);

  const [finishedTyping, setFinishedTyping] = useState(false);
  const [letAhead, setLetAhead] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [clicked, setClicked] = useState(false);

  const goAhead = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => {
      handlePage();
    }, 600);
  };

  useEffect(() => {
    if (!containerRef?.current) return;

    const spans = containerRef.current.querySelectorAll("span");

    if (finishedTyping) spans[0]?.classList.add("remove-after-pseudo");
  }, [finishedTyping]);

  useEffect(() => {
    if (!finishedTyping) return;

    const timeout = setTimeout(() => {
      setLetAhead(true);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [finishedTyping]);

  return (
    <PageContainer
      pb={8}
      data-state={clicked ? "closed" : ""}
      _closed={{
        animationName: "fade-out, scale-out",
        animationDuration: "600ms",
        animationFillMode: "forwards",
      }}
    >
      <Box
        ref={containerRef}
        fontSize={"2xl"}
        lineHeight={1.1}
        w="100%"
        textAlign={"center"}
        mt={4}
      >
        <TypeAnimation
          sequence={[
            500,
            "Muy bien!",
            1000,
            "Muy bien! Hai avuto pazienza e ora finalmente puoi scoprire cosa ho preparato per te, mi amor!🥰",
            1000,
            "Muy bien! Hai avuto pazienza e ora finalmente puoi scoprire cosa ho preparato per te, mi amor!🥰 Ci ho messo tanto amore e sforzo, anche se penso che non raggiungerà mai lo sforzo che tu hai messo tante volte per me, però spero comunque che ti piacerà🙈",
            1000,
            "Muy bien! Hai avuto pazienza e ora finalmente puoi scoprire cosa ho preparato per te, mi amor!🥰 Ci ho messo tanto amore e sforzo, anche se penso che non raggiungerà mai lo sforzo che tu hai messo tante volte per me, però spero comunque che ti piacerà🙈 Ti amo tanto tanto <3",
            1000,
            () => setFinishedTyping(true),
          ]}
          speed={45}
          deletionSpeed={83}
          repeat={0}
        />
      </Box>

      <Spacer />

      <VStack mb={12} h="400px" justifyContent={"start"} w="100%">
        {finishedTyping && <Image src={prepGifSrc} alt="Christmas excitement" />}

        <Spacer />

        {letAhead && (
          <Button
            onClick={goAhead}
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
      </VStack>
    </PageContainer>
  );
};

export default PrepPage;
