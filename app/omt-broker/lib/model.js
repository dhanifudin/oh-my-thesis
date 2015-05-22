var logger = require('./log')('omt:model');

var Model = function(server, options) {
  this.server = server;
  this.options = options;
  this.users = {};
}

Model.prototype.addUser = function(clientId) {
  if (isValidClient(clientId)) {
    var user = this.getUserId(clientId);
    if (typeof this.users[user] === 'undefined') {
      this.users[user] = {
        idle: this.options.broker.idle
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
    case 'OK':
      message.user = data.user;
      message.lat = data.lat;
      message.lng = data.lng;
      message.time = data.time;
      break;
    case 'TRACK':
    case 'UNTRACK':
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
    this.notify(user, 'STOP');
    this.users[user].idle = this.options.broker.idle;
  }
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

Model.prototype.addTrack = function(user, filter) {
  /* if (typeof this.users[user].tracks === 'undefined') { */
  /*   this.users[user].tracks = []; */
  /* } */
  logger.debug('Add ' + filter + ' into user: ' + user);
  this.users[user].tracks.add(filter);
}

Model.prototype.removeTrack = function(user, filter) {
  this.users[user].tracks.remove(filter);
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
