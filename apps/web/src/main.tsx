import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { App } from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion: root div will always exist
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>
);
