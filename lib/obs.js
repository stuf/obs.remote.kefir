//. <a id="api-obs"></a>
//. ## OBS
//.
//. Contains functions for connecting to an OBS websocket,
//. observing OBS events as well as sending commands to the OBS
//. websocket.
//.
//. ```js
//. const OBS = require('obs.remote.kefir/lib/obs');
//. ```
const U = require('karet.util');
const R = require('ramda');
const L = require('partial.lenses');
const { curry2, flip } = require('sanctuary');
const $ = require('sanctuary-def');
const { createSocket, listenTo } = require('./socket');
const T = require('./types');
const { camelCaseKebab } = require('./util');

const {
  def,
  WebSocket: WebSocketT,
  KefirObservable: KefirObservableT
} = T;

const listenFor = flip(listenTo);

const camelCaseKeys = L.modify(L.keys, camelCaseKebab);

const isEventMessage = R.has('update-type');

//. ## OBS

//. ### Sessions

//# connect :: String -> WebSocket
const connect =
  def('connect',
      {},
      [$.String, WebSocketT],
      url => createSocket(url, undefined));

//

//# listen_ :: (WebSocket, (Object -> Object)) -> Observable
//.
//. Listen to events from the given websocket, and uptionally apply
//. a custom transforming function on the result.
//.
//. This is the uncurried and unchecked version of the function.
const listen_ = (socket, fn = camelCaseKeys) =>
  U.seq(socket,
        listenFor('message'),
        U.skipUnless(isEventMessage),
        U.lift1(fn));

//# listen :: WebSocket -> Observable
//.
//. Create an Observable from any events OBS emits.
//.
//. All objects will be rewritten so that all `kebab-case` keys
//. will be transformed into `camelCase` keys.
//.
//. If you want to override the default transforming function,
//. use [`listenWithTransformer`](#listenWithTransformer) instead.
//.
//. Usually one creates an Observable from all events, and create
//. new Observables by filtering the events by their event name.
//. These can then be used on their own or by combining them
//. to ensure some computation or action is taken when both events
//. have occurred.
//.
//. ```js
//. const obsEvents = listen(ws);
//.
//. obsEvents.filter(R.whereEq({ updateType: 'transition-begin' }))
//.          .onValue(e => {
//.            // Do something when transition begins
//.          });
//.
//. obsEvents.filter(R.whereEq({ updateType: 'preview-scene-changed' }))
//.          .onValue(e => {
//.            // Do something when the preview scene is changed
//.          });
//. ```
const listen =
  def('listen',
      {},
      [WebSocketT, KefirObservableT],
      socket => listen_(socket));

//# listenWithTransformer :: WebSocket -> (Object -> Object) -> Observable
//.
//. Create an Observable from any events OBS emits, and transform the event
//. with the given function.
const listenWithTransformer =
  def('listenWithTransformer',
      {},
      [WebSocketT, $.AnyFunction, KefirObservableT],
      curry2(listen_));

//

module.exports = {
  connect,
  listen_,
  listen,
  listenWithTransformer
};
