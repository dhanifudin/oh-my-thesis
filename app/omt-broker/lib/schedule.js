var logger = require('./log')('omt:schedule');
var schedule = require('node-schedule');

var Schedule = function() {};

Schedule.prototype.addJob = function(user, date) {
  logger.debug('Add schedule job for ' + user + ' on ' + date);
  var job = schedule.scheduleJob(date, function() {
    logger.debug('Running job for ' + user);
  });
}

module.exports = new Schedule();
