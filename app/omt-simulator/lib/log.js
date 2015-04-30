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

Log.prototype.dump = function(message) {
  var json = JSON.stringify(message, null, '  ');
  this.debug(util.format('\n %s', json));
}

module.exports = function(namespace, path) {
  return new Log(namespace, path);
};
