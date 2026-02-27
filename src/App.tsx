import MemoriesPage from "./components/app/MemoriesPage/MemoriesPage";
import AuthPage from "./components/app/AuthPage/AuthPage";
import { Flex } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import "./App.css";
import QuizPage from "./components/app/QuizPage/QuizPage";
import PrepPage from "./components/app/PrepPage/PrepPage";
import WelcomePage from "./components/app/WelcomePage/WelcomePage";
import UploadPage from "./components/app/UploadPage/UploadPage";
// import Settings from "./components/app/Settings";

export const AppContext = createContext<any>({});

function App() {
  const [page, setPage] = useState(0);
  const [_, setShowSettings] = useState(localStorage.getItem("show_settings"));
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("image_container_mounted");
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  useEffect(() => {
    const loadFeatureFlags = async () => {
      try {
        const response = await fetch("/api/feature-flags");
        if (!response.ok) return;

        const payload = await response.json();
        setIsUploadEnabled(Boolean(payload.uploadEnabled));
      } catch {
        setIsUploadEnabled(false);
      }
    };

    void loadFeatureFlags();
  }, []);

  useEffect(() => {
    if (!isUploadEnabled && page === 5) {
      setPage(4);
    }
  }, [isUploadEnabled, page]);

  return (
    <AppContext.Provider
      value={{
        handlePage: (newPage?: number) =>
          setPage((page) =>
            typeof newPage === "number" ? newPage : page + 1
          ),
        setShowSettings,
        isUploadEnabled,
      }}
    >
      <Flex
        bg="pink.100"
        color="pink.800"
        fontWeight="bold"
        justifyContent={"center"}
      >
        <Flex
          flexDirection="column"
          minH={"100dvh"}
          h="100%"
          w="100%"
          maxW={{ md: "800px" }}
          p={{ base: 6, md: 24 }}
        >
          {/* {showSettings && <Settings />} */}

          {page === 0 && <AuthPage />}
          {page === 1 && <WelcomePage />}
          {page === 2 && <QuizPage />}
          {page === 3 && <PrepPage />}
          {page === 4 && <MemoriesPage />}
          {page === 5 && isUploadEnabled && <UploadPage />}
        </Flex>
      </Flex>
    </AppContext.Provider>
  );
}

export default App;
