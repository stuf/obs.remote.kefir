// @ title Type checking
// @ ignore

const R = require('ramda');
const $ = require('sanctuary-def');
const Kefir = require('kefir');
const WS = require('ws');

const { Events, Requests } = require('./tokens');

const a = $.TypeVariable('a');
const b = $.TypeVariable('b');

const pkgName = 'obs.remote.kefir';
const ident = n => `${pkgName}/${n}`;
const url = n => `https://github.com/stuf/obs.remote.kefir#${n}`;

//. ### OBS types

//# ObsRequest
//.
//. Represents a `Request` in OBS.
const ObsRequest =
  $.EnumType(ident('ObsRequest'),
             url('ObsRequest'),
             Requests);

//# ObsEvent
//.
//. Represents an `Event` in OBS.
const ObsEvent =
  $.EnumType(ident('ObsEvent'),
             url('ObsEvent'),
             Events);

//

//. ### Observable

//# KefirObservable
//.
//. Represents a Kefir `Observable` instance.
const KefirObservable =
  $.NullaryType(ident('KefirObservable'),
                url('KefirObservable'),
                R.is(Kefir.Observable));

//# KefirProperty
//.
//. Represents a Kefir `Property` instance.
const KefirProperty =
  $.NullaryType(ident('KefirProperty'),
                url('KefirProperty'),
                R.is(Kefir.Property));

//# KefirStream
//.
//. Represents a Kefir `Stream` instance.
const KefirStream =
  $.NullaryType(ident('KefirStream'),
                url('KefirStream'),
                R.is(Kefir.Stream));

//

//# WebSocket
//.
//. Represents an instance of `WebSocket`
const WebSocket =
  $.NullaryType(ident('WebSocket'),
                url('WebSocket'),
                maybeWs =>
                  !!(R.is(WS, maybeWs) &&
                     R.has('onopen', maybeWs.__proto__) &&
                     R.has('onclose', maybeWs.__proto__)));

  //

const env =
  [KefirObservable,
   KefirProperty,
   KefirStream,
   ObsRequest,
   ObsEvent,
   WebSocket];

const def = $.create({
  env: $.env.concat(env),
  checkTypes: process.env.NODE_ENV !== 'production'
});

//

module.exports = {
  ObsRequest,
  ObsEvent,
  KefirObservable,
  KefirProperty,
  KefirStream,
  WebSocket,
  def,
  env,
  a,
  b
};
