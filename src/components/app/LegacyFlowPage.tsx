import { Box } from "@chakra-ui/react";
import { Suspense, lazy, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import BackHomeButton from "../ui/BackHomeButton";
import Loader from "../ui/Loader";

const MemoriesPage = lazy(() => import("./MemoriesPage/MemoriesPage"));
const PrepPage = lazy(() => import("./PrepPage"));
const QuizPage = lazy(() => import("./QuizPage/QuizPage"));
const UploadPage = lazy(() => import("./UploadPage"));
const WelcomePage = lazy(() => import("./WelcomePage/WelcomePage"));

const LegacyFlowPage = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
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
      <Suspense fallback={<LegacyFlowFallback />}>
        {page === 1 && <WelcomePage />}
        {page === 2 && <QuizPage mode="legacy" />}
        {page === 3 && <PrepPage />}
        {page === 4 && <MemoriesPage mode="legacy" />}
        {page === 5 && (
          <UploadPage
            mode="legacy"
            onBack={() => navigate("/random-memories")}
          />
        )}
      </Suspense>
    </AppContext.Provider>
  );
};

function LegacyFlowFallback() {
  return (
    <Box pt={10}>
      <Loader fitContainer />
    </Box>
  );
}

export default LegacyFlowPage;
