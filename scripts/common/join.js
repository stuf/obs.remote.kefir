const { join } = require('path');
const { curry2 } = require('sanctuary');

module.exports = curry2(join);
