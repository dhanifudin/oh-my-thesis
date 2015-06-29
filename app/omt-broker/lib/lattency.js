var fs = require('fs');
var util = require('util');
var bunyan = require('bunyan');

var Lattency = function(path) {
  var filePath = util.format('./log/lattency/%s.log', path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  this.logger = bunyan.createLogger({
    name: 'mosca-lattency',
    streams: [{
      path: filePath
    }]
  });
}

Lattency.prototype.info = function(payload) {
  try {
    var data = JSON.parse(payload);
    this.logger.info({
      arrive: new Date().getTime(),
      user: data.user,
      lat: data.lat,
      lng: data.lng,
      sent: data.time
    });
  } catch(e) {
    this.logger.e(e);
  }
}

module.exports = function(path) {
  return new Lattency(path);
}
