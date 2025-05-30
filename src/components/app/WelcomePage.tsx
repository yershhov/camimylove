import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useState } from "react";

const WelcomePage = () => {
  const navigate = useNavigate();

  const [clicked, setClicked] = useState(false);

  return (
    <Button
      onClick={() => {
        if (clicked) return;
        setClicked(true);
        setTimeout(() => {
          navigate("/memories");
        }, 600);
      }}
      colorPalette={"pink"}
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
