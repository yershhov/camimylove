import { Button } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BackHomeButton = ({ iconOnly = false }: { iconOnly?: boolean }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      colorPalette="pink"
      onClick={() => navigate("/home")}
    >
      <IoArrowBack />
      {iconOnly ? null : "Torna alla home"}
    </Button>
  );
};

export default BackHomeButton;
