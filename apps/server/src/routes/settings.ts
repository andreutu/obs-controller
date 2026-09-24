import type { ObsConnectionSettingsResponse, ObsConnectionSettingsUpdate } from "@workspace/types";
import type { FastifyInstance } from "fastify/types/instance";
import { settingsStore } from "../store/settings";

async function settingsRoute(fastify: FastifyInstance) {
    fastify.get("/", (): ObsConnectionSettingsResponse => {
        return {
            url: settingsStore.get("url"),
            hasPassword: Boolean(settingsStore.get("password"))
        };
    });

    fastify.put("/", (request, reply) => {
        const data = request.body as ObsConnectionSettingsUpdate;
        const url = data.url;
        const password = data.password;

        if (url && typeof url === "string") settingsStore.set("url", url);
        if ((password || password === "") && typeof password === "string") settingsStore.set("password", password);

        if (url || password || password === "") return reply.code(200).send();

        reply.code(400).send();
    });
}

export default settingsRoute;
