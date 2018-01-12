#!/usr/bin/env node
const R = require('ramda');
const S = require('sanctuary');
const { join, relative } = require('path');
const exit1 = require('./scripts/common/exit1');

const requireAndRun = cmd => {
  const rel = relative(__dirname, join(__dirname, 'scripts', cmd));
  const path = `./${rel}`;
  require(path)(__dirname);
};

const runCmd =
  R.cond([[R.equals('generate_docs'), requireAndRun],
          [R.T, R.pipe(S.concat('Command not found: '),
                       exit1)]]);

//

runCmd(R.head(process.argv.slice(2)));
