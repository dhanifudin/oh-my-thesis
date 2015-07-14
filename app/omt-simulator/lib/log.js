var bunyan = require('bunyan');
var util = require('util');

var Log = function(path) {
  var filePath = util.format('./log/%s.log', path);

  this.logger = bunyan.createLogger({
    name: 'mosca-publisher',
    streams: [{
      path: filePath
    }]
  });
}

Log.prototype.info = function(message) {
  this.logger.info(message);
}

module.exports = function(path) {
  return new Log(path);
}
