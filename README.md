[![Maintainability](https://api.codeclimate.com/v1/badges/78fc583705036be7cb23/maintainability)](https://codeclimate.com/github/stuf/obs.remote.kefir/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/78fc583705036be7cb23/test_coverage)](https://codeclimate.com/github/stuf/obs.remote.kefir/test_coverage)
[![Build Status](https://travis-ci.org/stuf/obs.remote.kefir.svg?branch=master)](https://travis-ci.org/stuf/obs.remote.kefir)
[![npm version](https://badge.fury.io/js/obs.remote.kefir.svg)](https://badge.fury.io/js/obs.remote.kefir)

[OBS WebSocket](https://github.com/Palakis/obs-websocket) integration based on [Kefir streams](https://github.com/kefirjs/kefir) and [partial lenses](https://github.com/calmm-js/partial.lenses) for reactive applications.

---

# OBS Remote

## Contents

 * [Getting Started](#getting-started)
 * [About the API](#about-the-api)
 * [Reference](#reference)
   * [Sockets](#sockets)
     * [Core](#core)
       * [`createSocket_ :: (url, options) ~> WebSocket`](#createSocket_)
       * [`createSocket :: url -> options ~> Socket`](#createSocket)
     * [Listening to events](#listening-to-events)
       * [`listenTo_ :: (socket, type) ~> Observable`](#listenTo_)
       * [`listenToOnce_ :: (socket, type) ~> Observable`](#listenToOnce_)
       * [`listenTo :: socket -> type ~> Observable`](#listenTo)
       * [`listenToOnce :: socket -> type ~> Observable`](#listenToOnce)
     * [Sending commands](#sending-commands)
       * [`send_ :: (type, args, socket) ~> Observable`](#send_)
       * [`send2 :: (type, args) -> socket ~> Observable`](#send2)
       * [`send3 :: type -> args -> socket ~> Observable`](#send3)

## Getting Started

The library has only named exports. This allows you to import as much or as little as you want from it. Either by doing

```js
import * as socket from 'obs.remote.kefir';
```

or

```js
import { createSocket, send } from 'obs.remote.kefir';
```

## About the API

The public-facing API is with [`sanctuary-def`][sanctuary-def], to allow run-time type checking. This helps out a lot when working with data that's coming from the outside and allows to fail fast when introduced with something we're not expecting.

Note that run-time type checking has performance implications. Checking is disabled in production, but if you find you want to disable type checking, it can be disabled with the `DISABLE_TYPE_CHECKING` environment variable set to `1`;

```sh
stuf@local:~/project$ DISABLE_TYPE_CHECKING=1 node app.js
```

## Reference

<!--transcribe-->
## OBS

Contains functions for connecting to an OBS websocket,
observing OBS events as well as sending commands to the OBS
websocket.

```js
const OBS = require('obs.remote.kefir/lib/obs');
```

### Sessions

<h4 name="connect"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L34">connect :: String -⁠> WebSocket</a></code></h4>

<h4 name="listen_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L43">listen_ :: (WebSocket, (Object -⁠> Object)) -⁠> Observable</a></code></h4>

Listen to events from the given websocket, and uptionally apply
a custom transforming function on the result.

This is the uncurried and unchecked version of the function.

<h4 name="listen"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L55">listen :: WebSocket -⁠> Observable</a></code></h4>

Create an Observable from any events OBS emits.

All objects will be rewritten so that all `kebab-case` keys
will be transformed into `camelCase` keys.

If you want to override the default transforming function,
use [`listenWithTransformer`](#listenWithTransformer) instead.

Usually one creates an Observable from all events, and create
new Observables by filtering the events by their event name.
These can then be used on their own or by combining them
to ensure some computation or action is taken when both events
have occurred.

```js
const obsEvents = listen(ws);

obsEvents.filter(R.whereEq({ updateType: 'transition-begin' }))
         .onValue(e => {
           // Do something when transition begins
         });

obsEvents.filter(R.whereEq({ updateType: 'preview-scene-changed' }))
         .onValue(e => {
           // Do something when the preview scene is changed
         });
```

<h4 name="listenWithTransformer"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L90">listenWithTransformer :: WebSocket -⁠> (Object -⁠> Object) -⁠> Observable</a></code></h4>

Create an Observable from any events OBS emits, and transform the event
with the given function.


---
## Sockets

<a id="api-sockets"></a>

Handling websockets per se does not require anything extra,
besides using a library such as [`ws`][ws] if you're working
in a non-browser environment.

This library exposes a number of functions that can be used for
handling websockets through [`Kefir`][kefir] observables,
instead of using callbacks or Promises.

The functions this module exposes are meant for low-level handling
of websockets. For controlling OBS specifically, refer to
the [OBS](#api-obs) module.

```js
const socket = require('obs.remote.kefir/lib/socket');
```

### Core

<h4 name="createSocket_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L60">createSocket_ :: (String, Object) -⁠> WebSocket</a></code></h4>

Create a new websocket connection to the given `url` and `options`.

```js
const ws = createSocket('ws://localhost:4000');
```

<h4 name="createSocket"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L69">createSocket :: String -⁠> Object -⁠> WebSocket</a></code></h4>

Curried version of [`createSocket_`](#createSocket_). Creates a websocket.

```js
const newLocalSocket = createSocket('ws://localhost:4000');
const ws = newLocalSocket({ options: {} });
```

### Listening to events

<h4 name="listenTo_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L86">listenTo_ :: String -⁠> WebSocket -⁠> Observable</a></code></h4>

Listen for events of a certain type from the given socket.

```js
const messages = listenTo_('message', ws);
messages.onValue(msg => {
  // Do something
})
```

<h4 name="listenTo"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L100">listenTo :: String -⁠> WebSocket -⁠> Observable</a></code></h4>

Curried version of [`listenTo_`](#listenTo_)

Listen to events of a certain type from the given socket.
Often used as a helper for listening to an event from a bunch
of sockets.

```js
const messagesFrom = listenTo('message');
const messages = messagesFrom(webSocket);
const otherMessages = messagesFrom(anotherWebSocket);
```

Not that you can use [`R.flip`][R.flip] or [`S.flip`][S.flip] to
create a function that you can use to register different event
listeners from a single websocket.

```js
const listenFrom = S.flip(listenTo);
const listenFor = listenFrom(ws);
const messages = listenFor('message'); // Observable of messages emitted from websocket
const errors = listenFor('error'); // Observable of errors emitted from websocket
```

<h4 name="listenToOnce_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L129">listenToOnce_ :: (String, WebSocket) -⁠> Observable</a></code></h4>

Create an Observable of events, but emits only a single event, then ends.

It's identical to doing:

```js
listenTo(socket, 'open').take(1).onValue(v => {
  // Do something
})
```

<h4 name="listenToOnce"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L142">listenToOnce :: String -⁠> WebSocket -⁠> Observable</a></code></h4>

Curried version of [`listenToOnce_`](#listenToOnce_). Like with [`listenTo`](#listenTo)
can be used to easily create Observables of a single event.

It's identical to doing:

```js
const listenOnceFrom = S.flip(listenToOnce);
const onceForEvent = listenOnceFrom(ws);

onceForEvent('message').onValue(v => {
  // Do something
});
```

### Sending commands

<h4 name="send_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L173">send_ :: (String, Object, WebSocket) -⁠> Observable</a></code></h4>

Send `socket` a message of given `type` with optional arguments.

<h4 name="send2"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L197">send2 :: String -⁠> WebSocket -⁠> Observable</a></code></h4>

Curried binary version of [`send_`](#send_)

<h4 name="send3"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L206">send3 :: String -⁠> Object -⁠> WebSocket -⁠> Observable</a></code></h4>

Curried ternary version of [`send_`](#send_)


---
## Utilities

<h4 name="genFunc"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L11">genFunc :: ((String -⁠> String), String) -⁠> (String -⁠> String)</a></code></h4>

<h4 name="inList"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L14">inList :: a -⁠> POptic s a</a></code></h4>

<h4 name="getFromList"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L17">getFromList :: a -⁠> [a] -⁠> a</a></code></h4>

<h4 name="flatJoin"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L20">flatJoin :: [a] -⁠> String</a></code></h4>

<h4 name="getEvent"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L25">getEvent :: ObsEvent -⁠> String</a></code></h4>

<h4 name="getRequest"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L32">getRequest :: ObsRequest -⁠> String</a></code></h4>

<h4 name="splitPascal"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L40">splitPascal :: String -⁠> [String]</a></code></h4>

<h4 name="splitCamelCase"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L43">splitCamelCase :: String -⁠> [String]</a></code></h4>

<h4 name="camelCasePascal"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L48">camelCasePascal :: String -⁠> String</a></code></h4>

<h4 name="kebabCasePascal"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L54">kebabCasePascal :: String -⁠> String</a></code></h4>

<h4 name="constCasePascal"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L60">constCasePascal :: String -⁠> String</a></code></h4>

<h4 name="pascalCaseCamel"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L68">pascalCaseCamel :: String -⁠> String</a></code></h4>

<h4 name="pascalCaseKebab"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L74">pascalCaseKebab :: String -⁠> String</a></code></h4>

<h4 name="pascalCaseConst"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L80">pascalCaseConst :: String -⁠> String</a></code></h4>

<h4 name="camelCaseKebab"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L89">camelCaseKebab :: String -⁠> String</a></code></h4>

<!--/transcribe-->

## Acknowledgements

 * *You* ♡

[ws]: https://github.com/websockets/ws
[kefir]: https://kefirjs.github.io/kefir/
[sanctuary-def]: https://github.com/sanctuary-js/sanctuary-def
[R.flip]: http://ramdajs.com/docs/#flip
[S.flip]: https://sanctuary.js.org/#flip
