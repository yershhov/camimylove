import MemoriesPage from "./components/app/MemoriesPage/MemoriesPage";
import WelcomePage from "./components/app/WelcomePage";
import { Center } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext<any>({});

function App() {
  const [page, setPage] = useState(0);

  useEffect(() => {
    sessionStorage.removeItem("image_container_mounted");
  }, []);

  return (
    <AppContext.Provider
      value={{ handlePage: () => setPage((page) => page + 1) }}
    >
      <Center
        h="100%"
        minH={"100vh"}
        w="100%"
        bg="pink.100"
        color="pink.800"
        fontWeight="bold"
        p={{ base: 6, md: 24 }}
      >
        {page === 0 && <WelcomePage />}
        {page === 1 && <MemoriesPage />}
      </Center>
    </AppContext.Provider>
  );
}

export default App;
