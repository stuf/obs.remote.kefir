//. <a id="api-util"></a>
//. ## Utilities
//.
const R = require('ramda');
const L = require('partial.lenses');
const $ = require('sanctuary-def');

const { def, ObsEvent, ObsRequest } = require('./types');
const { Events, Requests } = require('./tokens');

//

//# genFunc :: ((String -> String), String) -> (String -> String)
const genFunc = (fn, name = fn.name) => def(name, {}, [$.String, $.String], fn);

//# inList :: a -> POptic s a
const inList = x => [L.normalize(R.sortBy(R.identity)), L.find(R.equals(x))];

//# getFromList :: a -> [a] -> a
const getFromList = (x, xs) => L.get(inList(x), xs);

//# flatJoin :: [a] -> String
const flatJoin = R.pipe(R.flatten, R.join(''));

//

//# getEvent :: ObsEvent -> String
const getEvent =
  def('getEvent',
      {},
      [ObsEvent, $.String],
      evtName => getFromList(evtName, Events));

//# getRequest :: ObsRequest -> String
const getRequest =
  def('getRequest',
      {},
      [ObsRequest, $.String],
      reqName => getFromList(reqName, Requests));


//# splitPascal :: String -> [String]
const splitPascal = R.match(/([A-Z][a-z]+)/g);

//# splitCamelCase :: String -> [String]
const splitCamelCase = R.match(/(^[a-z]+|[A-Z][a-z]+)/g);

//

//# camelCasePascal :: String -> String
const camelCasePascal =
  R.compose(R.join(''),
            L.modify(0, R.toLower),
            splitPascal);

//# kebabCasePascal :: String -> String
const kebabCasePascal =
  R.compose(R.toLower,
            R.join('-'),
            splitPascal);

//# constCasePascal :: String -> String
const constCasePascal =
  R.compose(R.toUpper,
            R.join('_'),
            splitPascal);

//

//# pascalCaseCamel :: String -> String
const pascalCaseCamel =
  R.compose(flatJoin,
            L.modify([L.elems, 0], R.toUpper),
            splitCamelCase);

//# pascalCaseKebab :: String -> String
const pascalCaseKebab =
  R.compose(flatJoin,
            L.modify([L.elems, 0], R.toUpper),
            R.split('-'));

//# pascalCaseConst :: String -> String
const pascalCaseConst =
  R.compose(flatJoin,
            L.modify([L.elems, 0], R.toUpper),
            R.split('_'),
            R.toLower);

//

//# camelCaseKebab :: String -> String
const camelCaseKebab =
  R.pipe(L.modify([L.reread(R.pipe(R.toLower, R.split('-'))),
                   L.slice(1, undefined),
                   L.elems,
                   L.index(0)],
                  R.toUpper),
         flatJoin);

//

module.exports = {
  genFunc,
  inList,
  getFromList,

  getEvent,
  getRequest,

  camelCaseKebab: genFunc(camelCaseKebab, 'camelCaseKebab'),

  camelCasePascal: genFunc(camelCasePascal, 'camelCasePascal'),
  kebabCasePascal: genFunc(kebabCasePascal, 'kebabCasePascal'),
  constCasePascal: genFunc(constCasePascal, 'constCasePascal'),

  pascalCaseCamel: genFunc(pascalCaseCamel, 'pascalCaseCamel'),
  pascalCaseConst: genFunc(pascalCaseConst, 'pascalCaseConst'),
  pascalCaseKebab: genFunc(pascalCaseKebab, 'pascalCaseKebab')
};
