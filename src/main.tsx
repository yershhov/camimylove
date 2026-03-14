import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "./components/ui/Provider";
import { Toaster } from "./components/ui/Toaster";
import { i18nReady } from "./i18n";

void i18nReady.then(() => {
  createRoot(document.getElementById("root")!).render(
    <Provider>
      <BrowserRouter>
        <Toaster />
        <App />
      </BrowserRouter>
    </Provider>,
  );
});
