
const fnTypeEnd = [WebSocketT, KefirObservableT];

//. ### General

const getVersion =
  def('getVersion', {},
      [...fnTypeEnd],
      command(Req.GET_AUTH_REQUIRED));

const getAuthRequired =
  def('getAuthRequired', {},
      [...fnTypeEnd],
      command(Req.GET_AUTH_REQUIRED));

const authenticate =
  def('authenticate', {},
      [$.Object, ...fnTypeEnd],
      commandWithArgs(Req.GET_AUTH_REQUIRED));

const setHeartbeat =
  def('setHeartbeat', {},
      [$.Boolean, ...fnTypeEnd],
      (flag, ws) => commandWithArgs(Req.SET_HEARTBEAT, { enable: flag }, ws));

const setFilenameFormatting =
  def('setFilenameFormatting', {},
      [$.String, ...fnTypeEnd],
      (str, ws) =>
        commandWithArgs(Req.SET_FILENAME_FORMATTING, { filenameFormatting: str }, ws));

const getFilenameFormatting =
  def('getFilenameFormatting', {},
      [...fnTypeEnd],
      command(Req.GET_FILENAME_FORMATTING));

//. ### Profiles

const getCurrentProfile =
  def('getCurrentProfile', {},
      [...fnTypeEnd],
      command(Req.GET_CURRENT_PROFILE));

const setCurrentProfile =
  def('setCurrentProfile', {},
      [$.String, ...fnTypeEnd],
      commandWithArgs(Req.SET_CURRENT_PROFILE));

const listProfiles =
  def('listProfiles', {},
      [...fnTypeEnd],
      command(Req.LIST_PROFILES));

//. ### Recording

const startRecording =
  def('startRecording', {},
      [...fnTypeEnd],
      command(Req.START_RECORDING));

const stopRecording =
  def('stopRecording', {},
      [...fnTypeEnd],
      command(Req.STOP_RECORDING));

const toggleRecording =
  def('toggleRecording', {},
      [...fnTypeEnd],
      command(Req.START_STOP_RECORDING));

const getRecordingFolder =
  def('getRecordingFolder', {},
      [...fnTypeEnd],
      command(Req.GET_RECORDING_FOLDER));

const setRecordingFolder =
  def('setRecordingFolder', {},
      [$.String, ...fnTypeEnd],
      (recFolder, ws) =>
        commandWithArgs(Req.SET_RECORDING_FOLDER, { recFolder }, ws));

//

//. ### Replay Buffer

const startReplayBuffer =
  def('startReplayBuffer', {},
      [...fnTypeEnd],
      command(Req.START_REPLAY_BUFFER));

const stopReplayBuffer =
  def('stopReplayBuffer', {},
      [...fnTypeEnd],
      command(Req.STOP_REPLAY_BUFFER));

const toggleReplayBuffer =
  def('toggleReplayBuffer', {},
      [...fnTypeEnd],
      command(Req.START_STOP_REPLAY_BUFFER));

const saveReplayBuffer =
  def('saveReplayBuffer', {},
      [...fnTypeEnd],
      command(Req.SAVE_REPLAY_BUFFER));

//. ### Scene Collections
