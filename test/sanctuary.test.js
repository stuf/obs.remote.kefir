const $ = require('sanctuary-def');
const sanctuary = require('../lib/sanctuary');

const addFnTypes = [$.Number, $.Number, $.Number];
const addFn = (a, b) => a + b;
const addFnName = 'add';

const getFn = () => {
  const def = sanctuary.createEnv();
  const add = def(addFnName, {}, addFnTypes, addFn);
  return add;
};

describe('sanctuary', () => {
  beforeEach(() => {
    delete(process.env.DISABLE_TYPE_CHECKING);
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  test('can disable type checking with DISABLE_TYPE_CHECKING', () => {
    process.env.DISABLE_TYPE_CHECKING = '1';

    const add = getFn();

    expect(() => {
      add(1, true);
    }).not.toThrow();
  });

  test('has type checking enabled by default', () => {
    const add = getFn();

    expect(() => {
      add(1, true);
    }).toThrow();

    expect(() => {
      add(1, 2);
    }).not.toThrow();
  });

  test('has type checking disabled in production', () => {
    process.env.NODE_ENV = 'production';

    const add = getFn();

    expect(() => {
      add(1, true);
    }).not.toThrow();
  });
});
