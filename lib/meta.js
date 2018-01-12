// @ title Meta operations on data
// @ ignore

const L = require('partial.lenses');
const { camelCasePascal, pascalCaseCamel } = require('./util');

//

const { freeze } = Object;

//

//# obsKeyI :: PIso s a
const obsKeyI =
  L.iso(L.modify(L.keys, camelCasePascal),
        L.modify(L.keys, pascalCaseCamel));

//

//# Request :: StrMap POptic s a
const Request = {
  //# identifierL :: PLens s { p1: a1, ...pN: aN }
  identifierL: L.pick({ id: 'message-id', type: 'request-type' })
};

//

module.exports = {
  obsKeyI,
  Request: freeze(Request),
};
