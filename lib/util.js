const R = require('ramda');
const L = require('partial.lenses');

//

const splitPascal = R.match(/([A-Z][a-z]+)/g);

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

module.exports = {
  camelCasePascal,
  kebabCasePascal,
  constCasePascal
};
