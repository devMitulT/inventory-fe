import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryProvider } from "./lib/QueryProvider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/Tooltip/tooltip.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <TooltipProvider>
          <App />
          <Toaster />
        </TooltipProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
