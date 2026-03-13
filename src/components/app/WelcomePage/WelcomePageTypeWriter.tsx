import { VStack } from "@chakra-ui/react";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { TypeAnimation } from "react-type-animation";

type WelcomePageTypeWriterProps = {
  finishedRows: number;
  setFinishedRows: Dispatch<SetStateAction<number>>;
};

function WelcomePageTypeWriter({
  finishedRows,
  setFinishedRows,
}: WelcomePageTypeWriterProps) {
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
          2500,
          "Hola!👋",
          1500,
          "Hola, mi amor🥰",
          1500,
          () => setFinishedRows(1),
        ]}
        speed={1}
        deletionSpeed={{ type: "keyStrokeDelayInMs", value: 150 }}
        repeat={0}
        className="remove-after-pseudo"
      />

      {finishedRows > 0 && (
        <TypeAnimation
          sequence={[
            "Feliz mesivers",
            500,
            "Feliz aniversario🥳",
            1500,
            () => setFinishedRows(2),
          ]}
          speed={1}
          repeat={0}
          className="remove-after-pseudo"
        />
      )}

      {finishedRows > 1 && (
        <TypeAnimation
          sequence={["Te amo mucho <3", 500, () => setFinishedRows(3)]}
          speed={1}
          repeat={0}
          className="remove-after-pseudo"
        />
      )}
    </VStack>
  );
}

export default WelcomePageTypeWriter;
