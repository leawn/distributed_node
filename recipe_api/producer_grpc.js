#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var grpc_js_1 = require("@grpc/grpc-js");
var proto_loader_1 = require("@grpc/proto-loader");
var pkg_def = proto_loader_1.loadSync(__dirname + "/../shared/grpc_recipe.proto");
var recipe = grpc_js_1.loadPackageDefinition(pkg_def).recipe;
var HOST = process.env.HOST || "127.0.0.1";
var PORT = process.env.PORT || 4000;
var server = new grpc_js_1.Server();
server.addService(recipe.RecipeService.service, {
    getMetaData: function (_call, cb) {
        cb(null, {
            pid: process.pid
        });
    },
    getRecipe: function (call, cb) {
        if (call.request.id !== 42) {
            return cb(new Error("Uknown recipe " + call.request.id));
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
server.bindAsync(HOST + ":" + PORT, grpc_js_1.ServerCredentials.createInsecure(), function (err, port) {
    if (err)
        throw err;
    server.start();
    console.log("Producer running at http://" + HOST + ":" + port);
});
