/**
 * @module lib/obs
 * @title OBS
 * @import require('lib/obs')
 * @ignore
 */
const { curry2 } = require('sanctuary');
const { send3, sendWith2, sendWith3 } = require('./socket');
const { Request: Req } = require('./api');

// General

const getVersion = curry2((ws, _) => sendWith2(ws, Req.GET_VERSION));
const getAuthRequired = curry2((ws, _) => sendWith2(ws, Req.GET_AUTH_REQUIRED));
const authenticate = curry2((ws, args) => sendWith3(ws, Req.AUTHENTICATE, args));
// const authenticate = curry2((ws, args) => send3(ws, Req.AUTHENTICATE, args));
const setHeartbeat = curry2((ws, f) => send3(ws, Req.SET_HEARTBEAT, { enable: f }));

// Profiles

const setCurrentProfile = curry2((ws, n) => send3(ws, Req.SET_CURRENT_PROFILE, { 'profile-name': n }));
const getCurrentProfile = curry2((ws, _) => sendWith2(ws, Req.GET_CURRENT_PROFILE));
const listProfiles = curry2((ws, _) => sendWith2(ws, Req.LIST_PROFILES));

const getObsControl = ws => {
  const send = send3(ws);

  return {
    getVersion: () => send(Req.GET_VERSION, undefined)
  };
};

//

module.exports = {
  getObsControl,

  getVersion,
  getAuthRequired,
  authenticate,
  setHeartbeat,

  setCurrentProfile,
  getCurrentProfile,
  listProfiles
};
