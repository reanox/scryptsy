"use strict";

var scrypt = require('./scryptSync');

scrypt.async = require('./scrypt');
module.exports = scrypt;