var fs = require('fs');
var util = require('util');
var usage = require('usage');
var bunyan = require('bunyan');

var Usage = function(server) {
  this.server = server;
  this.pid = process.pid;
  this.options = {
    keepHistory: true
  }
  this.log = null;
}

Usage.prototype.monitor = function(path) {
  var that = this;
  var filePath = util.format('./log/usage/%s.log', path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  that.log = bunyan.createLogger({
    name: 'mosca-usage',
    streams: [{
      path: filePath
    }]
  });

  var interval = setInterval(function() {
    usage.lookup(that.pid, that.options, function(err, result) {
      that.log.info({
        time: getUnixTimestamp(),
        users: Object.keys(that.server.users).length,
        cpu: result.cpu,
        memory: result.memory
      });
    });
  }, 100);

  process.on('SIGINT', function() {
    clearInterval(interval);
    process.exit();
  });

}

function getUnixTimestamp() {
  return new Date().getTime();
}

module.exports = function(server) {
  return new Usage(server);
}
