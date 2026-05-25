import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { AppI18nProvider } from "./locales";
import { store } from "./store";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppI18nProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AppI18nProvider>
  </StrictMode>,
);
