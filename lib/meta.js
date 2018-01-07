const L = require('partial.lenses');
const { camelCasePascal, pascalCaseCamel } = require('./util');

//

const { freeze } = Object;

//

const obsKeyI =
  L.iso(L.modify(L.keys, camelCasePascal),
        L.modify(L.keys, pascalCaseCamel));

//

const Request = {
  identifierL: L.pick({ id: 'message-id', type: 'request-type' })
};

//

module.exports = {
  obsKeyI,
  Request: freeze(Request),
};
