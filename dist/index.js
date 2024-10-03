"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const port = 3000;
const app = (0, express_1.default)();
const httpserver = app.listen(port, () => {
    console.log(`Server is running on : ${port}`);
});
const websocketserver = new ws_1.WebSocketServer({
    noServer: true
});
app.get("/", (req, res) => {
    res.send("Welcome to QNA Chat Application");
});
const testOrigin = (url) => {
    console.log(`Origin is : ${url}`);
    return true;
};
httpserver.on("upgrade", (request, socket, head) => {
    const origin = request.headers.origin || "";
    if (!testOrigin(origin)) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
    }
    websocketserver.handleUpgrade(request, socket, head, (ws) => {
        websocketserver.emit("connection", ws, request);
    });
});
websocketserver.on("connection", (socket) => {
    console.log("Connected");
    socket.on("message", (data, binary) => {
        console.log("data is " + data);
        let message;
        if (typeof data == "string") {
            message = data;
        }
        else if (data instanceof Buffer) {
            message = data.toString("utf-8");
        }
        websocketserver.clients.forEach((client) => {
            client.send(message);
        });
    });
    socket.send("HEllo from server ");
});
