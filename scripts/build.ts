/// <reference types="bun" />

import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const ROOT_DIRECTORY = path.join(import.meta.dir, "..");
const DIST_DIRECTORY = path.join(ROOT_DIRECTORY, "dist");
const WEB_DIST_DIRECTORY = path.join(ROOT_DIRECTORY, "apps/web/dist");
const WEB_OUTPUT_DIRECTORY = path.join(DIST_DIRECTORY, "web");
const SERVER_ENTRYPOINT = path.join(ROOT_DIRECTORY, "apps/server/src/index.ts");

const TARGETS: { name: string; target: Bun.Build.CompileTarget }[] = [
    {
        name: "obs-controller-linux-x64",
        target: "bun-linux-x64"
    },
    {
        name: "obs-controller-windows-x64.exe",
        target: "bun-windows-x64"
    }
];

// async function run(command: string[]) {
//     const child = Bun.spawn(command, {
//         cwd: ROOT_DIRECTORY,
//         stderr: "inherit",
//         stdout: "inherit"
//     });

//     const exitCode = await child.exited;

//     if (exitCode !== 0) {
//         throw new Error(`Command failed: ${command.join(" ")}`);
//     }
// }

await rm(DIST_DIRECTORY, { force: true, recursive: true });
await mkdir(DIST_DIRECTORY, { recursive: true });

const indexHtml = Bun.file(path.join(WEB_DIST_DIRECTORY, "index.html"));

await cp(WEB_DIST_DIRECTORY, WEB_OUTPUT_DIRECTORY, { recursive: true });

if (!(await indexHtml.exists())) {
    throw new Error(`Web build output not found at ${WEB_DIST_DIRECTORY}`);
}

for (const { name, target } of TARGETS) {
    const result = await Bun.build({
        entrypoints: [SERVER_ENTRYPOINT],
        compile: {
            target: target,
            outfile: path.join(DIST_DIRECTORY, name)
        },
        define: {
            "process.env.NODE_ENV": JSON.stringify("production")
        }
    });

    if (!result.success) {
        for (const log of result.logs) {
            console.error(log);
        }

        throw new Error(`Failed to build ${name}`);
    }
}

console.log(`Built binaries and web assets in ${DIST_DIRECTORY}.`);
