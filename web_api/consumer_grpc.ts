#!/usr/bin/env node

import * as util from "util";
import { credentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from "@grpc/proto-loader";
import fastify from "fastify";

const server = fastify();
const pkg_def = loadSync(`${__dirname}/../shared/grpc_recipe.proto`);
const recipe = loadPackageDefinition(pkg_def).recipe;
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "localhost:4000";

const client = new (recipe as any).RecipeService(TARGET, credentials.createInsecure());
const getMetaData = util.promisify(client.getMetaData.bind(client));
const getRecipe = util.promisify(client.getRecipe.bind(client));

server.get("/", async () => {
    const [meta, recipe] = await Promise.all([
        getMetaData({}),
        getRecipe({ id: 42 })
    ]);

    return {
        consumer_pid: process.pid,
        producer_data: meta,
        recipe
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Consumer running at http://${HOST}:${PORT}`);
})