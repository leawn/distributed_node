#!/usr/bin/env node

import { loadPackageDefinition, Server, ServerCredentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const pkg_def = loadSync(`${__dirname}/../shared/grpc_recipe.proto`);
const recipe = loadPackageDefinition(pkg_def).recipe;
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;
const server = new Server();
server.addService((recipe as any).RecipeService.service, {
    getMetaData: (_call: any, cb: any) => {
        cb(null, {
            pid: process.pid,
        });
    },
    getRecipe: (call: any, cb: any) => {
        if (call.request.id !== 42) {
            return cb(new Error(`Uknown recipe ${call.request.id}`));
        }
        cb(null, {
            id: 42, name: "Chicken Tikka Masala",
            steps: "Throw it in a pot...",
            ingredients: [
                { id: 1, name: "Chicken", quantity: "1 lb" },
                { id: 2, name: "Sauce", quantity: "2 cups" }
            ]
        });
    }
});

server.bindAsync(`${HOST}:${PORT}`, ServerCredentials.createInsecure(), (err, port) => {
    if (err) throw err;
    server.start();
    console.log(`Producer running at http://${HOST}:${port}`);
});