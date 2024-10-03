"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
const port = 3000;
// Start the Express server
const server = app.listen(port, () => {
    console.log(`Express server running on port: ${port}`);
});
// Initialize the WebSocket server with no default HTTP server
const wss = new ws_1.WebSocketServer({ noServer: true });
// Middleware for handling HTTP requests
app.get('/', (req, res) => {
    res.send('Hello! WebSocket server is running.');
});
// Intercept the upgrade event on the Express server to verify the WebSocket origin
server.on('upgrade', (request, socket, head) => {
    const origin = request.headers.origin;
    // Example: Allow connections only from a trusted origin
    if (origin !== 'http://trusted.com') {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy(); // Close the connection if the origin is not trusted
        return;
    }
    // If the origin is valid, proceed with the WebSocket handshake
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
// WebSocket server handling the connection event
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('message', (message) => {
        console.log('Received message:', message);
    });
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});
