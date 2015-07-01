var logger = require('./log')('omt:adaptive');
var schedule = require('node-schedule');
var constant = require('./constant');
var options = require('../broker.json');

var Adaptive = function(server) {
  this.server = server;
};

Adaptive.prototype.filter = function(clientId, payload) {
  var that = this;
  that.server.filter(clientId, payload, function(trackUser, result, flag) {
    logger.debug([trackUser, result, flag].join(': '));
    var user = that.server.users[trackUser];
    if (typeof user !== 'undefined') {
      switch(flag) {
        case constant.flag.TRACK:
          if (!result) {
          user.idle -= 1;
          logger.debug('User: ' + trackUser + ' Idle: ' + user.idle);
          if (user.idle === 0) {
            that.server.notify(trackUser, constant.code.OK, constant.action.UNTRACK);
            user.idle = options.broker.idle;
            that.addSchedule(trackUser);
          }
        } else {
          user.idle = options.broker.idle;
        }
        break;
        case constant.flag.CHECK:
          if (result) {
          that.server.notify(trackUser, constant.code.OK, constant.action.TRACK);
          user.idle = options.broker.idle;
        } else {
          that.server.notify(trackUser, constant.code.OK, constant.action.UNTRACK);
          user.idle = options.broker.idle;
          that.addSchedule(trackUser);
        }
        break;
      }
    }
  });
}

Adaptive.prototype.addSchedule = function(user) {
  var that = this;
  var date = new Date(new Date().getTime() + (options.broker.schedule) * 60000);
  that.server.users[user].job = schedule.scheduleJob(date, function() {
    logger.debug('Notify check for user: ' + user);
    that.server.notify(user, constant.code.OK, constant.action.CHECK);
  });
}

module.exports = function(server) {
  return new Adaptive(server);
}
