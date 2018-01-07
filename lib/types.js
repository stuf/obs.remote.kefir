const R = require('ramda');
const { create, env } = require('sanctuary');
const type = require('sanctuary-type-identifiers');
const $ = require('sanctuary-def');
const Kefir = require('kefir');

const API = require('./api');

/**
 * @sig Request :: RequestType
 */
const Request =
  $.EnumType('obs.remote.kefir/ObsRequest',
             'https://github.com/stuf/obs.remote.kefir/README.md#Obs_Request',
             R.values(API.Request));

/**
 * @sig Event :: EventType
 */
const Event =
  $.EnumType('obs.remote.kefir/ObsEvent',
             'https://github.com/stuf/obs.remote.kefir/README.md#Obs_Event',
             R.values(API.Event));

const def = $.create({
  env,
  checkTypes: process.env.NODE_ENV !== 'production'
});

// Observable

const Observable =
  $.NullaryType('obs.remote.kefir/ObsType',
                'https://github.com/stuf/obs.remote.kefir#ObsType',
                R.is(Kefir.Observable));

//

module.exports = {
  Request,
  Event,
  Observable,
  def
};
