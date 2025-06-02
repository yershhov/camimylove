import { VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";

const WelcomePageTypewriter = ({ finishedRows, setFinishedRows }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef?.current) return;

    const spans = containerRef.current.querySelectorAll("span");

    if (finishedRows > 0) {
      spans[finishedRows - 1]?.classList.add("remove-after-pseudo");
    }

    if (finishedRows === 0) {
      spans[0]?.classList.add("add-after-pseudo");
    } else if (finishedRows === 1) {
      spans[1]?.classList.add("add-after-pseudo");
      spans[0]?.classList.remove("add-after-pseudo");
    } else if (finishedRows === 2) {
      spans[2]?.classList.add("add-after-pseudo");
      spans[1]?.classList.remove("add-after-pseudo");
    } else if (finishedRows === 3) {
      spans[2]?.classList.remove("add-after-pseudo");
    }
  }, [finishedRows]);

  return (
    <VStack
      ref={containerRef}
      fontSize={"4xl"}
      lineHeight={1.1}
      textAlign={"start"}
      w="100%"
      mt={24}
    >
      <TypeAnimation
        sequence={[
          3000,
          "Hola!👋",
          2000,
          "Hola, mi amor🥰",
          2000,
          () => setFinishedRows(1),
        ]}
        speed={1}
        deletionSpeed={{ type: "keyStrokeDelayInMs", value: 250 }}
        repeat={0}
        className="remove-after-pseudo"
      />

      {finishedRows > 0 && (
        <TypeAnimation
          sequence={[
            "Feliz mesivers",
            500,
            "Feliz aniversario🥳",
            2000,
            () => setFinishedRows(2),
          ]}
          speed={1}
          //   deletionSpeed={{ type: "keyStrokeDelayInMs", value: 250 }}
          repeat={0}
          className="remove-after-pseudo"
        />
      )}

      {finishedRows > 1 && (
        <TypeAnimation
          sequence={["Te amo mucho <3", 1000, () => setFinishedRows(3)]}
          speed={1}
          repeat={0}
          className="remove-after-pseudo"
        />
      )}
    </VStack>
  );
};

export default WelcomePageTypewriter;
