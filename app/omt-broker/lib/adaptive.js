var logger = require('./log')('omt:adaptive');
var schedule = require('node-schedule');
var constant = require('./constant');
var options = require('../broker.json');

var Adaptive = function(moscaServer) {
  this.server = require('./server')(moscaServer);
  this.moscaServer = moscaServer;
};

Adaptive.prototype.filter = function(clientId, payload) {
  var that = this;
  var server = this.server;
  this.server.filter(clientId, payload, function(trackUser, result) {
    console.log([trackUser, result].join(': '));
    server.users[trackUser].idle -= 1;
    if (server.users[trackUser].idle === 0) {
      server.notify(trackUser, constant.code.STOP);
      server.users[trackUser].idle = options.broker.idle;
      that.addSchedule(trackUser);
    }
  });
}

Adaptive.prototype.addSchedule = function(user) {
  var that = this;
  var date = new Date(new Date().getTime() + (options.broker.schedule) * 60000);
  logger.debug(that.users);
  that.server.users[user].job = schedule.scheduleJob(date, function() {
    logger.debug('Notify check for user: ' + user);
    that.server.notify(user, constant.code.CHECK);
  });
}

module.exports = function(moscaServer) {
  return new Adaptive(moscaServer);
}
