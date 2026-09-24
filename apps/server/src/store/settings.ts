import type { ObsConnectionSettings } from "@workspace/types";

type SettingsStoreKey = keyof ObsConnectionSettings;

class SettingsStore {
    private settings: ObsConnectionSettings = {
        url: "ws://127.0.0.1:4455",
        password: ""
    };

    set(key: SettingsStoreKey, value: string) {
        this.settings[key] = value;
    }

    get(key: SettingsStoreKey) {
        return this.settings[key];
    }

    getAll() {
        return this.settings;
    }
}

export const settingsStore = new SettingsStore();
