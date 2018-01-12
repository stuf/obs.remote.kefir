// @ title Utilities

//. <a id="api-utilities"></a>
//. Contains some generic utilities for handling string tokens of
//. different kinds, and conversion functions for them—e.g. for
//. creating isomorphisms on tokens, to avoid having to manually convert
//. tokens back and forth when interfacing with OBS.
const R = require('ramda');
const L = require('partial.lenses');
const $ = require('sanctuary-def');
const Z = require('sanctuary-type-classes');
const { curry2 } = require('sanctuary');

const { def, ObsEvent, ObsRequest } = require('./types');
const { Events, Requests } = require('./tokens');

const a = $.TypeVariable('a');
const f = $.UnaryTypeVariable('f');

//

//# genFunc :: (String -> Function) -> (String -> String)
const genFunc = (name, fn) => def(name, {}, [$.String, $.String], fn);

//# inList :: a -> POptic s a
const inList = x => [L.normalize(R.sortBy(R.identity)), L.find(R.equals(x))];

//# getFromList :: Foldable f => a -> f a -> a
//.
//. Find the item `x` from the given list of `xs` and return it.
const getFromList =
  def('getFromList', { f: [Z.Foldable] },
      [a, f(a), a],
      curry2((x, xs) => L.get(inList(x), xs)));

//# flatJoin :: [a] -> String
//.
//. Utility for joining nested arrays of strings into a string.
const flatJoin = R.pipe(R.flatten, R.join(''));

//

//# getEvent :: ObsEvent -> String
//.
//. Get the string representation of the given OBS event type.
const getEvent =
  def('getEvent', {},
      [ObsEvent, $.String],
      evtName => getFromList(evtName, Events));

//# getRequest :: ObsRequest -> String
//.
//. Get the string representation of the given OBS request type.
const getRequest =
  def('getRequest', {},
      [ObsRequest, $.String],
      reqName => getFromList(reqName, Requests));


//# splitPascal :: String -> [String]
//.
//. Split a pascal-cased string into an array of words.
const splitPascal =
  def('splitPascal', {},
      [$.String, $.Array($.String)],
      R.match(/([A-Z][a-z]+)/g));

//# splitCamelCase :: String -> [String]
//.
//. Split a camelcased string into an array of words.
const splitCamelCase =
  def('splitCamelCase', {},
      [$.String, $.Array($.String)],
      R.match(/(^[a-z]+|[A-Z][a-z]+)/g));

//

//# camelCasePascal :: String -> String
//.
//. Get the camel-case version of a pascal-cased string.
//.
//. ```js
//. camelCasePascal('FooBar'); // => 'fooBar'
const camelCasePascal =
  genFunc('camelCasePascal',
          R.compose(R.join(''),
                    L.modify(0, R.toLower),
                    splitPascal));

//# kebabCasePascal :: String -> String
//.
//. Get the kebab-case version of a pascal-cased string.
//.
//. ```js
//. kebabCasePascal('FooBar'); // => 'foo-bar'
//. ```
const kebabCasePascal =
  genFunc('kebabCasePascal',
          R.compose(R.toLower,
                    R.join('-'),
                    splitPascal));

//# constCasePascal :: String -> String
//.
//. Get the "const-cased" version of a pascal-cased string.
//.
//. ```js
//. constCasePascal('FooBar'); // => 'FOO_BAR'
//. ```
const constCasePascal =
  genFunc('constCasePascal',
          R.compose(R.toUpper,
                    R.join('_'),
                    splitPascal));

//

//# pascalCaseCamel :: String -> String
const pascalCaseCamel =
  genFunc('pascalCaseCamel',
          R.compose(flatJoin,
                    L.modify([L.elems, 0], R.toUpper),
                    splitCamelCase));

//# pascalCaseKebab :: String -> String
const pascalCaseKebab =
  genFunc('pascalCaseKebab',
          R.compose(flatJoin,
                    L.modify([L.elems, 0], R.toUpper),
                    R.split('-')));

//# pascalCaseConst :: String -> String
const pascalCaseConst =
  genFunc('pascalCaseConst',
          R.compose(flatJoin,
                    L.modify([L.elems, 0], R.toUpper),
                    R.split('_'),
                    R.toLower));

//

//# camelCaseKebab :: String -> String
const camelCaseKebab =
  genFunc('camelCaseKebab',
          R.pipe(L.modify([L.reread(R.pipe(R.toLower, R.split('-'))),
                           L.slice(1, undefined),
                           L.elems,
                           L.index(0)], R.toUpper),
                flatJoin));

//

module.exports = {
  genFunc,
  inList,
  getFromList,

  getEvent,
  getRequest,

  // Kebab into X
  camelCaseKebab,

  // Pascal into X
  camelCasePascal,
  kebabCasePascal,
  constCasePascal,

  // X into Pascal
  pascalCaseCamel,
  pascalCaseConst,
  pascalCaseKebab
};
