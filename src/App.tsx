import { Flex, Spinner, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import AuthPage from "./components/app/AuthPage/AuthPage";
import MemoriesPage from "./components/app/MemoriesPage/MemoriesPage";
import UploadPage from "./components/app/UploadPage/UploadPage";
import HomePage from "./components/app/HomePage/HomePage";
import GalleryPage from "./components/app/GalleryPage.tsx";
import SettingsPage from "./components/app/SettingsPage.tsx";
import QuizPage from "./components/app/QuizPage/QuizPage";
import LegacyFlowPage from "./components/app/LegacyFlowPage.tsx";
import ProtectedRoute from "./router/ProtectedRoute";
import { AppContext } from "./context/AppContext";

function App() {
  const location = useLocation();

  useEffect(() => {
    sessionStorage.removeItem("image_container_mounted");
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <AppContext.Provider
      value={{
        handlePage: () => undefined,
      }}
    >
      <Flex
        bg="pink.100"
        color="pink.800"
        fontWeight="bold"
        justifyContent={"center"}
        minH="100dvh"
        h="100dvh"
        overflow="hidden"
      >
        <Flex
          flexDirection="column"
          minH={"100dvh"}
          h="100%"
          overflow="hidden"
          minW={0}
          w="100%"
          maxW={{ md: "800px" }}
          p={{ base: 6, md: 24 }}
        >
          <Routes>
            <Route path="/login" element={<LoginRoute />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/random-memories" element={<RandomMemoriesRoute />} />
              <Route path="/upload" element={<StandaloneUploadRoute />} />
              <Route path="/quiz" element={<StandaloneQuizRoute />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/legacy" element={<LegacyFlowPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Flex>
      </Flex>
    </AppContext.Provider>
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/session");
        if (response.ok) {
          navigate("/home", { replace: true });
          return;
        }
      } catch {
        // noop
      } finally {
        setCheckingSession(false);
      }
    };

    void checkSession();
  }, [navigate]);

  if (checkingSession) {
    return (
      <VStack justifyContent="center" minH="60vh">
        <Spinner color="pink.500" size="lg" />
      </VStack>
    );
  }

  return <AuthPage onAuthSuccess={() => navigate("/home", { replace: true })} />;
}

function StandaloneUploadRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    typeof location.state?.from === "string" ? location.state.from : "/home";

  return (
    <UploadPage
      mode="standalone"
      onBack={() => navigate(from)}
    />
  );
}

function RandomMemoriesRoute() {
  const navigate = useNavigate();

  return (
    <MemoriesPage
      mode="standalone"
      onOpenUpload={() => navigate("/upload", { state: { from: "/random-memories" } })}
    />
  );
}

function StandaloneQuizRoute() {
  return <QuizPage mode="standalone" />;
}

export default App;
