const T = require('../lib/types');

const pkgName = 'obs.remote.kefir';
const ident = n => `${pkgName}/${n}`;
const url = n => `https://github.com/stuf/obs.remote.kefir#${n}`;

const testType = (t, n) => {
  expect(t.name).toBe(ident(n));
  expect(t.url).toBe(url(n));
};

const onlyTestType = (t, n) => () => testType(t, n);

describe('types', () => {
  test('provides the `ObsRequest` type', onlyTestType(T.ObsRequest, 'ObsRequest'));
  test('provides the `ObsEvent` type', onlyTestType(T.ObsEvent, 'ObsEvent'));
  test('provides the `KefirObservable` type', onlyTestType(T.KefirObservable, 'KefirObservable'));
  test('provides the `KefirStream` type', onlyTestType(T.KefirStream, 'KefirStream'));
  test('provides the `KefirProperty` type', onlyTestType(T.KefirProperty, 'KefirProperty'));
});
