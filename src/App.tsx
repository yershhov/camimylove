import MemoriesPage from "./components/app/MemoriesPage/MemoriesPage";
import WelcomePage from "./components/app/WelcomePage/WelcomePage";
import { Center } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import "./App.css";
import QuizPage from "./components/app/QuizPage/QuizPage";
// import Settings from "./components/app/Settings";

export const AppContext = createContext<any>({});

function App() {
  const [page, setPage] = useState(0);
  const [
    // showSettings,
    setShowSettings,
  ] = useState(localStorage.getItem("show_settings"));

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
      <Center
        h="100%"
        minH={"100vh"}
        w="100%"
        bg="pink.100"
        color="pink.800"
        fontWeight="bold"
        p={{ base: 6, md: 24 }}
        position={"relative"}
      >
        {/* {showSettings && <Settings />} */}

        {page === 0 && <WelcomePage />}
        {page === 1 && <QuizPage />}
        {page === 2 && <MemoriesPage />}
      </Center>
    </AppContext.Provider>
  );
}

export default App;
