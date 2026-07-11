import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/globals.css";
import { TributeApp } from "@/src/components/tribute/TributeApp";
import { tributeData } from "@/src/data/tributeData";

window.__TRIBUTE_ASSET_BASE__ = import.meta.env.BASE_URL || "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TributeApp data={tributeData} />
  </StrictMode>,
);
