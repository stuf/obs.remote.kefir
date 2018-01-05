const WebSocket = require('ws');
const L = require('partial.lenses');

const socket = require('../lib/socket');

const typeIn = L.get('request-type');

describe('socket', () => {
  let wss;

  afterEach(() => {
    wss.close();
  });

  test('should make a successful request', done => {
    wss = new WebSocket.Server({ port: 4500 }, () => {
      const { address, port } = wss._server.address();
      const socketAddress = `ws://${address}:${port}`;

      const ws = socket.createSocket(socketAddress);

      socket.listenTo(ws, 'message').onValue(v => {
        const data = JSON.parse(v);
        const type = typeIn(data);

        if (type === 'GetSceneList') {
          ws.send(JSON.stringify({ got: type }), handleErr);
        }
        else {
          ws.send(JSON.stringify({ got: type, shouldBe: 'GetSceneList' }), handleErr);
        }
      });
    });

    const handleErr = err => {
      if (err) throw err;
    };

    wss.on('connection', ws => {
      socket.listenTo(ws, 'message').onValue(v => {
        const data = JSON.parse(v);
        expect(data.got).toBe('GetSceneList');
        done();
      });

      socket.send(ws, 'GetSceneList');

      ws.close();
    });
  });
});
