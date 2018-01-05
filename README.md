
[OBS WebSocket](https://github.com/Palakis/obs-websocket) integration based on [Kefir streams](https://github.com/kefirjs/kefir) and [partial lenses](https://github.com/calmm-js/partial.lenses)

---

# OBS Remote

## Contents

 * [Getting Started](#getting-started)
 * [Reference](#reference)
   * [Sockets](#sockets)
     * [`createSocket(url, options) -> Socket`](#createsocket)
   * [Listening to events](#listening-to-events)
     * [`listenTo_(socket, type) -> Observable`](#listen-to_)
     * [`listenTo(socket, type) -> Observable`](#listen-to)
     * [`listenToOnce_(socket, type) -> Observable`](#listen-to-once_)
     * [`listenToOnce(socket, type) -> Observable`](#listen-to-once)
     * [`listenFor_(type, socket) -> Observable`](#listen-for_)
     * [`listenFor(type, socket) -> Observable`](#listen-for)
   * [Sending commands](#sending-commands)
     * [`send_(socket, type, args) -> Observable`](#send_)
     * [`send2(socket, type, args) -> Observable`](#send2)
     * [`send3(socket, type, args) -> Observable`](#send3)

## Getting Started

```js
import * as socket from 'obs.remote.kefir';
```

or

```js
import { createSocket, send } from 'obs.remote.kefir';
```

## Reference

### Sockets

#### <a id="createSocket"></a> [`createSocket (url, opts) -> socket`](#createSocket")

### Listening to events

#### <a id="listenTo_"></a> [`listenTo_ (socket, type) -> Observable`](#listenTo_)

#### <a id="listenTo"></a> [`listenTo socket -> type -> Observable`](#listenTo)

#### <a id="listenToOnce_"></a> [`listenToOnce_ (socket, type) -> Observable`](#listenToOnce_)

#### <a id="listenToOnce"></a> [`listenToOnce socket -> type -> Observable`](#listenToOnce)

#### <a id="listenFor_"></a> [`listenFor_ (type, socket) -> Observable`](#listenFor_)

#### <a id="listenFor"></a> [`listenFor type -> socket -> Observable`](#listenFor)

### Sending commands

#### <a id="send_"></a> [`send_ (socket, type, args) -> Observable`](#send_)

The basic, uncurried function of sending a request to the OBS WebSocket. Returns an `Observable` with the result of the request, either with a `value` of the result, or an `error` if the request resulted in an error.

```js
const scenes = send_(ws, 'GetSceneList', {});

scenes.log('scenes');
// => [sceneObj1, sceneObj2, ..., sceneObjN]
```

#### <a id="send2"></a> [`send2 socket -> (type[, args]) -> Observable`](#send2)

Curried binary version of `send_` that takes an optional third argument. Returns an `Observable` containing the result.

```js
const command = send2(socket);

const scenes = command('GetSceneList');
const switchScene = command('SetCurrentScene', { 'scene-name': 'foo' });
```

#### <a id="send3"></a> [`send3 socket -> type -> args -> Observable`](#send3)

Curried ternary version of `send_` that takes three arguments. Returns an `Observable` containing the result.

```js
// Returns a function that expects the `args` argument
const setScene = send3(socket, 'SetCurrentScene');

setScene({ 'scene-name': 'foo' });
setScene({ 'scene-name': 'bar' });
```
