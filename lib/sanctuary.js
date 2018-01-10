const $ = require('sanctuary-def');
// const Z = require('sanctuary-type-classes');
const T = require('./types');

const shouldDisableChecks = (nodeEnv, disable) =>
  nodeEnv === 'production' || disable === '1';

module.exports.createEnv = () => {
  const { NODE_ENV, DISABLE_TYPE_CHECKING } = process.env;
  return $.create({
    env: $.env.concat(T.env),
    checkTypes: !shouldDisableChecks(NODE_ENV, DISABLE_TYPE_CHECKING)
  });
};
