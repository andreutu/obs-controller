export interface HealthStatus {
    status: "ok";
    uptime: number;
}

export interface ObsConnectionSettingsResponse {
    url: string;
    hasPassword: boolean;
}

export interface ObsConnectionSettingsUpdate {
    url?: string;
    password?: string;
}

export type ObsClientMessage =
    | {
          type: "connect";
          url: string;
          password?: string;
      }
    | {
          type: "disconnect";
      }
    | {
          type: "get-version";
      };

export type ObsServerMessage =
    | {
          type: "status";
          status: "idle" | "connecting" | "connected" | "disconnected";
          message?: string;
      }
    | {
          type: "version";
          obsVersion?: string;
          obsWebSocketVersion?: string;
      }
    | {
          type: "event";
          event: string;
          data: unknown;
      }
    | {
          type: "error";
          message: string;
      };
