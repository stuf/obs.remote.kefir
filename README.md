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
<!--/transcribe-->
