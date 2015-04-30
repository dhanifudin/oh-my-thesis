var bunyan = require('bunyan');
var util = require('util');

var Log = function(namespace) {
  this.logger = bunyan.createLogger({
    name: namespace,
    streams: [{
      path: './log/broker.log'
    }]
  });
  this.debug = require('debug')(namespace);
};

Log.prototype.info = function(message) {
  this.logger.info(message);
};

Log.prototype.dump = function(message) {
  var json = JSON.stringify(message, null, '  ');
  this.debug(util.format('\n %s', json));
}

Log.prototype.verbose = function(message) {
  this.logger.info(message);
  this.debug(message);
};

module.exports = function(namespace) {
  return new Log(namespace);
};
