import { BrowserRouter, Route, Routes } from "react-router-dom";
import MemoriesPage from "./components/app/MemoriesPage/MemoriesPage";
import WelcomePage from "./components/app/WelcomePage";
import { Center } from "@chakra-ui/react";

function App() {
  return (
    <Center
      h="100vh"
      w="100%"
      bg="pink.100"
      color="pink.800"
      fontWeight="bold"
      p={{ base: 6, md: 24 }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="*" element={<span>404 page not found</span>} />
        </Routes>
      </BrowserRouter>
    </Center>
  );
}

export default App;
