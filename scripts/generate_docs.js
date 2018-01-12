#!/usr/bin/env node
const L = require('partial.lenses');
const R = require('ramda');
const S = require('sanctuary');
const { readFileSync, writeFileSync, readdirSync } = require('fs');
const { exec } = require('shelljs');

const join = require('./common/join');

//    readFile :: String -> String
const readFile = f => readFileSync(f).toString();

//    concat2 :: a -> a -> a
const concat2 = a => b => S.concat(a, b);

//    docUrl :: String
const docUrl = 'https://github.com/stuf/obs.remote.kefir/blob/master/{filename}#L{line}';

//    transcribeFile :: String -> String
const transcribeFile = f => {
  const cmd = exec(`./node_modules/.bin/transcribe --heading-level 5 --url '${docUrl}' lib/${f}`, { silent: true });

  return cmd.stdout;
};

module.exports = rootPath => {
  const srcDir = join(rootPath, 'lib');
  const files = readdirSync(srcDir);
  const outFile = join(rootPath, 'outdoc.md');

  const getFileContent = R.pipe(join(srcDir), readFile);
  const getFileContents = R.map(getFileContent);
  const fileContents = getFileContents(files);

  const getFileHeaders =
    R.pipe(S.lines,
           R.takeWhile(R.startsWith('// @')),
           R.map(R.pipe(R.match(/\/\/ @ (\w+) ?(.*)?/),
                        R.slice(1, Infinity))),
           R.reduce((o, [k, v]) => L.set(k, v || true, o), {}));

  // console.log({ fileContents });

  const fileHeaders = R.map(getFileHeaders, fileContents);

  const documentation =
    S.pipe([R.apply(R.zip),
            // R.map(([meta]) => ({ meta }))], [fileHeaders, files]);
            R.map(([meta, content]) =>
              ({ meta, content: transcribeFile(content) }))],
              [fileHeaders, files]);

  const finalize =
    R.pipe(R.apply(R.zip),
           R.reduce((o, [k, v]) => {
             const shouldIgnore = L.get(['meta', 'ignore'], v);
             if (shouldIgnore) return o;
             return L.set(k, v, o);
           }, {}));

  // Okay now we have the documentation built and filtered
  // Let's into markdown

  const resultOf =
    R.pipe(finalize,
           R.values,
           R.map(v => {
             const lines = [];
             lines.push(L.get(['meta', 'title', L.reread(concat2('### '))], v));
             lines.push(L.get(['content'], v));

             return lines.join('\n\n');
           }),
           R.join('\n\n---\n'));

  const outDocArgs = [files, documentation];
  const outDoc = resultOf(outDocArgs);

  writeFileSync(outFile, outDoc);
};
