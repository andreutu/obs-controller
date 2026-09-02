import type { ObsConnectionSettingsResponse } from "@workspace/types";
import { toast } from "@workspace/ui/components/toast";
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";

interface SettingsContextValue {
    websocketUrl: string;
    setWebsocketUrl: (url: string) => void;
    hasWebsocketPassword: boolean;
    setHasWebsocketPassword: (password: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: PropsWithChildren) {
    const [websocketUrl, setWebsocketUrl] = useState("ws://127.0.0.1:4455");
    const [hasWebsocketPassword, setHasWebsocketPassword] = useState(false);

    useEffect(() => {
        const getSettings = async () => {
            try {
                const response = await fetch("/api/settings");
                const data = (await response.json()) as ObsConnectionSettingsResponse;
                if (!data.url) return;

                setWebsocketUrl(data.url);
                setHasWebsocketPassword(data.hasPassword);
            } catch (error) {
                toast.add({
                    description: "Couldn't retrieve settings from the server.",
                    type: "error"
                });

                console.error(error);
            }
        };

        getSettings();
    }, []);

    return (
        <SettingsContext.Provider
            value={{
                hasWebsocketPassword: hasWebsocketPassword,
                websocketUrl: websocketUrl,
                setHasWebsocketPassword: setHasWebsocketPassword,
                setWebsocketUrl: setWebsocketUrl
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }

    return context;
}
