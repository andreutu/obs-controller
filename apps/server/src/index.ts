import type { HealthStatus } from "@workspace/types";
import Fastify from "fastify";

const server = Fastify({
    logger: true
});

server.get("/health", async (): Promise<HealthStatus> => {
    return {
        status: "ok",
        uptime: process.uptime()
    };
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

try {
    await server.listen({ host, port });
} catch (error) {
    server.log.error(error);
    process.exit(1);
}
