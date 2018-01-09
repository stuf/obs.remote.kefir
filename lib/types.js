/**
 * @module lib/types
 * @title Type checking
 * @import require('lib/types')
 */
const R = require('ramda');
const $ = require('sanctuary-def');
const Kefir = require('kefir');

const API = require('./api');

const a = $.TypeVariable('a');
const b = $.TypeVariable('b');

const pkgName = 'obs.remote.kefir';
const ident = n => `${pkgName}/${n}`;
const url = n => `https://github.com/stuf/obs.remote.kefir#${n}`;

/**
 * @sig RequestType
 */
const ObsRequest =
  $.EnumType(ident('ObsRequest'),
             url('ObsRequest'),
             R.values(API.Request));

/**
 * @sig EventType
 */
const ObsEvent =
  $.EnumType(ident('ObsEvent'),
             url('ObsEvent'),
             R.values(API.Event));

//

// Observable

/**
 * @sig ObservableType
 */
const KefirObservable =
  $.NullaryType(ident('KefirObservable'),
                url('KefirObservable'),
                R.is(Kefir.Observable));

/**
 * @sig PropertyType
 */
const KefirProperty =
  $.NullaryType(ident('KefirProperty'),
                url('KefirProperty'),
                R.is(Kefir.Property));

/**
 * @sig StreamType
 */
const KefirStream =
  $.NullaryType(ident('KefirStream'),
                url('KefirStream'),
                R.is(Kefir.Stream));

//

const def = $.create({
  env: $.env.concat([KefirObservable, KefirProperty, KefirStream]),
  checkTypes: process.env.NODE_ENV !== 'production'
});

//

module.exports = {
  ObsRequest,
  ObsEvent,
  KefirObservable,
  KefirProperty,
  KefirStream,
  def,
  env: [KefirObservable, KefirProperty, KefirStream, ObsRequest, ObsEvent],
  a,
  b
};
