import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8082 });

let servers = [] as WebSocket[];

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  servers.push(ws);
  ws.on("message", function message(data: string) {
    console.log("-----Message come to relay-------");
    servers.map((socket) => socket.send(data));
  });
});
