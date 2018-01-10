const S = require('sanctuary');
const $ = require('sanctuary-def');
const Z = require('sanctuary-type-classes');
const T = require('./types');

module.exports = S.create({
  env: $.env.concat(T.env),
  checkTypes: process.env.NODE_ENV !== 'production'
});
