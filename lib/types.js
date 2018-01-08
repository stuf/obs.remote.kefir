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
const Request =
  $.EnumType('obs.remote.kefir/ObsRequest',
             'https://github.com/stuf/obs.remote.kefir/README.md#Obs_Request',
             R.values(API.Request));

/**
 * @sig EventType
 */
const Event =
  $.EnumType('obs.remote.kefir/ObsEvent',
             'https://github.com/stuf/obs.remote.kefir/README.md#Obs_Event',
             R.values(API.Event));

//

const def = $.create({
  env,
  checkTypes: process.env.NODE_ENV !== 'production'
});

// Observable

/**
 * @sig ObservableType
 */
const Observable =
  $.NullaryType('obs.remote.kefir/ObsType',
                '',
                R.is(Kefir.Observable));

/**
 * @sig PropertyType
 */
const Property =
  $.NullaryType('obs.remote.kefir/PropertyType',
                '',
                R.is(Kefir.Property));

/**
 * @sig StreamType
 */
const Stream =
  $.NullaryType('obs.remote.kefir/StreamType',
                '',
                R.is(Kefir.Stream));

//

module.exports = {
  Request,
  Event,
  Observable,
  Property,
  Stream,
  def,
};
