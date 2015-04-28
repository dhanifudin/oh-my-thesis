var bunyan = require('bunyan');
var util = require('util');

var Log = function(namespace, path) {
  this.logger = bunyan.createLogger({
    name: namespace,
    streams: [{
      path: util.format('./log/%s.log', path)
    }]
  });
  this.debug = require('debug')(namespace);
};

Log.prototype.info = function(message) {
  this.logger.info(message);
};

module.exports = function(namespace, path) {
  return new Log(namespace, path);
};
