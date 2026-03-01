import { Flex, Spinner, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const SESSION_REFRESH_INTERVAL_MS = 4 * 60 * 1000;
const MIN_ACTIVITY_REFRESH_GAP_MS = 60 * 1000;

async function checkSessionRequest() {
  const response = await fetch("/api/session");
  return response.ok;
}

function ProtectedRoute() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const lastRefreshRef = useRef(0);

  const refreshSession = useCallback(async () => {
    try {
      const ok = await checkSessionRequest();
      setIsAuthenticated(ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshOnActivity = () => {
      const now = Date.now();
      if (now - lastRefreshRef.current < MIN_ACTIVITY_REFRESH_GAP_MS) return;

      lastRefreshRef.current = now;
      void refreshSession();
    };

    const intervalId = window.setInterval(() => {
      void refreshSession();
    }, SESSION_REFRESH_INTERVAL_MS);

    window.addEventListener("click", refreshOnActivity, { passive: true });
    window.addEventListener("keydown", refreshOnActivity);
    window.addEventListener("touchstart", refreshOnActivity, { passive: true });
    window.addEventListener("scroll", refreshOnActivity, { passive: true });

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("click", refreshOnActivity);
      window.removeEventListener("keydown", refreshOnActivity);
      window.removeEventListener("touchstart", refreshOnActivity);
      window.removeEventListener("scroll", refreshOnActivity);
    };
  }, [isAuthenticated, refreshSession]);

  if (isChecking) {
    return (
      <Flex bg="pink.100" minH="100vh" justifyContent="center" overflow="hidden">
        <VStack gap={3} pt="28vh">
          <Spinner color="pink.500" size="lg" />
        </VStack>
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
