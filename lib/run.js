const path = require('path');
const execFile = require('child_process').execFile;
const Promise = require('bluebird');

function determinePlatformBinary() {
  if (process.platform === 'darwin') {
    return 'osx/dcraw';
  } else if (process.platform === 'win32') {
    throw new Error('windows not yet supported');
  } else {
    return 'linux/dcraw';
  }
}

function determineBinaryPath() {
  return path.join(__dirname, '../vendor/', determinePlatformBinary());
}

const pathToBinary = determineBinaryPath();

function run(args, cb) {
  return new Promise(function (resolve, reject) {
    execFile(pathToBinary, args, function (err, stdout, stderr) {
      const output = (stdout || '') + (stderr || '');
      if (err) {
        err.output = output;
        reject(err);
      } else {
        resolve(output);
      }

      if (typeof cb === 'function') {
        cb(err, output);
      }
    });
  });
}

module.exports = run;
