import { Button, IconButton } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BackHomeButton = ({ iconOnly = false }: { iconOnly?: boolean }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (iconOnly) {
    return (
      <IconButton
        aria-label={t("common.backHome")}
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
      {t("common.backHome")}
    </Button>
  );
};

export default BackHomeButton;
