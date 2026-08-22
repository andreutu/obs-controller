import { networkInterfaces } from "node:os";
import path from "node:path";
import fastifyStatic from "@fastify/static";
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

const PRODUCTION = process.env.NODE_ENV === "production";
const PORT = Number(process.env.SERVER_PORT ?? 3000);
const HOST = process.env.SERVER_HOST ?? "0.0.0.0";

const server = Fastify({
    logger: !PRODUCTION
});

if (PRODUCTION) {
    server.register(fastifyStatic, {
        root: path.join(process.cwd(), "public")
    });

    server.setNotFoundHandler((request, reply) => {
        if (request.url.startsWith("/api/")) {
            return reply.code(404).send({ error: "Not Found" });
        }

        return reply.sendFile("index.html");
    });
}

server.get("/api/health", async (): Promise<HealthStatus> => {
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
