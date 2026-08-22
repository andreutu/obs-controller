import { networkInterfaces } from "node:os";
import type { HealthStatus } from "@workspace/types";
import Fastify from "fastify";

function getLocalAddress(): string | undefined {
    for (const addresses of Object.values(networkInterfaces())) {
        for (const address of addresses ?? []) {
            if (address.family === "IPv4" && !address.internal) {
                return address.address;
            }
        }
    }
}

const PORT = Number(process.env.SERVER_PORT ?? 3000);
const HOST = process.env.SERVER_HOST ?? "0.0.0.0";

const server = Fastify({
    logger: true
});

server.get("/health", async (): Promise<HealthStatus> => {
    return {
        status: "ok",
        uptime: process.uptime()
    };
});

try {
    await server.listen({ host: HOST, port: PORT });

    console.log(`[SERVER] Server running on ${HOST}`);
    console.log(`[SERVER] Server listening at`);
    console.log(`\thttp://127.0.0.1:${PORT}`);
    console.log(`\thttp://${getLocalAddress()}:${PORT}`);
} catch (error) {
    server.log.error(error);
    process.exit(1);
}
