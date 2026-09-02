import type { ObsConnectionSettingsResponse, ObsConnectionSettingsUpdate } from "@workspace/types";
import type { FastifyInstance } from "fastify/types/instance";

let websocketURL = "ws://127.0.0.1:4455";
let websocketPassword = "";

async function settingsRoute(fastify: FastifyInstance) {
    fastify.get("/", (): ObsConnectionSettingsResponse => {
        return {
            url: websocketURL,
            hasPassword: Boolean(websocketPassword)
        };
    });

    fastify.put("/", (request, reply) => {
        const data = request.body as ObsConnectionSettingsUpdate;
        const url = data.url;
        const password = data.password;

        if (url && typeof url === "string") websocketURL = url;
        if ((password || password === "") && typeof password === "string") websocketPassword = password;

        if (url || password || password === "") return reply.code(200).send();

        reply.code(400).send();
    });
}

export default settingsRoute;
