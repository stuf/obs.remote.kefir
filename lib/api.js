const {
  curry2
} = require('sanctuary');
const L = require('partial.lenses');
const {
  constCasePascal
} = require('./util');

//

const foldTokens_ = (xs, fn) =>
  L.foldl((o, k) => L.set(k, fn(k), o),
          {},
          L.elems,
          xs);

const foldTokens2 = curry2(foldTokens_);

//

const events = [
  'SwitchScenes',
  'ScenesChanged',
  'SceneCollectionChanged',
  'SceneCollectionListChanged',
  'SwitchTransition',
  'TransitionListChanged',
  'TransitionDurationChanged',
  'TransitionBegin',
  'ProfileChanged',
  'ProfileListChanged',
  'StreamStarting',
  'StreamStarted',
  'StreamStopping',
  'StreamStopped',
  'StreamStatus',
  'RecordingStarting',
  'RecordingStarted',
  'RecordingStopping',
  'RecordingStopped',
  'ReplayStarting',
  'ReplayStarted',
  'ReplayStopping',
  'ReplayStopped',
  'Exiting',
  'Heartbeat',
  'SourceOrderChanged',
  'SceneItemAdded',
  'SceneItemRemoved',
  'SceneItemVisibilityChanged',
  'PreviewSceneChanged',
  'StudioModeSwitched'
];

const events_ =
  L.foldl((o, k) => L.set(constCasePascal(k), k, o),
          {},
          L.elems,
          events);

const methods = [
  'GetVersion',
  'GetAuthRequired',
  'Authenticate',
  'SetHeartbeat',
  'SetCurrentProfile',
  'GetCurrentProfile',
  'ListProfiles',
  'StartStopRecording',
  'StartRecording',
  'StopRecording',
  'SetRecordingFolder',
  'GetRecordingFolder',
  'StartStopReplayBuffer',
  'StartReplayBuffer',
  'StopReplayBuffer',
  'SaveReplayBuffer',
  'SetCurrentSceneCollection',
  'GetCurrentSceneCollection',
  'ListSceneCollections',
  'GetSceneItemProperties',
  'SetSceneItemProperties',
  'ResetSceneItem',
  'SetSceneItemRender',
  'SetSceneItemPosition',
  'SetSceneItemTransform',
  'SetSceneItemCrop',
  'SetCurrentScene',
  'GetCurrentScene',
  'GetSceneList',
  'GetSourcesList',
  'GetSourcesTypesList',
  'GetVolume',
  'SetVolume',
  'GetMute',
  'SetMute',
  'ToggleMute',
  'SetSyncOffset',
  'GetSyncOffset',
  'GetSourceSettings',
  'SetSourceSettings',
  'GetTextGDIPlusProperties',
  'SetTextGDIPlusProperties',
  'GetBrowserSourceProperties',
  'SetBrowserSourceProperties',
  'GetSpecialSources',
  'GetStreamingStatus',
  'StartStopStreaming',
  'StartStreaming',
  'StopStreaming',
  'SetStreamSettings',
  'GetStreamSettings',
  'SaveStreamSettings',
  'GetStudioModeStatus',
  'GetPreviewScene',
  'SetPreviewScene',
  'TransitionToProgram',
  'EnableStudioMode',
  'DisableStudioMode',
  'ToggleStudioMode',
  'GetTransitionList',
  'GetCurrentTransition',
  'SetCurrentTransition',
  'SetTransitionDuration',
  'GetTransitionDuration'
];

module.exports = {
  foldTokens_,
  foldTokens2,
  events,
  methods
};
