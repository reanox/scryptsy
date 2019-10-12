"use strict";

require("regenerator-runtime/runtime");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var crypto = require('crypto');

var _require = require('./utils'),
    checkAndInit = _require.checkAndInit,
    smix = _require.smix; // N = Cpu cost, r = Memory cost, p = parallelization cost


function scrypt(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8) {
  return _scrypt.apply(this, arguments);
}

function _scrypt() {
  _scrypt = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(key, salt, N, r, p, dkLen, progressCallback, promiseInterval) {
    var _checkAndInit, XY, V, B32, x, _X, B, tickCallback, i;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _checkAndInit = checkAndInit(key, salt, N, r, p, dkLen, progressCallback), XY = _checkAndInit.XY, V = _checkAndInit.V, B32 = _checkAndInit.B32, x = _checkAndInit.x, _X = _checkAndInit._X, B = _checkAndInit.B, tickCallback = _checkAndInit.tickCallback;
            i = 0;

          case 2:
            if (!(i < p)) {
              _context.next = 8;
              break;
            }

            _context.next = 5;
            return smix(B, i * 128 * r, r, N, V, XY, _X, B32, x, tickCallback, promiseInterval);

          case 5:
            i++;
            _context.next = 2;
            break;

          case 8:
            return _context.abrupt("return", crypto.pbkdf2Sync(key, B, 1, dkLen, 'sha256'));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _scrypt.apply(this, arguments);
}

module.exports = scrypt;