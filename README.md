[![Maintainability](https://api.codeclimate.com/v1/badges/78fc583705036be7cb23/maintainability)](https://codeclimate.com/github/stuf/obs.remote.kefir/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/78fc583705036be7cb23/test_coverage)](https://codeclimate.com/github/stuf/obs.remote.kefir/test_coverage)
[![Build Status](https://travis-ci.org/stuf/obs.remote.kefir.svg?branch=master)](https://travis-ci.org/stuf/obs.remote.kefir)
[![npm version](https://badge.fury.io/js/obs.remote.kefir.svg)](https://badge.fury.io/js/obs.remote.kefir)

[OBS WebSocket](https://github.com/Palakis/obs-websocket) integration based on [Kefir streams](https://github.com/kefirjs/kefir) and [partial lenses](https://github.com/calmm-js/partial.lenses)

---

# OBS Remote

## Contents

 * [Getting Started](#getting-started)
 * [Reference](#reference)
   * [Sockets (low-level)](#sockets)
     * [`createSocket(url, options) ~> Socket`](#createsocket)
   * [Listening to events](#listening-to-events)
     * [`listenTo_(socket, type) ~> Observable`](#listenTo_)
     * [`listenToOnce_ :: (socket, type) ~> Observable`](#listenToOnce_)
     * [`listenTo :: socket -> type ~> Observable`](#listenTo)
     * [`listenToOnce :: socket -> type ~> Observable`](#listenToOnce)
   * [Sending commands](#sending-commands)
     * [`send_ :: (socket, type, args) ~> Observable`](#send_)
     * [`send2 :: socket -> (type, args) ~> Observable`](#send2)
     * [`send3 :: socket -> type -> args ~> Observable`](#send3)

## Getting Started

```js
import * as socket from 'obs.remote.kefir';
```

or

```js
import { createSocket, send } from 'obs.remote.kefir';
```

## Reference

<!--transcribe-->

## Core

<h3 name="createSocket_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/./lib/socket.js#L48">createSocket_ :: (String, Object) -⁠> WebSocket</a></code></h3>

Create a new websocket connection to the given `url` and `options`.

This version is not curried.

<h3 name="createSocket"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/./lib/socket.js#L55">createSocket :: String -⁠> Object -⁠> WebSocket</a></code></h3>

Create a websocket.

```js
const ws = createSocket('ws://localhost:4000');
```

Curried version [`createSocket_`](#createSocket_)

## Listening to events

<h3 name="listenTo_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/./lib/socket.js#L73">listenTo_ :: String -⁠> WebSocket -⁠> Observable</a></code></h3>

From a given `socket`, listen to events of `type`.

Curried version of [`listenTo_`](#listenTo_)

<h3 name="listenTo"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/./lib/socket.js#L82">listenTo :: (WebSocket, String) -⁠> Observable</a></code></h3>

From a given `socket`, listen to events of `type`.

Curried version of [`listenTo_`](#listenTo_)

<h3 name="listenToOnce_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/./lib/socket.js#L92">listenToOnce_ :: (WebSocket, String) -⁠> Observable</a></code></h3>

Utility function for listening to a single value from an event.

It's identical to doing:

```js
listenTo(socket, 'open').take(1)
```

<h3 name="listenToOnce"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/./lib/socket.js#L103">listenToOnce :: String -⁠> WebSocket -⁠> Observable</a></code></h3>

Utility function for listening to a single value from an event.

It's identical to doing:

```js
listenTo(socket, 'open').take(1)
```

## Sending commands

<h3 name="send_"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/./lib/socket.js#L128">send_ :: (String, Object, WebSocket) -⁠> Observable</a></code></h3>

Send `socket` a message of given `type` with optional arguments.

<h3 name="send2"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/./lib/socket.js#L152">send2 :: String -⁠> WebSocket -⁠> Observable</a></code></h3>

Curried binary version of [`send_`](#send_)

<h3 name="send3"><code><a href="https://github.com/stuf/obs.remote.kefir/blob/master/./lib/socket.js#L161">send3 :: String -⁠> Object -⁠> WebSocket -⁠> Observable</a></code></h3>

Curried ternary version of [`send_`](#send_)

<!--/transcribe-->
