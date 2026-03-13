import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "./components/ui/Provider";
import { Toaster } from "./components/ui/Toaster";

createRoot(document.getElementById("root")!).render(
  <Provider>
    <BrowserRouter>
      <Toaster />
      <App />
    </BrowserRouter>
  </Provider>
);
