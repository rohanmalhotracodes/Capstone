import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "./hooks/useAuth";
import { SolarDataProvider } from "./hooks/useSolarData";
import { ToastProvider } from "./hooks/useToast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <SolarDataProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SolarDataProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
