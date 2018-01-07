const WebSocket = require('ws');
const { curry2, curry3, flip } = require('sanctuary');
const U = require('karet.util');
const R = require('ramda');
const L = require('partial.lenses');
const { stream } = require('kefir');

const debug = require('debug')('obs.remote:socket');

const M = require('./meta');

//

/**
 * Create a new websocket
 *
 * @param {*} [opts={}]
 * @returns {WebSocket}
 * @sig (String[, Object]) ~> WebSocket
 */
const createSocket = (url = 'ws://localhost:4444', opts = {}) =>
  new WebSocket(url, opts);

//

/**
 * From a given `socket`, listen to events of `type`.
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @returns {Observable}
 * @sig WebSocket -> String ~> Observable
 */
const listenTo_ = (socket, type) =>
  stream(emitter => {
    debug('Attaching listener to event `%s`', type);

    const valueCb = event => emitter.emit(event.data);
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
        socket.addEventListener(type, valueCb);
        // socket.on(type, valueCb);
    }
  });

/**
 * Curried version of `listenTo_`
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @returns {Observable}
 * @sig WebSocket -> String ~> Observable
 */
const listenTo = curry2(listenTo_);

/**
 * Utility function for listening to a single value from an event.
 *
 * It's identical to doing:
 *
 * ```js
 * listenTo(socket, 'open').take(1)
 * ```
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @returns {Observable}
 * @sig (WebSocket, String) ~> Observable
 */
const listenToOnce_ = (socket, type) => U.seq(listenTo(type, socket), U.takeFirst(1));

/**
 * Curried version of `listenToOnce_`
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @returns {Observable}
 * @sig WebSocket -> String ~> Observable
 */
const listenToOnce = curry2(listenToOnce_);

/**
 * Utility function for listening to events of `type` from a given `socket`.
 * It's the `flip`ped version of `listenTo`, so the function takes in arguments in
 * reverse order.
 *
 * @param {String} type
 * @param {WebSocket} socket
 * @returns {Observable}
 * @sig (String, WebSocket) ~> Observable
 */
const listenFor_ = (type, socket) => flip(listenTo_, type, socket);

/**
 * Curried version of `listenFor_`
 *
 * @param {String} type
 * @param {WebSocket} socket
 * @returns {Observable}
 * @sig String -> WebSocket ~> Observable
 */
const listenFor = curry2(listenFor_);

//

let requestCounter = 0;

const getRequestId = () => `${requestCounter++}`;

const getObsMessage = id => `obs:internal:message-${id}`;

/**
 * Send `socket` a message of given `type` with optional arguments.
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @param {Object} [args={}]
 * @returns {Observable}
 * @sig (WebSocket, String, Object) ~> Observable
 */
const send_ = (socket, type, args = {}) => {
  const id = getObsMessage(getRequestId());

  const listen = listenTo(socket);

  const socketArgs =
    L.set(M.Request.identifierL, { id, type }, args);

  const response =
    U.seq(listen(id),
          U.template,
          U.lift1(JSON.parse),
          U.skipUnless(R.whereEq({ 'message-id': id })),
          U.takeFirst(1)).log(`response ${id}`).offLog(); // remove this .log please

  socket.send(JSON.stringify(socketArgs), err => {
    if (err) throw err;
  });

  return response;
};

/**
 * Curried binary version of `send_`
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @param {Object} [args={}]
 * @returns {Observable}
 * @sig WebSocket -> (String[, Object]) ~> Observable
 */
const send2 = curry2(send_);

/**
 * Curried ternary version of `send_`.
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @param {Object} args
 * @returns {Observable}
 * @sig WebSocket -> String -> Object ~> Observable
 */
const send3 = curry3(send_);

/**
 * Use the binary curried function `send2` as the default `send` function
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @param {Object} [args={}]
 * @returns {Observable}
 * @sig (WebSocket, String[, Object]) ~> Observable
 */
const send = send2;

/**
 *
 * @param {String} type
 * @param {WebSocket} socket
 * @param {Object} [args={}]
 * @returns {Observable}
 * @sig (String, WebSocket) ~> Observable
 */
const sendWith_ = (type, socket, args = {}) => send_(socket, type, args);

/**
 * @param {String} type
 * @param {WebSocket} socket
 * @returns {Observable}
 * @sig String -> WebSocket ~> Observable
 */
const sendWith2 = curry2(sendWith_);

/**
 * @param {String} type
 * @param {Object} args
 * @param {WebSocket} socket
 * @returns Observable
 * @sig String -> Object -> WebSocket ~> Observable
 */
const sendWith3 = curry3(sendWith_);

//

module.exports = {
  createSocket,
  listenTo,
  listenTo_,
  listenToOnce,
  listenToOnce_,
  listenFor,
  listenFor_,
  send,
  send_,
  send2,
  send3,
  sendWith_,
  sendWith2,
  sendWith3
};
