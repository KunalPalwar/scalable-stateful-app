import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
interface Room {
    sockets: WebSocket[];
}

export type Data = {
    type: string;
    room: string;
    message: string;
};

const rooms: Record<string, Room> = {};

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
            rooms[parsedJson.room].sockets.map((soc) => {
                soc.send(data);
            });
        }
    });
});
