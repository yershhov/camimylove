import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const SESSION_REFRESH_INTERVAL_MS = 4 * 60 * 1000;
const MIN_ACTIVITY_REFRESH_GAP_MS = 60 * 1000;

async function checkSessionRequest() {
  const response = await fetch("/api/session");
  return response.ok;
}

function ProtectedRoute() {
  const { sessionAuthenticated, setSessionAuthenticated } =
    useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(sessionAuthenticated);
  const lastRefreshRef = useRef(0);

  const refreshSession = useCallback(async () => {
    try {
      const ok = await checkSessionRequest();
      setIsAuthenticated(ok);
      setSessionAuthenticated(ok);
    } catch {
      setIsAuthenticated(false);
      setSessionAuthenticated(false);
    }
  }, [setSessionAuthenticated]);

  useEffect(() => {
    setIsAuthenticated(sessionAuthenticated);
  }, [sessionAuthenticated]);

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
