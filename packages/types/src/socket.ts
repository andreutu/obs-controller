export interface WebSocketMessage<TEvent extends string, TPayload = undefined> {
    event: TEvent;
    payload?: TPayload;
}

export type SocketConnectionStatus = "idle" | "connecting" | "connected" | "disconnected";

/** WebSocket messages sent from the server to the client (S -> C). */
export type ServerWebSocketMessage =
    | WebSocketMessage<"connected">
    | WebSocketMessage<"connection_failed">
    | WebSocketMessage<"disconnected", { reason: string }>
    | WebSocketMessage<"status", { status: SocketConnectionStatus }>;

/** WebSocket messages sent from the client to the server (C -> S). */
export type ClientWebSocketMessage = WebSocketMessage<"disconnect">;
