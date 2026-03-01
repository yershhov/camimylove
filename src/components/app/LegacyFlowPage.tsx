import { Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
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
  const {
    fixedHeightEnabled,
    setFixedHeightEnabled,
    memoriesVersion,
    invalidateMemories,
  } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  useEffect(() => {
    setFixedHeightEnabled(page !== 2);

    return () => {
      setFixedHeightEnabled(true);
    };
  }, [page, setFixedHeightEnabled]);

  return (
    <AppContext.Provider
      value={{
        fixedHeightEnabled,
        setFixedHeightEnabled,
        handlePage: (newPage?: number) =>
          setPage((currentPage) =>
            typeof newPage === "number" ? newPage : currentPage + 1,
          ),
        memoriesVersion,
        invalidateMemories,
      }}
    >
      <Box mb={page === 4 ? 4 : 0}>
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
