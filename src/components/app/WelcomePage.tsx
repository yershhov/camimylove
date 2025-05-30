import { Button } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { useContext, useState } from "react";
import { AppContext } from "../../App";

const WelcomePage = () => {
  const [clicked, setClicked] = useState(false);
  const { handlePage } = useContext(AppContext);

  return (
    <Button
      onClick={() => {
        if (clicked) return;
        setClicked(true);
        setTimeout(() => {
          handlePage();
        }, 600);
      }}
      colorPalette={"pink"}
      size={"xl"}
      data-state={clicked ? "closed" : ""}
      _closed={{
        animationName: "fade-out, scale-out",
        animationDuration: "600ms",
        animationFillMode: "forwards",
      }}
    >
      <FiArrowRight /> Avanti
    </Button>
  );
};

export default WelcomePage;
