/**
 * @module lib/util
 * @title Utilities
 * @import require('lib/util')
 */
const R = require('ramda');
const L = require('partial.lenses');
const $ = require('sanctuary-def');

const { def, ObsEvent, ObsRequest } = require('./types');
const { Events, Requests } = require('./api');

//

const genFunc = (fn, name = fn.name) => def(name, {}, [$.String, $.String], fn);
const inList = x => [L.normalize(R.sortBy(R.identity)), L.find(R.equals(x))];
const getFromList = (x, xs) => L.get(inList(x), xs);

//

/**
 * @sig ObsEvent ~> String
 */
const getEvent =
  def('getEvent',
      {},
      [ObsEvent, $.String],
      evtName => getFromList(evtName, Events));

const getRequest =
  def('getRequest',
      {},
      [ObsRequest, $.String],
      reqName => getFromList(reqName, Requests));


/**
 * @name splitPascal
 * @sig String -> [String]
 */
const splitPascal = R.match(/([A-Z][a-z]+)/g);

/**
 * @name splitCamelCase
 * @sig String -> [String]
 */
const splitCamelCase = R.match(/(^[a-z]+|[A-Z][a-z]+)/g);

//

/**
 * @name camelCasePascal
 * @sig String -> [String]
 */
const camelCasePascal =
  R.compose(R.join(''),
            L.modify(0, R.toLower),
            splitPascal);

/**
 * @name kebabCasePascal
 * @sig String -> [String]
 */
const kebabCasePascal =
  R.compose(R.toLower,
            R.join('-'),
            splitPascal);

/**
 * @name constCasePascal
 * @sig String -> [String]
 */
const constCasePascal =
  R.compose(R.toUpper,
            R.join('_'),
            splitPascal);

//

/**
 * @name pascalCaseCamel
 * @sig String -> [String]
 */
const pascalCaseCamel =
  R.compose(R.join(''),
            R.flatten,
            L.modify([L.elems, 0], R.toUpper),
            splitCamelCase);

/**
 * @name pascalCaseKebab
 * @sig String -> [String]
 */
const pascalCaseKebab =
  R.compose(R.join(''),
            R.flatten,
            L.modify([L.elems, 0], R.toUpper),
            R.split('-'));

/**
 * @name pascalCaseConst
 * @sig String -> [String]
 */
const pascalCaseConst =
  R.compose(R.join(''),
            R.flatten,
            L.modify([L.elems, 0], R.toUpper),
            R.split('_'),
            R.toLower);

//

module.exports = {
  getEvent,
  getRequest,

  camelCasePascal: genFunc(camelCasePascal, 'camelCasePascal'),
  kebabCasePascal: genFunc(kebabCasePascal, 'kebabCasePascal'),
  constCasePascal: genFunc(constCasePascal, 'constCasePascal'),

  pascalCaseCamel: genFunc(pascalCaseCamel, 'pascalCaseCamel'),
  pascalCaseConst: genFunc(pascalCaseConst, 'pascalCaseConst'),
  pascalCaseKebab: genFunc(pascalCaseKebab, 'pascalCaseKebab')
};
