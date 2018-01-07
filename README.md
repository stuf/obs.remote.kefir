[![Maintainability](https://api.codeclimate.com/v1/badges/78fc583705036be7cb23/maintainability)](https://codeclimate.com/github/stuf/obs.remote.kefir/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/78fc583705036be7cb23/test_coverage)](https://codeclimate.com/github/stuf/obs.remote.kefir/test_coverage)
[![Build Status](https://travis-ci.org/stuf/obs.remote.kefir.svg?branch=master)](https://travis-ci.org/stuf/obs.remote.kefir)

[OBS WebSocket](https://github.com/Palakis/obs-websocket) integration based on [Kefir streams](https://github.com/kefirjs/kefir) and [partial lenses](https://github.com/calmm-js/partial.lenses)

---

# OBS Remote

## Contents

 * [Getting Started](#getting-started)
 * [Reference](#reference)
   * [Sockets (low-level)](#sockets)
     * [`createSocket(url, options) ~> Socket`](#createsocket)
   * [Listening to events](#listening-to-events)
     * [`listenTo_(socket, type) ~> Observable`](#listen-to_)
     * [`listenToOnce_ :: (socket, type) ~> Observable`](#listen-to-once_)
     * [`listenFor_ :: (type, socket) ~> Observable`](#listen-for_)
     * [`listenTo :: socket -> type ~> Observable`](#listen-to)
     * [`listenToOnce :: socket -> type ~> Observable`](#listen-to-once)
     * [`listenFor :: type -> socket ~> Observable`](#listen-for)
   * [Sending commands](#sending-commands)
     * [`send_ :: (socket, type, args) ~> Observable`](#send_)
     * [`send2 :: socket -> (type, args) ~> Observable`](#send2)
     * [`send3 :: socket -> type -> args ~> Observable`](#send3)
     * [`sendWith_ :: (type, socket[, args]) ~> Observable`](#sendWith_)
     * [`sendWith2 :: type -> (socket[, args]) ~> Observable`](#sendWith2)
     * [`sendWith3 :: type -> socket -> args ~> Observable`](#sendWith3)

## Getting Started

```js
import * as socket from 'obs.remote.kefir';
```

or

```js
import { createSocket, send } from 'obs.remote.kefir';
```

## Reference

### Sockets (low-level)

#### <a id="createSocket"></a> [`createSocket :: (url, options) -> socket`](#createSocket")

Creates and connects a WebSocket to the given `url` with possible `options`.

```js
const ws = createSocket('ws://localhost:8080');
```

### Listening to events

#### <a id="listenTo_"></a> [`listenTo_ :: (socket, type) ~> Observable`](#listenTo_)

Listen to events of `type` from the given `socket`.

Returns an `Observable` containing any events emitted from `socket`.

#### <a id="listenTo"></a> [`listenTo :: socket -> type ~> Observable`](#listenTo)

Curried version of [`listenTo_`](#listenTo_)

#### <a id="listenToOnce_"></a> [`listenToOnce_ :: (socket, type) ~> Observable`](#listenToOnce_)

Listen to a single event of `type` from the given `socket`.

Returns an `Observable` containing any events emitted from `socket`. `Observable` ends after the first value.

#### <a id="listenToOnce"></a> [`listenToOnce :: socket -> type ~> Observable`](#listenToOnce)

Curried version of [`listenToOnce_`](#listenToOnce_)

#### <a id="listenFor_"></a> [`listenFor_ :: (type, socket) ~> Observable`](#listenFor_)

Listen to events of `type` from the given `socket`.

Identical to [`listenTo_`](#listenTo_), but arguments' order is flipped. Alone, it might not make any sense, see [`listenFor`](#listenFor) for explanation.

#### <a id="listenFor"></a> [`listenFor ::  type -> socket ~> Observable`](#listenFor)

Curried version of [`listenFor_`](#listenFor_). This might not make sense in the start, but this function can be used as a semantic helper for specifying events to be listened for, and at some later stage supply the websocket itself.

```js
// some-file.js
export const listenForMessages = listenFor('message');

// index.js
import { listenForMessages } from './some-file';

const ws = ...

const messages = listenForMessages(ws);x
```

### Sending commands

#### <a id="send_"></a> [`send_ :: (socket, type[, args]) ~> Observable`](#send_)

The basic, uncurried function of sending a request to the OBS WebSocket. Returns an `Observable` with the result of the request, either with a `value` of the result, or an `error` if the request resulted in an error.

```js
const scenes = send_(ws, 'GetSceneList', {});

scenes.log('scenes');
// => [sceneObj1, sceneObj2, ..., sceneObjN]
```

#### <a id="send2"></a> [`send2 :: socket -> (type[, args]) ~> Observable`](#send2)

Curried binary version of `send_` that takes an optional third argument. Returns an `Observable` containing the result.

```js
const command = send2(socket);

const scenes = command('GetSceneList');
const switchScene = command('SetCurrentScene', { 'scene-name': 'foo' });
```

#### <a id="send3"></a> [`send3 :: socket -> type -> args ~> Observable`](#send3)

Curried ternary version of `send_` that takes three arguments. Returns an `Observable` containing the result.

```js
// Returns a function that expects the `args` argument
const setScene = send3(socket, 'SetCurrentScene');

setScene({ 'scene-name': 'foo' });
setScene({ 'scene-name': 'bar' });
```

#### <a id="sendWith_"></a> [`sendWith_ :: (type, socket[, args]) ~> Observable`](#sendWith_)

#### <a id="sendWith2"></a> [`sendWith2 :: type -> (socket[, args]) ~> Observable`](#sendWith2)

#### <a id="sendWith3"></a> [`sendWith3 :: type -> socket -> args ~> Observable`](#sendWith3)
