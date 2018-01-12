// @ title Sanctuary environment
// @ ignore
const $ = require('sanctuary-def');
const T = require('./types');

//# shouldDisableChecks :: String -> String -> Boolean
const shouldDisableChecks = (nodeEnv, disable) =>
  nodeEnv === 'production' || disable === '1';

//# createEnv :: () -> Function
const createEnv = () => {
  const { NODE_ENV, DISABLE_TYPE_CHECKING } = process.env;
  return $.create({
    env: $.env.concat(T.env),
    checkTypes: !shouldDisableChecks(NODE_ENV, DISABLE_TYPE_CHECKING)
  });
};

//

module.exports = {
  createEnv
};
