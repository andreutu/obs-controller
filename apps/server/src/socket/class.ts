import type { ClientWebSocketMessage, ServerWebSocketMessage } from "@workspace/types";

interface SocketLike {
    readonly readyState: number;
    send(data: string): void;
    close(): void;
    on(event: string, listener: (...args: unknown[]) => void): unknown;
}

export class ServerWebSocket {
    static readonly OPEN = 1;
    private static readonly clients = new Set<ServerWebSocket>();
    private readonly socket: SocketLike;

    private constructor(socket: SocketLike) {
        this.socket = socket;
    }

    static attach(socket: SocketLike): ServerWebSocket {
        const client = new ServerWebSocket(socket);

        client.on("close", () => ServerWebSocket.clients.delete(client));

        ServerWebSocket.clients.add(client);

        return client;
    }

    static broadcast(message: ServerWebSocketMessage): void {
        for (const client of ServerWebSocket.clients) {
            if (client.readyState === ServerWebSocket.OPEN) {
                client.socket.send(JSON.stringify(message));
            }
        }
    }

    get readyState() {
        return this.socket.readyState;
    }

    send(message: ServerWebSocketMessage): void {
        ServerWebSocket.broadcast(message);
    }

    close(): void {
        this.socket.close();
    }

    on(event: string, listener: (...args: unknown[]) => void): void {
        this.socket.on(event, listener);
    }

    onMessage(listener: (message: ClientWebSocketMessage) => void): void {
        this.socket.on("message", (data) => {
            listener(JSON.parse(String(data)) as ClientWebSocketMessage);
        });
    }
}
