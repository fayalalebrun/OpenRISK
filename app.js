const express = require("express");
const http = require("http");
const websocket = require("ws");

const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));

const server = http.createServer(app);

server.listen(port);
