const { WebSocket } = require('mock-socket');

// global.WebSocket = WebSocket;

global.eq = (i, o) => expect(i).toBe(o);
