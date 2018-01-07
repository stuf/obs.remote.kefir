const { curry2, curry3, id } = require('sanctuary');
const L = require('partial.lenses');

const { freeze } = Object;

//

/**
 * Takes a list of elements and functions (`vfn` and `kfn`) for transforming the string.
 * The resulting elements from applying each function will become the `key` and `value` in
 * the resulting object.
 *
 * For example:
 *
 * ```js
 * const tokens = ['foo-bar', 'top-kek'];
 * const Obj = foldTokens_(tokens, R.split('-'), R.toUpper);
 *
 * // => { 'FOO-BAR': ['foo', 'bar'], 'TOP-KEK': ['top', 'kek'] }
 * ```
 *
 * Useful for re-mapping token strings into some desired form, e.g. turning pascal case
 * string tokens into camelCase.
 *
 * `vfn` and `kfn` will fall back to using Sanctuary's `id` function if not supplied.
 *
 * @param {Array<Any>} xs
 * @param {Function} [vfn=S.id]
 * @param {Function} [kfn=S.id]
 * @returns {Object}
 */
const foldTokens_ = (xs, vfn = id, kfn = id) =>
  L.foldl((o, k) => L.set(kfn(k), vfn(k), o), {}, L.elems, xs);

/**
 * @param {Array<Any>} xs
 * @param {Function} vfn
 * @param {Function} [kfn=S.id]
 * @returns {Object}
 */
const foldTokens2 = curry2(foldTokens_);

/**
 * @param {Array<Any>} xs
 * @param {Function} vfn
 * @param {Function} kfn
 * @returns {Object}
 */
const foldTokens3 = curry3(foldTokens_);

//

const Event = {
  'SWITCH_SCENES': 'SwitchScenes',
  'SCENES_CHANGED': 'ScenesChanged',
  'SCENE_COLLECTION_CHANGED': 'SceneCollectionChanged',
  'SCENE_COLLECTION_LIST_CHANGED': 'SceneCollectionListChanged',
  'SWITCH_TRANSITION': 'SwitchTransition',
  'TRANSITION_LIST_CHANGED': 'TransitionListChanged',
  'TRANSITION_DURATION_CHANGED': 'TransitionDurationChanged',
  'TRANSITION_BEGIN': 'TransitionBegin',
  'PROFILE_CHANGED': 'ProfileChanged',
  'PROFILE_LIST_CHANGED': 'ProfileListChanged',
  'STREAM_STARTING': 'StreamStarting',
  'STREAM_STARTED': 'StreamStarted',
  'STREAM_STOPPING': 'StreamStopping',
  'STREAM_STOPPED': 'StreamStopped',
  'STREAM_STATUS': 'StreamStatus',
  'RECORDING_STARTING': 'RecordingStarting',
  'RECORDING_STARTED': 'RecordingStarted',
  'RECORDING_STOPPING': 'RecordingStopping',
  'RECORDING_STOPPED': 'RecordingStopped',
  'REPLAY_STARTING': 'ReplayStarting',
  'REPLAY_STARTED': 'ReplayStarted',
  'REPLAY_STOPPING': 'ReplayStopping',
  'REPLAY_STOPPED': 'ReplayStopped',
  'EXITING': 'Exiting',
  'HEARTBEAT': 'Heartbeat',
  'SOURCE_ORDER_CHANGED': 'SourceOrderChanged',
  'SCENE_ITEM_ADDED': 'SceneItemAdded',
  'SCENE_ITEM_REMOVED': 'SceneItemRemoved',
  'SCENE_ITEM_VISIBILITY_CHANGED': 'SceneItemVisibilityChanged',
  'PREVIEW_SCENE_CHANGED': 'PreviewSceneChanged',
  'STUDIO_MODE_SWITCHED': 'StudioModeSwitched'
};

const Request = {
  'GET_VERSION': 'GetVersion',
  'GET_AUTH_REQUIRED': 'GetAuthRequired',
  'AUTHENTICATE': 'Authenticate',
  'SET_HEARTBEAT': 'SetHeartbeat',
  'SET_CURRENT_PROFILE': 'SetCurrentProfile',
  'GET_CURRENT_PROFILE': 'GetCurrentProfile',
  'LIST_PROFILES': 'ListProfiles',
  'START_STOP_RECORDING': 'StartStopRecording',
  'START_RECORDING': 'StartRecording',
  'STOP_RECORDING': 'StopRecording',
  'SET_RECORDING_FOLDER': 'SetRecordingFolder',
  'GET_RECORDING_FOLDER': 'GetRecordingFolder',
  'START_STOP_REPLAY_BUFFER': 'StartStopReplayBuffer',
  'START_REPLAY_BUFFER': 'StartReplayBuffer',
  'STOP_REPLAY_BUFFER': 'StopReplayBuffer',
  'SAVE_REPLAY_BUFFER': 'SaveReplayBuffer',
  'SET_CURRENT_SCENE_COLLECTION': 'SetCurrentSceneCollection',
  'GET_CURRENT_SCENE_COLLECTION': 'GetCurrentSceneCollection',
  'LIST_SCENE_COLLECTIONS': 'ListSceneCollections',
  'GET_SCENE_ITEM_PROPERTIES': 'GetSceneItemProperties',
  'SET_SCENE_ITEM_PROPERTIES': 'SetSceneItemProperties',
  'RESET_SCENE_ITEM': 'ResetSceneItem',
  'SET_SCENE_ITEM_RENDER': 'SetSceneItemRender',
  'SET_SCENE_ITEM_POSITION': 'SetSceneItemPosition',
  'SET_SCENE_ITEM_TRANSFORM': 'SetSceneItemTransform',
  'SET_SCENE_ITEM_CROP': 'SetSceneItemCrop',
  'SET_CURRENT_SCENE': 'SetCurrentScene',
  'GET_CURRENT_SCENE': 'GetCurrentScene',
  'GET_SCENE_LIST': 'GetSceneList',
  'GET_SOURCES_LIST': 'GetSourcesList',
  'GET_SOURCES_TYPES_LIST': 'GetSourcesTypesList',
  'GET_VOLUME': 'GetVolume',
  'SET_VOLUME': 'SetVolume',
  'GET_MUTE': 'GetMute',
  'SET_MUTE': 'SetMute',
  'TOGGLE_MUTE': 'ToggleMute',
  'SET_SYNC_OFFSET': 'SetSyncOffset',
  'GET_SYNC_OFFSET': 'GetSyncOffset',
  'GET_SOURCE_SETTINGS': 'GetSourceSettings',
  'SET_SOURCE_SETTINGS': 'SetSourceSettings',
  'GET_TEXT_PLUS_PROPERTIES': 'GetTextGDIPlusProperties',
  'SET_TEXT_PLUS_PROPERTIES': 'SetTextGDIPlusProperties',
  'GET_BROWSER_SOURCE_PROPERTIES': 'GetBrowserSourceProperties',
  'SET_BROWSER_SOURCE_PROPERTIES': 'SetBrowserSourceProperties',
  'GET_SPECIAL_SOURCES': 'GetSpecialSources',
  'GET_STREAMING_STATUS': 'GetStreamingStatus',
  'START_STOP_STREAMING': 'StartStopStreaming',
  'START_STREAMING': 'StartStreaming',
  'STOP_STREAMING': 'StopStreaming',
  'SET_STREAM_SETTINGS': 'SetStreamSettings',
  'GET_STREAM_SETTINGS': 'GetStreamSettings',
  'SAVE_STREAM_SETTINGS': 'SaveStreamSettings',
  'GET_STUDIO_MODE_STATUS': 'GetStudioModeStatus',
  'GET_PREVIEW_SCENE': 'GetPreviewScene',
  'SET_PREVIEW_SCENE': 'SetPreviewScene',
  'TRANSITION_TO_PROGRAM': 'TransitionToProgram',
  'ENABLE_STUDIO_MODE': 'EnableStudioMode',
  'DISABLE_STUDIO_MODE': 'DisableStudioMode',
  'TOGGLE_STUDIO_MODE': 'ToggleStudioMode',
  'GET_TRANSITION_LIST': 'GetTransitionList',
  'GET_CURRENT_TRANSITION': 'GetCurrentTransition',
  'SET_CURRENT_TRANSITION': 'SetCurrentTransition',
  'SET_TRANSITION_DURATION': 'SetTransitionDuration',
  'GET_TRANSITION_DURATION': 'GetTransitionDuration'
};


module.exports = {
  foldTokens_,
  foldTokens2,
  foldTokens3,
  Event: freeze(Event),
  Request: freeze(Request)
};
