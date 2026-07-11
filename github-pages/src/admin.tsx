import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/globals.css";
import { MessageModerationPage } from "@/src/components/admin/MessageModerationPage";

window.__TRIBUTE_ASSET_BASE__ = import.meta.env.BASE_URL || "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MessageModerationPage />
  </StrictMode>,
);
