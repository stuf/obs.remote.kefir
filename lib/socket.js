const WebSocket = require('ws');
const { curry2, curry3, flip } = require('sanctuary');
const U = require('karet.util');
const R = require('ramda');
const L = require('partial.lenses');
const { stream } = require('kefir');

const debug = require('debug')('obs.remote:socket');

//

const defaultOpts = {
  address: 'ws://localhost:4444'
};

//

const createSocket = (opts = defaultOpts) => new WebSocket(opts);

//

/**
 * From a given `socket`, listen to events of `type`.
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @returns {Observable}
 */
const listenTo_ = (socket, type) =>
  stream(emitter => {
    debug('Attaching listener to event `%s`', type);

    const eventCb = data => {
      emitter.emit(data);
    };

    socket.on(type, eventCb);
  });

/**
 * Curried version of `listenTo_`
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @returns {Observable}
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
 */
const listenToOnce_ = (socket, type) => U.seq(listenTo(type, socket), U.takeFirst(1));

/**
 * Curried version of `listenToOnce_`
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
 */
const listenFor_ = (type, socket) => flip(listenTo_, type, socket);

const listenFor = curry2(listenFor_);

//

let requestCounter = 0;

const getRequestId = () => `${requestCounter++}`;

const getObsMessage = id => `obs:internal:message-${id}`;

const send_ = (socket, type, args = {}) => {
  const id = getObsMessage(getRequestId());

  const listen = listenTo_(socket);

  const socketArgs =
    L.set(L.pick({ id: 'message-id',
                   type: 'request-type' }),
          { id, type },
          args);

  const response =
    U.seq(listen(id),
          U.template,
          U.lift1(JSON.parse),
          U.skipUnless(R.whereEq({ 'message-id': id })),
          U.takeFirst(1));

  socket.send(JSON.stringify(socketArgs));

  return response;
};

/**
 * Curried binary version of `send_`
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @param {any} [args={}]
 * @returns {Observable}
 */
const send2 = curry2(send_);

/**
 * Curried ternary version of `send_`.
 *
 * @param {WebSocket} socket
 * @param {String} type
 * @param {any} args
 * @returns {Observable}
 */
const send3 = curry3(send_);

//

module.exports = {
  createSocket,
  listenTo,
  listenTo_,
  listenToOnce,
  listenToOnce_,
  send_,
  send2,
  send3
};
