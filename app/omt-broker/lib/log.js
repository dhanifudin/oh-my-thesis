var bunyan = require('bunyan');

var Log = function(namespace) {
  this.logger = bunyan.createLogger({
    name: namespace,
    streams: [{
      path: './log/broker.log'
    }]
  });
  this.debug = require('debug')(namespace);
};

Log.prototype.log = function(message) {
  this.logger.info(message);
};

Log.prototype.verbose = function(message) {
  this.logger.info(message);
  this.debug(message);
};

module.exports = function(namespace) {
  return new Log(namespace);
};
