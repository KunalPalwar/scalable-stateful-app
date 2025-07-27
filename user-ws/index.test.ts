import { WebSocket } from 'ws';

describe('Chat Application', () => {
    test('Message sent from room1 reached to room2', async () => {
        const BASE_URL1 = 'ws://localhost:8080';
        const BASE_URL2 = 'ws://localhost:8081';
        const ws1 = new WebSocket(BASE_URL1);
        const ws2 = new WebSocket(BASE_URL2);

        await new Promise<void>((res, rej) => {
            let count = 0;
            ws1.onopen = () => {
                count = count + 1;
                if (count == 2) {
                    res();
                }
            };

            ws2.onopen = () => {
                count = count + 1;
                if (count == 2) {
                    res();
                }
            };
        });

        ws2.send(
            JSON.stringify({
                type: 'join-room',
                room: 'Room 1'
            })
        );
        ws1.send(
            JSON.stringify({
                type: 'join-room',
                room: 'Room 1'
            })
        );

        await new Promise<void>((resolve) => {
            ws2.onmessage = ({ data }) => {
                const d = JSON.parse(data.toString());
                expect(d.message).toBe('Hi, there');
                resolve();
            };

            ws1.send(
                JSON.stringify({
                    type: 'chat',
                    room: 'Room 1',
                    message: 'Hi, there'
                })
            );
        });
    });
});
