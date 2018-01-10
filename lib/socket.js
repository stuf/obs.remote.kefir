/**
 * @module lib/socket
 * @title Socket (low-level)
 * @import require('lib/socket')
 */
const WebSocket = require('ws');
const { curry2, curry3 } = require('sanctuary');
const U = require('karet.util');
const R = require('ramda');
const L = require('partial.lenses');
const $ = require('sanctuary-def');
const { stream } = require('kefir');

const debug = require('debug')('obs.remote:socket');

const M = require('./meta');
// const T = require('./types');

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

//. ## Core

//# createSocket_ :: (String, Object) -> WebSocket
//.
//. Create a new websocket connection to the given `url` and `options`.
//.
//. This version is not curried.
const createSocket_ = (url, options) => new WebSocket(url, options);

//# createSocket :: String -> Object -> WebSocket
//.
//. Create a websocket.
//.
//. ```js
//. const ws = createSocket('ws://localhost:4000');
//. ```
//.
//. Curried version [`createSocket_`](#createSocket_)
const createSocket =
  def('createSocket2', {},
      [$.String, $.Object, WebSocketT],
      createSocket_);

//

//. ## Listening to events

//# listenTo_ :: String -> WebSocket -> Observable
//.
//. From a given `socket`, listen to events of `type`.
//.
//. Curried version of [`listenTo_`](#listenTo_)
const listenTo_ = (type, socket) =>
  U.seq(stream(emitForSocketEvent(type, socket)),
        U.skipUnless(R.identity));

//# listenTo :: (WebSocket, String) -> Observable
//.
//. From a given `socket`, listen to events of `type`.
//.
//. Curried version of [`listenTo_`](#listenTo_)
const listenTo =
  def('listenTo', {},
      [$.String, WebSocketT, KefirObservableT],
      listenTo_);

//# listenToOnce_ :: (WebSocket, String) -> Observable
//.
//. Utility function for listening to a single value from an event.
//.
//. It's identical to doing:
//.
//. ```js
//. listenTo(socket, 'open').take(1)
//. ```
const listenToOnce_ = (type, socket) => U.seq(listenTo(socket, type), U.takeFirst(1));

//# listenToOnce :: String -> WebSocket -> Observable
//.
//. Utility function for listening to a single value from an event.
//.
//. It's identical to doing:
//.
//. ```js
//. listenTo(socket, 'open').take(1)
//. ```
const listenToOnce =
  def('listenToOnce',
      {},
      [$.String, WebSocketT, KefirObservableT],
      curry2(listenToOnce_));

//

//. ## Sending commands

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
          U.takeFirst(1)).log(`response ${id}`).offLog(); // remove this .log please

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
      send_);

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
