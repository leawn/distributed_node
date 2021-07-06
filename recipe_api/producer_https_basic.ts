#!/usr/bin/env node

import * as fs from "fs";
import fastify from "fastify";

const server = fastify({
    https: {
        key: fs.readFileSync(`${__dirname}/tls/producer_private_key.key`),
        cert: fs.readFileSync(`${__dirname}/../shared/tls/producer_certificate.cert`),
    }
});
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

console.log(`worker pid=${process.pid}`);

server.get("/recipes/:id", async (req, reply) => {
    console.log(`worker request pid=${process.pid}`);
    const id = Number((req.params as { id: string }).id);
    if (id !== 42) {
        reply.statusCode = 404;
        return { error: "not_found" };
    }
    return {
        producer_pid: process.pid,
        recipe: {
            id, name: "Chicken Ticka Masala",
            steps: "Throw it in a pot...",
            ingredients: [
                { id: 1, name: "Chicken", quantity: "1 lb" },
                { id: 2, name: "Sauce", quantity: "2 cups" }
            ]
        }
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Producer running at http://${HOST}:${PORT}`);
});