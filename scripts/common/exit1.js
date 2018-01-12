module.exports = err => {
  process.stderr.write(`ERR ${err}\n`);
  process.exit(1);
};
