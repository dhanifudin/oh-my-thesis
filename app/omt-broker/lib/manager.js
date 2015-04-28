var logger = require('./log')('omt:manager');
var util = require('util');
var schedule = require('node-schedule');

var Manager = function(server) {
  this.server = server;
};

Manager.prototype.isIdle = function() {

}

Manager.prototype.scheduleJob = function(user, date) {
  logger.debug(util.format('Add job for %s on %s', user, date));
  schedule.scheduleJob(date, function() {
    logger.debug(util.format('Running job for %s', user));
    this.server.publish({
      topic: user,
      payload: ''
    });
  });
};

module.exports = function(server) {
  return new Manager(server);
};
