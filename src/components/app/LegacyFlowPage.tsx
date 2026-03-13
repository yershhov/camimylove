import { Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import BackHomeButton from "../ui/BackHomeButton";
import MemoriesPage from "./MemoriesPage/MemoriesPage";
import PrepPage from "./PrepPage";
import QuizPage from "./QuizPage/QuizPage";
import WelcomePage from "./WelcomePage/WelcomePage";

const LegacyFlowPage = () => {
  const [page, setPage] = useState(1);
  const {
    fixedHeightEnabled,
    setFixedHeightEnabled,
    memoriesChangeToken,
    notifyMemoriesChanged,
    sessionAuthenticated,
    setSessionAuthenticated,
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
        memoriesChangeToken,
        notifyMemoriesChanged,
        sessionAuthenticated,
        setSessionAuthenticated,
      }}
    >
      <Box mb={page === 4 ? 4 : 0}>
        <BackHomeButton />
      </Box>
      {page === 1 && <WelcomePage />}
      {page === 2 && <QuizPage mode="legacy" />}
      {page === 3 && <PrepPage />}
      {page === 4 && <MemoriesPage mode="legacy" />}
    </AppContext.Provider>
  );
};

export default LegacyFlowPage;
