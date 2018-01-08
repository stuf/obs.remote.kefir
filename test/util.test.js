const util = require('../lib/util');
const { Events, Requests } = require('../lib/api');

const getRandomElem = xs => xs[Math.floor(Math.random() * xs.length)];

describe('util', () => {
  test(util.getEvent.toString(), () => {
    const testCount = 25;
    for (let i = 0; i < testCount; i++) {
      const el = getRandomElem(Events);
      expect(util.getEvent(el)).toBe(el);
    }
  });

  test(util.getRequest.toString(), () => {
    const testCount = 25;
    for (let i = 0; i < testCount; i++) {
      const el = getRandomElem(Requests);
      expect(util.getRequest(el)).toBe(el);
    }
  });

  [[util.camelCasePascal, 'FooBar', 'fooBar'],
   [util.constCasePascal, 'FooBar', 'FOO_BAR'],
   [util.kebabCasePascal, 'FooBar', 'foo-bar'],
   [util.pascalCaseCamel, 'fooBar', 'FooBar'],
   [util.pascalCaseConst, 'FOO_BAR', 'FooBar'],
   [util.pascalCaseKebab, 'foo-bar', 'FooBar']]
    .forEach(([fn, i, o]) =>
      test(fn.toString(), () => {
        expect(fn(i)).toBe(o);
      }));
});
