import OBSWebSocket from "obs-websocket-js";
import { settingsStore } from "../store/settings";
import { ServerWebSocket } from "./class";

let obs: OBSWebSocket | undefined;
let connectionPromise: Promise<OBSWebSocket> | undefined;

export async function disconnectOBSWebSocket() {
    const client = obs;

    if (!client) {
        connectionPromise = undefined;
        return;
    }

    try {
        await client.disconnect();
    } finally {
        if (obs === client) {
            obs = undefined;
            connectionPromise = undefined;
        }
    }
}

export async function createOBSWebSocket(serverSocket: ServerWebSocket): Promise<OBSWebSocket> {
    if (obs) return obs;
    if (connectionPromise) return connectionPromise;

    connectionPromise = (async () => {
        const { url, password } = settingsStore.getAll();
        const client = new OBSWebSocket();

        await client.connect(url, password);

        // Register Extensions
        client.on("ConnectionClosed", () => {
            if (serverSocket.readyState === ServerWebSocket.OPEN) {
                serverSocket.send({
                    event: "disconnected",
                    payload: { reason: "OBS connection closed" }
                });
            }
        });

        obs = client;
        return obs;
    })();

    try {
        return await connectionPromise;
    } catch (error) {
        console.error("[SERVER] Failed to connect to the OBS WebSocket on the local computer: ");
        console.log(error);
        throw error;
    }
}
