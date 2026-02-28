import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import BackHomeButton from "../ui/BackHomeButton";
import MemoriesPage from "./MemoriesPage/MemoriesPage";
import PrepPage from "./PrepPage/PrepPage";
import QuizPage from "./QuizPage/QuizPage";
import UploadPage from "./UploadPage/UploadPage";
import WelcomePage from "./WelcomePage/WelcomePage";

const LegacyFlowPage = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  return (
    <AppContext.Provider
      value={{
        handlePage: (newPage?: number) =>
          setPage((currentPage) =>
            typeof newPage === "number" ? newPage : currentPage + 1,
          ),
      }}
    >
      <Box position="fixed" top={{ base: 4, md: 8 }} left={{ base: 4, md: 8 }} zIndex={20}>
        <BackHomeButton />
      </Box>
      {page === 1 && <WelcomePage />}
      {page === 2 && <QuizPage mode="legacy" />}
      {page === 3 && <PrepPage />}
      {page === 4 && <MemoriesPage mode="legacy" />}
      {page === 5 && (
        <UploadPage mode="legacy" onBack={() => navigate("/random-memories")} />
      )}
    </AppContext.Provider>
  );
};

export default LegacyFlowPage;
