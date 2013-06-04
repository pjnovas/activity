var util = require('util');

var StatusNotFound = module.exports = function (message) {
  this.code = "StatusNotFound";
  this.httpCode = 404;
  this.message = message || this.code;
};

util.inherits(StatusNotFound, Error);