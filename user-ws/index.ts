import { WebSocketServer, WebSocket as WebSockerType } from 'ws';

interface Room {
    sockets: WebSockerType[];
}

export type Data = {
    type: string;
    room: string;
    message: string;
};

const rooms: Record<string, Room> = {};

const wss = new WebSocketServer({ port: 8080 });
let relayServer = new WebSockerType('ws://localhost:8082');

relayServer.onmessage = ({ data }) => {
    const parsedJson = JSON.parse(data.toString());
    if (parsedJson.type === 'chat') {
        rooms[parsedJson.room].sockets.map((socket) => socket.send(data));
    }
};

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data: string) {
        const parsedJson = JSON.parse(data);
        const room = parsedJson.room;
        if (parsedJson.type === 'join-room') {
            if (!rooms[room]) {
                rooms[room] = { sockets: [] };
            }
            rooms[room].sockets.push(ws);
        }

        if (parsedJson.type === 'chat') {
            relayServer.send(data);
        }
    });
});
