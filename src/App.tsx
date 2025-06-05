import MemoriesPage from "./components/app/MemoriesPage/MemoriesPage";
import WelcomePage from "./components/app/WelcomePage/WelcomePage";
import { Flex } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import "./App.css";
import QuizPage from "./components/app/QuizPage/QuizPage";
import PrepPage from "./components/app/PrepPage/PrepPage";
// import Settings from "./components/app/Settings";

export const AppContext = createContext<any>({});

function App() {
  const [page, setPage] = useState(0);
  const [_, setShowSettings] = useState(localStorage.getItem("show_settings"));

  useEffect(() => {
    sessionStorage.removeItem("image_container_mounted");
  }, []);

  return (
    <AppContext.Provider
      value={{
        handlePage: (newPage?: number) =>
          setPage((page) => (newPage ? newPage : page + 1)),
        setShowSettings,
      }}
    >
      <Flex
        flexDirection="column"
        minH={"100vh"}
        h="100%"
        w="100%"
        bg="pink.100"
        color="pink.800"
        fontWeight="bold"
        p={{ base: 6, md: 24 }}
      >
        {/* {showSettings && <Settings />} */}

        {page === 0 && <WelcomePage />}
        {page === 1 && <QuizPage />}
        {page === 2 && <PrepPage />}
        {page === 3 && <MemoriesPage />}
      </Flex>
    </AppContext.Provider>
  );
}

export default App;
