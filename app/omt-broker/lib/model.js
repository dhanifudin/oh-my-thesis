var logger = require('./log')('omt:model');
var schedule = require('node-schedule');
var constant = require('./constant');
var options = require('../broker.json');

var Model = function(server) {
  this.server = server;
  /* this.options = options; */
  this.users = {};
}

Model.prototype.addUser = function(clientId) {
  if (isValidClient(clientId)) {
    var user = this.getUserId(clientId);
    if (typeof this.users[user] === 'undefined') {
      this.users[user] = {
        idle: options.broker.idle
      };
      if (typeof this.users[user].users === 'undefined') {
        this.users[user].users = [];
        this.users[user].tracks = [];
      }
    }
    this.users[user].users.add(clientId);
  }
  logger.dump(this.users);
}

Model.prototype.removeUser = function(clientId) {
  if (isValidClient(clientId)) {
    var user = this.getUserId(clientId);
    this.users[user].users.remove(clientId);
    if (this.users[user].users.length === 0) {
      delete this.users[user];
    }
  }
  logger.debug('Client disconnected: ', clientId);
  logger.dump(this.users);
}

Model.prototype.notify = function(user, code, data) {
  var message = {
    code: code
  };
  switch(code) {
    case 'L':
      message.user = data.user;
      message.lat = data.lat;
      message.lng = data.lng;
      message.time = data.time;
      break;
    case constant.code.TRACK_OK:
    case constant.code.UNTRACK_OK:
      message.filter = data.filter;
      break;
    case constant.code.TRACK_NOT_OK:
    case constant.code.UNTRACK_NOT_OK:
      message.filter = data.filter;
      break;
  }
  message = JSON.stringify(message);
  this.server.publish({
    topic: user,
    payload: message
  });
  logger.debug('Notify into user: ' + user + ' message: ' + message);
}

Model.prototype.checkIdle = function(user) {
  this.users[user].idle -= 1;
  if (this.users[user].idle === 0) {
    this.notify(user, constant.code.STOP);
    logger.dump(this.users);
    this.users[user].idle = options.broker.idle;
    this.addSchedule(user);
  }
}

Model.prototype.addSchedule = function(user) {
  var that = this;
  var date = new Date(new Date().getTime() + (options.broker.schedule) * 60000);
  logger.debug(that.users);
  that.users[user].job = schedule.scheduleJob(date, function() {
    logger.debug('Notify check for user: ' + user);
    that.notify(user, constant.code.CHECK);
  });
}

/* Model.prototype.idle = function(user) { */
/*   logger.debug('User: ' + user); */
/*   this.users[user].idle -= 1; */
/* } */

/* Model.prototype.isIdle = function(user) { */
/*   return (this.users[user].idle === 0); */
/* } */

/* Model.prototype.setIdle = function(user) { */
/*   this.users[user].idle = this.options.broker.idle; */
/* } */

Model.prototype.getUsers = function() {
  return this.users;
}

/* Model.prototype.initTracks = function(user) { */
/*   this.users[user].tracks = []; */
/* } */

Model.prototype.track = function(user, payload) {
  try {
    var data = JSON.parse(payload);
    var currentUser = this.users[user];
    if (typeof currentUser !== 'undefined') {
      currentUser.tracks.add(data.filter);
      this.notify(user, 'T', data);
      logger.debug('Track ' + data.filter + ' into user: ' + user);
    }
  } catch(e) {
    logger.debug(e);
  }
}

Model.prototype.untrack = function(user, payload) {
  try {
    var data = JSON.parse(payload);
    var currentUser = this.users[user];
    if (typeof currentUser !== 'undefined') {
      currentUser.tracks.remove(payload);
      this.notify(user, 'U', data);
      logger.debug('Untrack ' + data.filter + ' into user: ' + user);
    }
  } catch(e) {
    logger.debug(e);
  }
}

Model.prototype.getTracks = function(user) {
  if (typeof this.users[user].tracks === 'undefined') {
    this.users[user].tracks = [];
  }
  return this.users[user].tracks;
};

function isValidClient(clientId) {
  return clientId.startsWith('webtrack_') ||
    clientId.startsWith('droidtrack_');
}

Model.prototype.getUserId = function(clientId) {
  return clientId.substr(clientId.indexOf('_') + 1);
}

module.exports = function(server, options) {
  return new Model(server, options);
}
