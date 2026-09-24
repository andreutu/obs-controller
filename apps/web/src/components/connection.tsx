import type { ClientWebSocketMessage, ServerWebSocketMessage, SocketConnectionStatus } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import { DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { toast } from "@workspace/ui/components/toast";
import { useRef, useState } from "react";

function getWebsocketUrl() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    return `${protocol}//${window.location.host}/ws/obs`;
}

export function ConnectionDialog() {
    const socketRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<SocketConnectionStatus>("idle");

    function send(message: ClientWebSocketMessage) {
        const socket = socketRef.current;

        console.log(socket, socket?.readyState);
        if (socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
    }

    function connect() {
        socketRef.current?.close();

        const socket = new WebSocket(getWebsocketUrl());
        socketRef.current = socket;

        socket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data) as ServerWebSocketMessage;

            switch (message.event) {
                case "connected":
                    setStatus("connected");
                    toast.add({ description: "Successfully connected to OBS!", type: "success" });
                    break;
                case "connection_failed":
                    setStatus("idle");
                    toast.add({ description: "Couldn't connect to OBS.", type: "error" });
                    break;
                case "disconnected":
                    setStatus("disconnected");
                    toast.add({ description: "OBS WebSocket has been closed.", type: "error" });
                    break;
                default:
                    break;
            }
        });

        socket.addEventListener("close", () => {
            setStatus("idle");
            socketRef.current = null;
        });
    }

    function disconnect() {
        send({ event: "disconnect" });
        setStatus("idle");
        socketRef.current?.close();
        socketRef.current = null;
    }

    return (
        <>
            <DialogHeader className="gap-0">
                <DialogTitle className="text-xl font-bold">WebSocket Connection</DialogTitle>
            </DialogHeader>

            <p>Status: {status}</p>

            <div className="flex flex-row gap-1">
                <Button className="flex-1" onClick={connect} disabled={!!socketRef.current}>
                    Connect
                </Button>

                <Button className="flex-1" onClick={disconnect} disabled={!socketRef.current}>
                    Disconnect
                </Button>
            </div>
        </>
    );
}
