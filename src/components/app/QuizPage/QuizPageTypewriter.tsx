import { VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";

const QuizPageTypewriter = ({ finishedRows, setFinishedRows }: any) => {
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
    }
  }, [finishedRows]);

  return (
    <VStack
      ref={containerRef}
      fontSize={"3xl"}
      lineHeight={1.1}
      textAlign={"center"}
      w="100%"
      mt={16}
    >
      <TypeAnimation
        sequence={[
          500,
          "Che sorpresa sarebbe stata senza alcuna sfida?))",
          1500,
          "Che sorpresa sarebbe stata senza alcuna sfida?)) I regali si incarta bene, giusto?🎁",
          2500,
          "Per procedere, completa il quiz😜🧠",
          500,
          () => setFinishedRows(1),
        ]}
        speed={45}
        deletionSpeed={83}
        repeat={0}
        className="remove-after-pseudo"
      />
    </VStack>
  );
};

export default QuizPageTypewriter;
