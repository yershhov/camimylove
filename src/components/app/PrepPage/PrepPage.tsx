import { Button, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { FiArrowRight } from "react-icons/fi";
import { AppContext } from "../../../App";

const PrepPage = () => {
  const { handlePage } = useContext(AppContext);

  return (
    <VStack textAlign={"center"}>
      Extra step in develop, skip for now with the button below
      <Button
        onClick={() => handlePage()}
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
    </VStack>
  );
};

export default PrepPage;
