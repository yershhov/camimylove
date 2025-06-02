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
      textAlign={"start"}
      w="100%"
      mt={24}
    >
      <TypeAnimation
        sequence={[
          2000,
          "Che sorpresa sarebbe senza alcuna sfida?)",
          2500,
          "Per procedere rispondi allo quiz😜🧠",
          2000,
          () => setFinishedRows(1),
        ]}
        speed={45}
        deletionSpeed={75}
        repeat={0}
        className="remove-after-pseudo"
      />
    </VStack>
  );
};

export default QuizPageTypewriter;
