export interface HealthStatus {
    status: "ok";
    uptime: number;
}

export interface ObsConnectionSettings {
    url: string;
    password: string;
}

export interface ObsConnectionSettingsResponse {
    url: string;
    hasPassword: boolean;
}

export type ObsConnectionSettingsUpdate = Partial<ObsConnectionSettings>;
