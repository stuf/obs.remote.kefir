/**
 * @module lib/types
 * @title Type checking
 * @import require('lib/types')
 */
const R = require('ramda');
const { env } = require('sanctuary');
const $ = require('sanctuary-def');
const Kefir = require('kefir');

const API = require('./api');

/**
 * @sig RequestType
 */
const ObsRequest =
  $.EnumType('obs.remote.kefir/ObsRequest',
             'https://github.com/stuf/obs.remote.kefir/README.md#Obs_Request',
             R.values(API.Request));

/**
 * @sig EventType
 */
const ObsEvent =
  $.EnumType('obs.remote.kefir/ObsEvent',
             'https://github.com/stuf/obs.remote.kefir/README.md#Obs_Event',
             R.values(API.Event));

//

// Observable

/**
 * @sig ObservableType
 */
const KefirObservable =
  $.NullaryType('obs.remote.kefir/KefirObservable',
                '',
                R.is(Kefir.Observable));

/**
 * @sig PropertyType
 */
const KefirProperty =
  $.NullaryType('obs.remote.kefir/KefirProperty',
                '',
                R.is(Kefir.Property));

/**
 * @sig StreamType
 */
const KefirStream =
  $.NullaryType('obs.remote.kefir/KefirStream',
                '',
                R.is(Kefir.Stream));

//

const def = $.create({
  env: $.env.concat([KefirObservable, KefirProperty, KefirStream, ]),
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
};
