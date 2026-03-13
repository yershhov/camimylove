import { Flex, Spinner, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState, type ReactNode } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";
import AuthPage from "./components/app/AuthPage";
import MemoriesPage from "./components/app/MemoriesPage/MemoriesPage";
import UploadPage from "./components/app/UploadPage";
import HomePage from "./components/app/HomePage";
import GalleryPage from "./components/app/GalleryPage";
import SettingsPage from "./components/app/SettingsPage";
import QuizPage from "./components/app/QuizPage/QuizPage";
import LegacyFlowPage from "./components/app/LegacyFlowPage";
import MaintenanceGatePage from "./components/app/MaintenanceGatePage";
import ProtectedRoute from "./router/ProtectedRoute";
import { AppContext } from "./context/AppContext";

const MAINTENANCE_UNLOCK_STORAGE_KEY = "camimylove_maintenance_unlocked";

type FeatureFlagsResponse = {
  womensDayWelcomeEnabled: boolean;
  maintenanceModeEnabled: boolean;
};

function App() {
  const location = useLocation();
  const [isFixedHeightEnabled, setIsFixedHeightEnabled] = useState(true);
  const [memoriesChangeToken, setMemoriesChangeToken] = useState(0);
  const [isFlagsLoading, setIsFlagsLoading] = useState(true);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagsResponse>({
    womensDayWelcomeEnabled: false,
    maintenanceModeEnabled: false,
  });
  const [isMaintenanceUnlocked, setIsMaintenanceUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(MAINTENANCE_UNLOCK_STORAGE_KEY) === "true";
  });

  useEffect(() => {
    sessionStorage.removeItem("image_container_mounted");
  }, []);

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const response = await fetch("/api/feature-flags", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Unable to load feature flags");
        }

        const payload =
          (await response.json()) as Partial<FeatureFlagsResponse>;
        setFeatureFlags({
          womensDayWelcomeEnabled: Boolean(payload.womensDayWelcomeEnabled),
          maintenanceModeEnabled: Boolean(payload.maintenanceModeEnabled),
        });
      } catch {
        setFeatureFlags({
          womensDayWelcomeEnabled: false,
          maintenanceModeEnabled: false,
        });
      } finally {
        setIsFlagsLoading(false);
      }
    };

    void fetchFeatureFlags();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/session");
        setSessionAuthenticated(response.ok);
      } catch {
        setSessionAuthenticated(false);
      } finally {
        setIsSessionLoading(false);
      }
    };

    void checkSession();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setIsFixedHeightEnabled(true);
  }, [location.pathname]);

  const handleMaintenanceUnlock = () => {
    localStorage.setItem(MAINTENANCE_UNLOCK_STORAGE_KEY, "true");
    setIsMaintenanceUnlocked(true);
  };

  const appContextValue = {
    handlePage: () => undefined,
    fixedHeightEnabled: isFixedHeightEnabled,
    setFixedHeightEnabled: setIsFixedHeightEnabled,
    memoriesChangeToken,
    notifyMemoriesChanged: () =>
      setMemoriesChangeToken((currentVersion) => currentVersion + 1),
    sessionAuthenticated,
    setSessionAuthenticated,
  };

  if (isFlagsLoading || isSessionLoading) {
    return (
      <AppContext.Provider value={appContextValue}>
        <FullScreenSpinner />
      </AppContext.Provider>
    );
  }

  const isMaintenanceLocked =
    featureFlags.maintenanceModeEnabled && !isMaintenanceUnlocked;

  if (isMaintenanceLocked) {
    return (
      <AppContext.Provider value={appContextValue}>
        <AppFrameLayout fixedHeight>
          <MaintenanceGatePage onUnlock={handleMaintenanceUnlock} />
        </AppFrameLayout>
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <Routes>
        <Route element={<AppFrameLayout fixedHeight />}>
          <Route path="/login" element={<LoginRoute />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppFrameLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
              path="/home"
              element={
                <HomePage
                  womensDayMode={featureFlags.womensDayWelcomeEnabled}
                />
              }
            />
            <Route path="/upload" element={<StandaloneUploadRoute />} />
            <Route path="/memories/edit/:id" element={<EditMemoryRoute />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/quiz" element={<StandaloneQuizRoute />} />
            <Route path="/random-memories" element={<RandomMemoriesRoute />} />
          </Route>

          <Route element={<AppFrameLayout fixedHeight />}>
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/legacy" element={<LegacyFlowPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AppContext.Provider>
  );
}

function AppFrameLayout({
  fixedHeight = false,
  children,
}: {
  fixedHeight?: boolean;
  children?: ReactNode;
}) {
  const { fixedHeightEnabled } = useContext(AppContext);
  const effectiveFixedHeight = fixedHeight && fixedHeightEnabled;

  return (
    <Flex
      bg="pink.100"
      color="pink.800"
      fontWeight="bold"
      justifyContent={"center"}
      overflow="auto"
      minH="100dvh"
      h={effectiveFixedHeight ? "100dvh" : undefined}
      position="relative"
    >
      <Flex
        flexDirection="column"
        w="100%"
        maxW={{ md: "800px" }}
        p={{ base: 6, md: 24 }}
        position="relative"
        h="100%"
      >
        {children ?? <Outlet />}
      </Flex>
    </Flex>
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  const { sessionAuthenticated, setSessionAuthenticated } =
    useContext(AppContext);

  const postLoginPath = "/home";

  if (sessionAuthenticated) {
    return <Navigate to={postLoginPath} replace />;
  }

  return (
    <AuthPage
      onAuthSuccess={() => {
        setSessionAuthenticated(true);
        navigate(postLoginPath, { replace: true });
      }}
    />
  );
}

function StandaloneUploadRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    typeof location.state?.from === "string" ? location.state.from : "/home";

  return <UploadPage mode="standalone" onBack={() => navigate(from)} />;
}

function EditMemoryRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const memoryId = Number(params.id);
  const from =
    typeof location.state?.from === "string"
      ? location.state.from
      : "/random-memories";

  if (!Number.isInteger(memoryId) || memoryId < 0) {
    return <Navigate to="/random-memories" replace />;
  }

  return (
    <UploadPage
      mode="standalone"
      variant="edit"
      memoryId={memoryId}
      onBack={() => navigate(from)}
    />
  );
}

function RandomMemoriesRoute() {
  return <MemoriesPage mode="standalone" />;
}

function StandaloneQuizRoute() {
  return <QuizPage mode="standalone" />;
}

function FullScreenSpinner() {
  return (
    <Flex bg="pink.100" h="100dvh" justifyContent="center" overflow="hidden">
      <VStack pt="28dvh">
        <Spinner color="pink.500" size="lg" />
      </VStack>
    </Flex>
  );
}

export default App;
