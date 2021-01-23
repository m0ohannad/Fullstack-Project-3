"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashPassword = void 0;

const crypto = require('crypto');

const hashPassword = function hashPassword(Password) {
  let salt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'secret';
  return crypto.createHmac('sha256', salt).update(Password).digest('hex');
};

exports.hashPassword = hashPassword;