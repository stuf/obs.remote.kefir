const acorn = require('acorn');
const R = require('ramda');
const L = require('partial.lenses');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const ROOT = resolve(__dirname, '..');
const src = resolve(ROOT, 'lib');

//

const processBlocks =
  R.compose(R.filter(R.complement(R.isEmpty)),
            R.map(R.trim),
            R.map(R.replace(/^ ?\* ?/, '')));

const processComments =
  R.compose(R.map(R.split('\n')),
            R.map(R.prop('value')),
            R.filter(R.whereEq({ type: 'Block' })));

const parseFileComments =
  R.compose(R.map(processBlocks),
            processComments);

const matchDocPair =
  R.match(/@(\w+) ?([(),|[\]\w\s-~>{}]+)\n?/);

const getDocPair =
  R.compose(R.tail,
            R.ifElse(R.startsWith('@'),
                     matchDocPair,
                     x => [null, 'description', x]));

const foldHeader =
  L.foldl((o, [k, v]) => L.set(k, v, o),
          {},
          [L.elems, L.reread(getDocPair)]);

const foldDocStrings =
  L.foldl((o, [k, v]) => L.set([k, L.append], v, o),
          {},
          [L.elems, L.reread(getDocPair)]);

module.exports = {
  getDocsFor: file => {
    const f = resolve(src, file);
    const data = readFileSync(f).toString();
    const cmts = [];

    acorn.parse(data, { onComment: cmts });

    const comments = parseFileComments(cmts);
    const header = R.head(comments);

    if (!(!header || R.contains('@ignore', header))) {
      return {
        module: foldHeader(header),
        comments: R.map(foldDocStrings, comments)
      };
    }
  }
};
