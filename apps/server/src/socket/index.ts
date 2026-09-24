import type { FastifyInstance } from "fastify/types/instance";
import { ServerWebSocket } from "./class";
import { createOBSWebSocket, disconnectOBSWebSocket } from "./obs";

async function obsWebsocket(fastify: FastifyInstance) {
    fastify.get("/ws/obs", { websocket: true }, (socket) => {
        const typedSocket = ServerWebSocket.attach(socket);

        typedSocket.send({
            event: "status",
            payload: { status: "connecting" }
        });

        typedSocket.onMessage(async (message) => {
            if (message.event !== "disconnect") return;

            void disconnectOBSWebSocket().catch((error) => {
                console.error("[SERVER] Failed to disconnect from OBS:", error);
            });
        });

        void createOBSWebSocket(typedSocket)
            .then(() => {
                typedSocket.send({
                    event: "connected"
                });
            })
            .catch((error) => {
                typedSocket.send({
                    event: "connection_failed"
                });

                console.log(error);
                typedSocket.close();
            });
    });
}

export default obsWebsocket;
