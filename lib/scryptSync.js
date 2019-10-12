"use strict";

var crypto = require('crypto');

var _require = require('./utils'),
    checkAndInit = _require.checkAndInit,
    smixSync = _require.smixSync; // N = Cpu cost, r = Memory cost, p = parallelization cost


function scrypt(key, salt, N, r, p, dkLen, progressCallback) {
  var _checkAndInit = checkAndInit(key, salt, N, r, p, dkLen, progressCallback),
      XY = _checkAndInit.XY,
      V = _checkAndInit.V,
      B32 = _checkAndInit.B32,
      x = _checkAndInit.x,
      _X = _checkAndInit._X,
      B = _checkAndInit.B,
      tickCallback = _checkAndInit.tickCallback;

  for (var i = 0; i < p; i++) {
    smixSync(B, i * 128 * r, r, N, V, XY, _X, B32, x, tickCallback);
  }

  return crypto.pbkdf2Sync(key, B, 1, dkLen, 'sha256');
}

module.exports = scrypt;