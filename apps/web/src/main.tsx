import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@workspace/ui/globals.css";
import { Toaster } from "@workspace/ui/components/toast";
import { ThemeProvider } from "@/providers/theme-provider.tsx";
import { App } from "./App.tsx";
import { SettingsProvider } from "./providers/settings-provider.tsx";

// biome-ignore lint/style/noNonNullAssertion: root div will always exist
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <SettingsProvider>
                <App />
            </SettingsProvider>
        </ThemeProvider>
        <Toaster />
    </StrictMode>
);
