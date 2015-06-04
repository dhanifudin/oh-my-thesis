var logger = require('./log')('omt:simple');

var Simple = function(moscaServer, resolution) {
  this.server = require('./server')(moscaServer, resolution);
  this.moscaServer = moscaServer;
};

Simple.prototype.filter = function(clientId, payload) {
  this.server.filter(clientId, payload, function(trackUser, result) {
    logger.debug([trackUser, result].join(': '));
  });
}

module.exports = function(moscaServer, resolution) {
  return new Simple(moscaServer, resolution);
}
