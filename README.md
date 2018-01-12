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
   * [OBS](#obs)
     * [Sessions](#sessions)
       * [`connect :: String -⁠> WebSocket`](#obs-connect)
       * [`listen_ :: (WebSocket, (Object -⁠> Object)) -⁠> Observable`](#obs-listen_)
       * [`listen :: WebSocket -⁠> Observable`](#obs-listen)
       * [`listenWithTransformer :: WebSocket -⁠> (Object -⁠> Object) -⁠> Observable`](#obs-listenWithTransformer)
       * [`command_ :: (String, Object, WebSocket) -⁠> Observable`](#obs-command_)
       * [`command :: String -⁠> WebSocket -⁠> Observable`](#obs-command)
       * [`commandWithArgs :: String -⁠> Object -⁠> WebSocket -⁠> Observable`](#obs-commandWithArgs)
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
   * [Utilities](#utilities)
     * [`genFunc :: (String -⁠> Function) -⁠> (String -⁠> String)`](#util-genFunc)
     * [`inList :: a -⁠> POptic s a`](#util-inList)
     * [`getFromList :: Foldable f => a -⁠> f a -⁠> a`](#util-getFromList)
     * [`flatJoin :: [a] -⁠> String`](#util-flatJoin)
     * [`getEvent :: ObsEvent -⁠> String`](#util-getEvent)
     * [`getRequest :: ObsRequest -⁠> String`](#util-getRequest)
     * [`splitPascal :: String -⁠> [String]`](#util-splitPascal)
     * [`splitCamelCase :: String -⁠> [String]`](#util-splitCamelCase)
     * [`camelCasePascal :: String -⁠> String`](#util-camelCasePascal)
     * [`kebabCasePascal :: String -⁠> String`](#util-kebabCasePascal)
     * [`constCasePascal :: String -⁠> String`](#util-constCasePascal)
     * [`pascalCaseCamel :: String -⁠> String`](#util-pascalCaseCamel)
     * [`pascalCaseKebab :: String -⁠> String`](#util-pascalCaseKebab)
     * [`pascalCaseConst :: String -⁠> String`](#util-pascalCaseConst)
     * [`camelCaseKebab :: String -⁠> String`](#util-camelCaseKebab)
 * [Acknowledgements](#acknowledgements)

---

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

### OBS

Contains functions for connecting to an OBS websocket,
observing OBS events as well as sending commands to the OBS
websocket.

```js
const OBS = require('obs.remote.kefir/lib/obs');
```

#### Sessions

<h5 name="connect"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L35">connect :: String -⁠> WebSocket</a></code></h5>

<h5 name="listen_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L44">listen_ :: (WebSocket, (Object -⁠> Object)) -⁠> Observable</a></code></h5>

Listen to events from the given websocket, and uptionally apply
a custom transforming function on the result.

This is the uncurried and unchecked version of the function.

<h5 name="listen"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L56">listen :: WebSocket -⁠> Observable</a></code></h5>

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

<h5 name="listenWithTransformer"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L91">listenWithTransformer :: WebSocket -⁠> (Object -⁠> Object) -⁠> Observable</a></code></h5>

Create an Observable from any events OBS emits, and transform the event
with the given function.

<h5 name="command_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L103">command_ :: (String, Object, WebSocket) -⁠> Observable</a></code></h5>

Send a command with optional arguments to the given websocket.
Uncurried.

<h5 name="command"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L109">command :: String -⁠> WebSocket -⁠> Observable</a></code></h5>

Send a command without arguments to the given websocket.
Curried, takes two arguments.

<h5 name="commandWithArgs"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/obs.js#L119">commandWithArgs :: String -⁠> Object -⁠> WebSocket -⁠> Observable</a></code></h5>

Send a command with arguments to the given websocket.
Curried, takes three arguments.


---
### Sockets

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

#### Core

<h5 name="createSocket_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L60">createSocket_ :: (String, Object) -⁠> WebSocket</a></code></h5>

Create a new websocket connection to the given `url` and `options`.

```js
const ws = createSocket('ws://localhost:4000');
```

<h5 name="createSocket"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L69">createSocket :: String -⁠> Object -⁠> WebSocket</a></code></h5>

Curried version of [`createSocket_`](#createSocket_). Creates a websocket.

```js
const newLocalSocket = createSocket('ws://localhost:4000');
const ws = newLocalSocket({ options: {} });
```

#### Listening to Events

<h5 name="listenTo_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L86">listenTo_ :: String -⁠> WebSocket -⁠> Observable</a></code></h5>

Listen for events of a certain type from the given socket.

```js
const messages = listenTo_('message', ws);
messages.onValue(msg => {
  // Do something
})
```

<h5 name="listenTo"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L100">listenTo :: String -⁠> WebSocket -⁠> Observable</a></code></h5>

Curried version of [`listenTo_`](#listenTo_)

Listen to events of a certain type from the given socket.
Often used as a helper for listening to an event from a bunch
of sockets.

```js
const messagesFrom = listenTo('message');
const messages = messagesFrom(webSocket);
const otherMessages = messagesFrom(anotherWebSocket);
```

Note that you can use [`R.flip`][R.flip] or [`S.flip`][S.flip] to
create a function that you can use to register different event
listeners from a single websocket.

```js
const listenFrom = S.flip(listenTo);
const listenFor = listenFrom(ws);
const messages = listenFor('message'); // Observable of messages emitted from websocket
const errors = listenFor('error'); // Observable of errors emitted from websocket
```

<h5 name="listenToOnce_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L129">listenToOnce_ :: (String, WebSocket) -⁠> Observable</a></code></h5>

Create an Observable of events, but emits only a single event, then ends.

It's identical to doing:

```js
listenTo(socket, 'open').take(1).onValue(v => {
  // Do something
})
```

<h5 name="listenToOnce"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L142">listenToOnce :: String -⁠> WebSocket -⁠> Observable</a></code></h5>

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

#### Sending Commands

<h5 name="send_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L173">send_ :: (String, Object, WebSocket) -⁠> Observable</a></code></h5>

Send `socket` a message of given `type` with optional arguments.

<h5 name="send2"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L200">send2 :: String -⁠> WebSocket -⁠> Observable</a></code></h5>

Curried binary version of [`send_`](#send_)

<h5 name="send3"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/socket.js#L209">send3 :: String -⁠> Object -⁠> WebSocket -⁠> Observable</a></code></h5>

Curried ternary version of [`send_`](#send_)


---
### Utilities

<a id="api-utilities"></a>
Contains some generic utilities for handling string tokens of
different kinds, and conversion functions for them—e.g. for
creating isomorphisms on tokens, to avoid having to manually convert
tokens back and forth when interfacing with OBS.

<h5 name="genFunc"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L22">genFunc :: (String -⁠> Function) -⁠> (String -⁠> String)</a></code></h5>

<h5 name="inList"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L25">inList :: a -⁠> POptic s a</a></code></h5>

<h5 name="getFromList"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L28">getFromList :: Foldable f => a -⁠> f a -⁠> a</a></code></h5>

Find the item `x` from the given list of `xs` and return it.

<h5 name="flatJoin"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L36">flatJoin :: [a] -⁠> String</a></code></h5>

Utility for joining nested arrays of strings into a string.

<h5 name="getEvent"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L43">getEvent :: ObsEvent -⁠> String</a></code></h5>

Get the string representation of the given OBS event type.

<h5 name="getRequest"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L51">getRequest :: ObsRequest -⁠> String</a></code></h5>

Get the string representation of the given OBS request type.

<h5 name="splitPascal"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L60">splitPascal :: String -⁠> [String]</a></code></h5>

Split a pascal-cased string into an array of words.

<h5 name="splitCamelCase"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L68">splitCamelCase :: String -⁠> [String]</a></code></h5>

Split a camelcased string into an array of words.

<h5 name="camelCasePascal"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L78">camelCasePascal :: String -⁠> String</a></code></h5>

Get the camel-case version of a pascal-cased string.

```js
camelCasePascal('FooBar'); // => 'fooBar'

<h5 name="kebabCasePascal"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L90">kebabCasePascal :: String -⁠> String</a></code></h5>

Get the kebab-case version of a pascal-cased string.

```js
kebabCasePascal('FooBar'); // => 'foo-bar'
```

<h5 name="constCasePascal"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L103">constCasePascal :: String -⁠> String</a></code></h5>

Get the "const-cased" version of a pascal-cased string.

```js
constCasePascal('FooBar'); // => 'FOO_BAR'
```

<h5 name="pascalCaseCamel"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L118">pascalCaseCamel :: String -⁠> String</a></code></h5>

<h5 name="pascalCaseKebab"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L125">pascalCaseKebab :: String -⁠> String</a></code></h5>

<h5 name="pascalCaseConst"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L132">pascalCaseConst :: String -⁠> String</a></code></h5>

<h5 name="camelCaseKebab"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/lib/util.js#L142">camelCaseKebab :: String -⁠> String</a></code></h5>


<!--/transcribe-->

## Acknowledgements

 * *You* ♡

[ws]: https://github.com/websockets/ws
[kefir]: https://kefirjs.github.io/kefir/
[sanctuary-def]: https://github.com/sanctuary-js/sanctuary-def
[R.flip]: http://ramdajs.com/docs/#flip
[S.flip]: https://sanctuary.js.org/#flip
