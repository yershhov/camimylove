import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        navigate("/memories");
      }}
      colorPalette={"pink"}
    >
      <FiArrowRight /> Avanti
    </Button>
  );
};

export default WelcomePage;
