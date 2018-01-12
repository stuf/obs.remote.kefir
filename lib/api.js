// @ title API
// @ ignore

//. <a id="api-api"></a>
//. ### Core API
const { curry2, curry3, reduce, concat } = require('sanctuary');
const Z = require('sanctuary-type-classes');
const $ = require('sanctuary-def');

const T = require('./types');

const { def } = T;

const a = $.TypeVariable('a');
const b = $.TypeVariable('b');
const f = $.TypeVariable('f');

//

/**
 * Takes a list of elements and functions (`vfn` and `kfn`) for transforming the string.
 * The resulting elements from applying each function will become the `key` and `value` in
 * the resulting object.
 *
 * For example:
 *
 * ```js
 * const tokens = ['foo-bar', 'top-kek'];
 * const Obj = foldTokens_(tokens, R.split('-'), R.toUpper);
 *
 * // => { 'FOO-BAR': ['foo', 'bar'], 'TOP-KEK': ['top', 'kek'] }
 * ```
 *
 * Useful for re-mapping token strings into some desired form, e.g. turning pascal case
 * string tokens into camelCase.
 *
 * `vfn` and `kfn` will fall back to using Sanctuary's `id` function if not supplied.
 *
 * @sig Foldable a => a -> (a -> b) -> (a -> String) -> StrMap b
 */
const foldTokens_ =
  def('foldTokens_',
      { f: [Z.Foldable] },
      [f, $.Function([a, b]), $.Function([a, $.String]), $.StrMap(b)],
      (xs, valueFn, keyFn) =>
        reduce(o => k => concat(o, { [keyFn(k)]: valueFn(k) }), {}, xs));

/**
 * @param {Array<Any>} xs
 * @param {Function} vfn
 * @param {Function} [kfn=S.id]
 * @returns {Object}
 * @sig [a] -> (VFn -> KFn) ~> Object
 */
const foldTokens2 = curry2(foldTokens_);

/**
 * @param {Array<Any>} xs
 * @param {Function} vfn
 * @param {Function} kfn
 * @returns {Object}
 * @sig [a] -> VFn -> KFn ~> Object
 */
const foldTokens3 = curry3(foldTokens_);

//


module.exports = {
  foldTokens_,
  foldTokens2,
  foldTokens3,
};
