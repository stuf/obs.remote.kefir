// @ title Sockets
//. <a id="api-sockets"></a>
//.
//. Handling websockets per se does not require anything extra,
//. besides using a library such as [`ws`][ws] if you're working
//. in a non-browser environment.
//.
//. This library exposes a number of functions that can be used for
//. handling websockets through [`Kefir`][kefir] observables,
//. instead of using callbacks or Promises.
//.
//. The functions this module exposes are meant for low-level handling
//. of websockets. For controlling OBS specifically, refer to
//. the [OBS](#api-obs) module.
//.
//. ```js
//. const socket = require('obs.remote.kefir/lib/socket');
//. ```
const WebSocket = require('ws');
const { curry2, curry3 } = require('sanctuary');
const U = require('karet.util');
const R = require('ramda');
const L = require('partial.lenses');
const $ = require('sanctuary-def');
const { stream } = require('kefir');

const debug = require('debug')('obs.remote:socket');

const M = require('./meta');

const {
  def,
  WebSocket: WebSocketT,
  KefirObservable: KefirObservableT
} = require('./types');

// Private

const emitForSocketEvent = curry3((type, socket, emitter) => {
  debug('Attaching listener to event `%s`', type);

  const valueCb = event => emitter.emit(event);
  const errorCb = err => emitter.error(err);
  const closeCb = event => { emitter.emit(event); emitter.end(); };

  switch(type) {
    case 'error':
      socket.on('error', errorCb);
      break;
    case 'close':
      socket.on('close', closeCb);
      break;
    default:
      socket.on(type, valueCb);
  }
});

//. #### Core

//# createSocket_ :: (String, Object) -> WebSocket
//.
//. Create a new websocket connection to the given `url` and `options`.
//.
//. ```js
//. const ws = createSocket('ws://localhost:4000');
//. ```
const createSocket_ = (url, options) => new WebSocket(url, options);

//# createSocket :: String -> Object -> WebSocket
//.
//. Curried version of [`createSocket_`](#createSocket_). Creates a websocket.
//.
//. ```js
//. const newLocalSocket = createSocket('ws://localhost:4000');
//. const ws = newLocalSocket({ options: {} });
//. ```
const createSocket =
  def('createSocket2', {},
      [$.String, $.Object, WebSocketT],
      curry2(createSocket_));

//

//. #### Listening to Events

//# listenTo_ :: String -> WebSocket -> Observable
//.
//. Listen for events of a certain type from the given socket.
//.
//. ```js
//. const messages = listenTo_('message', ws);
//. messages.onValue(msg => {
//.   // Do something
//. })
//. ```
const listenTo_ = (type, socket) =>
  U.seq(stream(emitForSocketEvent(type, socket)),
        U.skipUnless(R.identity));

//# listenTo :: String -> WebSocket -> Observable
//.
//. Curried version of [`listenTo_`](#listenTo_)
//.
//. Listen to events of a certain type from the given socket.
//. Often used as a helper for listening to an event from a bunch
//. of sockets.
//.
//. ```js
//. const messagesFrom = listenTo('message');
//. const messages = messagesFrom(webSocket);
//. const otherMessages = messagesFrom(anotherWebSocket);
//. ```
//.
//. Note that you can use [`R.flip`][R.flip] or [`S.flip`][S.flip] to
//. create a function that you can use to register different event
//. listeners from a single websocket.
//.
//. ```js
//. const listenFrom = S.flip(listenTo);
//. const listenFor = listenFrom(ws);
//. const messages = listenFor('message'); // Observable of messages emitted from websocket
//. const errors = listenFor('error'); // Observable of errors emitted from websocket
//. ```
const listenTo =
  def('listenTo', {},
      [$.String, WebSocketT, KefirObservableT],
      curry2(listenTo_));

//# listenToOnce_ :: (String, WebSocket) -> Observable
//.
//. Create an Observable of events, but emits only a single event, then ends.
//.
//. It's identical to doing:
//.
//. ```js
//. listenTo(socket, 'open').take(1).onValue(v => {
//.   // Do something
//. })
//. ```
const listenToOnce_ = (type, socket) => U.seq(listenTo(socket, type), U.takeFirst(1));

//# listenToOnce :: String -> WebSocket -> Observable
//.
//. Curried version of [`listenToOnce_`](#listenToOnce_). Like with [`listenTo`](#listenTo)
//. can be used to easily create Observables of a single event.
//.
//. It's identical to doing:
//.
//. ```js
//. const listenOnceFrom = S.flip(listenToOnce);
//. const onceForEvent = listenOnceFrom(ws);
//.
//. onceForEvent('message').onValue(v => {
//.   // Do something
//. });
//. ```
const listenToOnce =
  def('listenToOnce',
      {},
      [$.String, WebSocketT, KefirObservableT],
      listenToOnce_);

//

//. #### Sending Commands

let requestCounter = 0;

const getRequestId = () => `${requestCounter++}`;

const getObsMessage = id => `obs:internal:message-${id}`;

//# send_ :: (String, Object, WebSocket) -> Observable
//.
//. Send `socket` a message of given `type` with optional arguments.
const send_ = (type, args = {}, socket) => {
  const id = getObsMessage(getRequestId());

  const socketArgs =
    L.set(M.Request.identifierL, { id, type }, args);

  const response =
    U.seq(socket,
          listenTo(id),
          U.template,
          U.lift1(JSON.parse),
          U.skipUnless(R.whereEq({ 'message-id': id })),
          U.takeFirst(1))
     // remove this .log please
     .log(`response ${id}`)
     .offLog();

  socket.send(JSON.stringify(socketArgs), err => {
    if (err) throw err;
  });

  return response;
};

//# send2 :: String -> WebSocket -> Observable
//.
//. Curried binary version of [`send_`](#send_)
const send2 =
  def('send2',
      {},
      [$.String, WebSocketT, KefirObservableT],
      (url, socket) => send_(url, undefined, socket));

//# send3 :: String -> Object -> WebSocket -> Observable
//.
//. Curried ternary version of [`send_`](#send_)
const send3 =
  def('send3',
      {},
      [$.String, $.Object, WebSocketT, KefirObservableT],
      curry3(send_));

//

module.exports = {
  createSocket,
  createSocket_,
  listenTo,
  listenTo_,
  listenToOnce,
  listenToOnce_,
  send_,
  send2,
  send3
};
