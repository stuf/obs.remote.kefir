const R = require('ramda');
const L = require('partial.lenses');
const $ = require('sanctuary-def');

const { def } = require('./types');

//

const splitPascal = R.match(/([A-Z][a-z]+)/g);
const splitCamelCase = R.match(/(^[a-z]+|[A-Z][a-z]+)/g);

//

const camelCasePascal =
  R.compose(R.join(''),
            L.modify(0, R.toLower),
            splitPascal);

const kebabCasePascal =
  R.compose(R.toLower,
            R.join('-'),
            splitPascal);

const constCasePascal =
  R.compose(R.toUpper,
            R.join('_'),
            splitPascal);

//

const pascalCaseCamel =
  R.compose(R.join(''),
            R.flatten,
            L.modify([L.elems, 0], R.toUpper),
            splitCamelCase);

const pascalCaseKebab =
  R.compose(R.join(''),
            R.flatten,
            L.modify([L.elems, 0], R.toUpper),
            R.split('-'));

const pascalCaseConst =
  R.compose(R.join(''),
            R.flatten,
            L.modify([L.elems, 0], R.toUpper),
            R.split('_'),
            R.toLower);

//

const genFunc = (fn, name = fn.name) => def(name, {}, [$.String, $.String], fn);

module.exports = {
  camelCasePascal: genFunc(camelCasePascal, 'camelCasePascal'),
  kebabCasePascal: genFunc(kebabCasePascal, 'kebabCasePascal'),
  constCasePascal: genFunc(constCasePascal, 'constCasePascal'),

  pascalCaseCamel: genFunc(pascalCaseCamel, 'pascalCaseCamel'),
  pascalCaseConst: genFunc(pascalCaseConst, 'pascalCaseConst'),
  pascalCaseKebab: genFunc(pascalCaseKebab, 'pascalCaseKebab')
};
