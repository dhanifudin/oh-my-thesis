var logger = require('./log')('omt:simple');

var Simple = function(server) {
  this.server = server;
};

Simple.prototype.filter = function(clientId, payload) {
  this.server.filter(clientId, payload, function(trackUser, result) {
    logger.debug([trackUser, result].join(': '));
  });
}

module.exports = function(server) {
  return new Simple(server);
}
