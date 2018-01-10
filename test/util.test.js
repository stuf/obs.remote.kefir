const L = require('partial.lenses');
const util = require('../lib/util');
const { Events, Requests } = require('../lib/tokens');

const getRandomElem = xs => xs[Math.floor(Math.random() * xs.length)];

describe('util', () => {
  test(util.genFunc.name, () => {
    expect(util.genFunc((a, b) => a + b, 'foo')
      .toString())
      .toBe('foo :: String -> String');
  });

  test(util.inList.name, () => {
    const i = [1, 2, 3, 4, 5];
    i.forEach(el => expect(L.get(util.inList(el), i)).toBe(el));
  });

  test(util.getFromList.name, () => {
    const i = [1, 2, 3, 4, 5];
    i.forEach(el => expect(util.getFromList(el, i)).toBe(el));
  });

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
