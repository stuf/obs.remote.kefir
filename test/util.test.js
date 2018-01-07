const util = require('../lib/util');

describe('util', () => {
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
