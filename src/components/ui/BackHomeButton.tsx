import { Button, IconButton } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BackHomeButton = ({ iconOnly = false }: { iconOnly?: boolean }) => {
  const navigate = useNavigate();

  if (iconOnly) {
    return (
      <IconButton
        aria-label="Torna alla pagina home"
        colorPalette="pink"
        variant={"plain"}
        onClick={() => navigate("/home")}
      >
        <IoArrowBack />
      </IconButton>
    );
  }

  return (
    <Button
      variant="outline"
      colorPalette="pink"
      onClick={() => navigate("/home")}
    >
      <IoArrowBack />
      {"Torna alla home"}
    </Button>
  );
};

export default BackHomeButton;
