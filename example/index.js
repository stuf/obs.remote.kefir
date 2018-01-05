/* eslint-disable no-console */
/**
 * Simple example usage of how to connect with OBS WebSocket,
 * retrieving a list of available scenes as well as reacting to
 * whenever the scene list updates.
 */
const socket = require('../lib/socket');

const obs = socket.createSocket();

/**
 * Partially apply `socket.send` with the websocket, so that we
 * can send additional commands, without having to give the OBS
 * websocket object over and over.
 */
const command = socket.send(obs);

// Listen for some events

/**
 * Subscribe some event listeners to the OBS websocket.
 * This can also be applied partially like `command` above to
 * avoid passing the websocket object for every call.
 */
const onOpen$ = socket.listenTo(obs, 'open');
const onMessage$ = socket.listenTo(obs, 'message');

// Partially:

const listen = socket.listenTo(obs);

const onClose$ = listen('close');
const onError$ = listen('error');

/**
 * Retrieve the list of available scenes when the socket has been opened.
 */
onOpen$.onValue(() => {
  const scenes$ = command('GetSceneList');

  scenes$.log('scenes$');
});

onError$.onError(err => {
  console.error('Socket received an error:', err);
});

// Some additional debugging

onMessage$.log('onMessage');

onClose$.onValue(() => {
  console.info('WebSocket closed.');
});
