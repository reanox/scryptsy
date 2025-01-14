"use strict";

require("regenerator-runtime/runtime");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.typed.int32-array");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var crypto = require('crypto');

var MAX_VALUE = 0x7fffffff;
var DEFAULT_PROMISE_INTERVAL = 5000;
/* eslint-disable camelcase */

function checkAndInit(key, salt, N, r, p, dkLen, progressCallback) {
  if (N === 0 || (N & N - 1) !== 0) throw Error('N must be > 0 and a power of 2');
  if (N > MAX_VALUE / 128 / r) throw Error('Parameter N is too large');
  if (r > MAX_VALUE / 128 / p) throw Error('Parameter r is too large');
  var XY = Buffer.alloc(256 * r);
  var V = Buffer.alloc(128 * r * N); // pseudo global

  var B32 = new Int32Array(16); // salsa20_8

  var x = new Int32Array(16); // salsa20_8

  var _X = Buffer.alloc(64); // blockmix_salsa8
  // pseudo global


  var B = crypto.pbkdf2Sync(key, salt, 1, p * 128 * r, 'sha256');
  var tickCallback;

  if (progressCallback) {
    var totalOps = p * N * 2;
    var currentOp = 0;

    tickCallback = function tickCallback() {
      ++currentOp; // send progress notifications once every 1,000 ops

      if (currentOp % 1000 === 0) {
        progressCallback({
          current: currentOp,
          total: totalOps,
          percent: currentOp / totalOps * 100.0
        });
      }
    };
  }

  return {
    XY: XY,
    V: V,
    B32: B32,
    x: x,
    _X: _X,
    B: B,
    tickCallback: tickCallback
  };
}

function smix(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11) {
  return _smix.apply(this, arguments);
}

function _smix() {
  _smix = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(B, Bi, r, N, V, XY, _X, B32, x, tickCallback, promiseInterval) {
    var Xi, Yi, i, offset, j;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            promiseInterval = promiseInterval || DEFAULT_PROMISE_INTERVAL;
            Xi = 0;
            Yi = 128 * r;
            B.copy(XY, Xi, Bi, Bi + Yi);
            i = 0;

          case 5:
            if (!(i < N)) {
              _context.next = 15;
              break;
            }

            XY.copy(V, i * Yi, Xi, Xi + Yi);

            if (!(i % promiseInterval === 0)) {
              _context.next = 10;
              break;
            }

            _context.next = 10;
            return new Promise(function (resolve) {
              return setImmediate(resolve);
            });

          case 10:
            blockmix_salsa8(XY, Xi, Yi, r, _X, B32, x);
            if (tickCallback) tickCallback();

          case 12:
            i++;
            _context.next = 5;
            break;

          case 15:
            i = 0;

          case 16:
            if (!(i < N)) {
              _context.next = 28;
              break;
            }

            offset = Xi + (2 * r - 1) * 64;
            j = XY.readUInt32LE(offset) & N - 1;
            blockxor(V, j * Yi, XY, Xi, Yi);

            if (!(i % promiseInterval === 0)) {
              _context.next = 23;
              break;
            }

            _context.next = 23;
            return new Promise(function (resolve) {
              return setImmediate(resolve);
            });

          case 23:
            blockmix_salsa8(XY, Xi, Yi, r, _X, B32, x);
            if (tickCallback) tickCallback();

          case 25:
            i++;
            _context.next = 16;
            break;

          case 28:
            XY.copy(B, Bi, Xi, Xi + Yi);

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _smix.apply(this, arguments);
}

function smixSync(B, Bi, r, N, V, XY, _X, B32, x, tickCallback) {
  var Xi = 0;
  var Yi = 128 * r;
  var i;
  B.copy(XY, Xi, Bi, Bi + Yi);

  for (i = 0; i < N; i++) {
    XY.copy(V, i * Yi, Xi, Xi + Yi);
    blockmix_salsa8(XY, Xi, Yi, r, _X, B32, x);
    if (tickCallback) tickCallback();
  }

  for (i = 0; i < N; i++) {
    var offset = Xi + (2 * r - 1) * 64;
    var j = XY.readUInt32LE(offset) & N - 1;
    blockxor(V, j * Yi, XY, Xi, Yi);
    blockmix_salsa8(XY, Xi, Yi, r, _X, B32, x);
    if (tickCallback) tickCallback();
  }

  XY.copy(B, Bi, Xi, Xi + Yi);
}

function blockmix_salsa8(BY, Bi, Yi, r, _X, B32, x) {
  var i;
  arraycopy(BY, Bi + (2 * r - 1) * 64, _X, 0, 64);

  for (i = 0; i < 2 * r; i++) {
    blockxor(BY, i * 64, _X, 0, 64);
    salsa20_8(_X, B32, x);
    arraycopy(_X, 0, BY, Yi + i * 64, 64);
  }

  for (i = 0; i < r; i++) {
    arraycopy(BY, Yi + i * 2 * 64, BY, Bi + i * 64, 64);
  }

  for (i = 0; i < r; i++) {
    arraycopy(BY, Yi + (i * 2 + 1) * 64, BY, Bi + (i + r) * 64, 64);
  }
}

function R(a, b) {
  return a << b | a >>> 32 - b;
}

function salsa20_8(B, B32, x) {
  var i;

  for (i = 0; i < 16; i++) {
    B32[i] = (B[i * 4 + 0] & 0xff) << 0;
    B32[i] |= (B[i * 4 + 1] & 0xff) << 8;
    B32[i] |= (B[i * 4 + 2] & 0xff) << 16;
    B32[i] |= (B[i * 4 + 3] & 0xff) << 24; // B32[i] = B.readUInt32LE(i*4)   <--- this is signficantly slower even in Node.js
  }

  arraycopy(B32, 0, x, 0, 16);

  for (i = 8; i > 0; i -= 2) {
    x[4] ^= R(x[0] + x[12], 7);
    x[8] ^= R(x[4] + x[0], 9);
    x[12] ^= R(x[8] + x[4], 13);
    x[0] ^= R(x[12] + x[8], 18);
    x[9] ^= R(x[5] + x[1], 7);
    x[13] ^= R(x[9] + x[5], 9);
    x[1] ^= R(x[13] + x[9], 13);
    x[5] ^= R(x[1] + x[13], 18);
    x[14] ^= R(x[10] + x[6], 7);
    x[2] ^= R(x[14] + x[10], 9);
    x[6] ^= R(x[2] + x[14], 13);
    x[10] ^= R(x[6] + x[2], 18);
    x[3] ^= R(x[15] + x[11], 7);
    x[7] ^= R(x[3] + x[15], 9);
    x[11] ^= R(x[7] + x[3], 13);
    x[15] ^= R(x[11] + x[7], 18);
    x[1] ^= R(x[0] + x[3], 7);
    x[2] ^= R(x[1] + x[0], 9);
    x[3] ^= R(x[2] + x[1], 13);
    x[0] ^= R(x[3] + x[2], 18);
    x[6] ^= R(x[5] + x[4], 7);
    x[7] ^= R(x[6] + x[5], 9);
    x[4] ^= R(x[7] + x[6], 13);
    x[5] ^= R(x[4] + x[7], 18);
    x[11] ^= R(x[10] + x[9], 7);
    x[8] ^= R(x[11] + x[10], 9);
    x[9] ^= R(x[8] + x[11], 13);
    x[10] ^= R(x[9] + x[8], 18);
    x[12] ^= R(x[15] + x[14], 7);
    x[13] ^= R(x[12] + x[15], 9);
    x[14] ^= R(x[13] + x[12], 13);
    x[15] ^= R(x[14] + x[13], 18);
  }

  for (i = 0; i < 16; ++i) {
    B32[i] = x[i] + B32[i];
  }

  for (i = 0; i < 16; i++) {
    var bi = i * 4;
    B[bi + 0] = B32[i] >> 0 & 0xff;
    B[bi + 1] = B32[i] >> 8 & 0xff;
    B[bi + 2] = B32[i] >> 16 & 0xff;
    B[bi + 3] = B32[i] >> 24 & 0xff; // B.writeInt32LE(B32[i], i*4)  //<--- this is signficantly slower even in Node.js
  }
} // naive approach... going back to loop unrolling may yield additional performance


function blockxor(S, Si, D, Di, len) {
  for (var i = 0; i < len; i++) {
    D[Di + i] ^= S[Si + i];
  }
}

function arraycopy(src, srcPos, dest, destPos, length) {
  if (Buffer.isBuffer(src) && Buffer.isBuffer(dest)) {
    src.copy(dest, destPos, srcPos, srcPos + length);
  } else {
    while (length--) {
      dest[destPos++] = src[srcPos++];
    }
  }
}

module.exports = {
  checkAndInit: checkAndInit,
  smix: smix,
  smixSync: smixSync
};