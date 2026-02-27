import MemoriesPage from "./components/app/MemoriesPage/MemoriesPage";
import AuthPage from "./components/app/AuthPage/AuthPage";
import { Flex } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import "./App.css";
import QuizPage from "./components/app/QuizPage/QuizPage";
import PrepPage from "./components/app/PrepPage/PrepPage";
import WelcomePage from "./components/app/WelcomePage/WelcomePage";
// import Settings from "./components/app/Settings";

export const AppContext = createContext<any>({});

function App() {
  const [page, setPage] = useState(0);
  const [_, setShowSettings] = useState(localStorage.getItem("show_settings"));

  useEffect(() => {
    sessionStorage.removeItem("image_container_mounted");
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  return (
    <AppContext.Provider
      value={{
        handlePage: (newPage?: number) =>
          setPage((page) => (newPage ? newPage : page + 1)),
        setShowSettings,
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
        </Flex>
      </Flex>
    </AppContext.Provider>
  );
}

export default App;
