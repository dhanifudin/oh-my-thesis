var async = require('async');
var util = require('util');
var constant = require('./constant');
var resolution = require('./resolution');
var logger = require('./log')('omt:server');
var persistence = require('./persistence');
var options = require('../broker.json');

var Server = function(moscaServer, resolution) {
  this.moscaServer = moscaServer;
  this.resolution = resolution;
  this.users = {};
}

Server.prototype.addUser = function(clientId) {
  if (isValidClient(clientId)) {
    var user = getUserId(clientId);
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

Server.prototype.removeUser = function(clientId) {
  if (isValidClient(clientId)) {
    var user = getUserId(clientId);
    this.users[user].users.remove(clientId);
    if (this.users[user].users.length === 0) {
      delete this.users[user];
    }
  }
  logger.debug('Client disconnected: ', clientId);
  logger.dump(this.users);
}

Server.prototype.filter = function(clientId, payload, cb) {
  try {
    var that = this;
    var trackUser = getUserId(clientId);
    var track = JSON.parse(payload);
    Object.keys(that.users).forEach(function(currentUser) {
      if (currentUser !== trackUser) {
        logger.debug('Current user: ' + currentUser + ' trackUser: ' + trackUser);
        var tracks = that.users[currentUser].tracks;
        logger.debug('Tracks: ' + tracks);

        if (typeof tracks !== 'undefined') {
          // Filter every subscription
          var filterResult = false;
          tracks.some(function(filter) {
            if (filterResult) {
              return true;
            }

            logger.debug('Evaluate for filter: ' + filter);
            var params = filter.split(' ');
            var tasks = [];
            var expressions = [];
            var operators = [];

            params.forEach(function(param) {
              if (param !== '&&' && param !== '||') {
                expressions.push(param);
                tasks.push(taskFilter());
              } else {
                operators.push(param);
              }
            });

            async.waterfall(tasks, function(err, result) {
              /* logger.debug('Result: ' + result + ' mode: ' + mode); */
              if (result) {
                logger.debug('notify track for current user: ' + currentUser);
                that.notify(currentUser, constant.code.LOC_OK, track);
              }
              cb(trackUser, result);
              /* else { */
              /*   if (mode === constant.mode.ADAPTIVE) { */
              /*     logger.debug('check idle for adaptive'); */
              /*     model.checkIdle(trackUser); */
              /*   } */
              /* } */
              filterResult = result;
            });

            function taskFilter() {
              return function(result, callback) {
                // Handle first task waterfall
                var user, area, previousResult;
                if (typeof callback === 'undefined') {
                  callback = result;
                } else {
                  previousResult = result;
                }
                eval(expressions[0]); // jshint ignore:line
                if (typeof user !== 'undefined')
                  filterByUser(user, previousResult, callback);
                else if (typeof area !== 'undefined')
                  filterByArea(area, previousResult, callback);
              }
            }

            function filterByUser(user, previousResult, callback) {
              logger.debug('TrackUser: ' + trackUser + ' filter: ' + user);
              var result = (user === trackUser);
              expressions.splice(0, 1);
              if (typeof previousResult !== 'undefined') {
                var exp = [previousResult, operators[0], result].join(' ');
                operators.splice(0, 1);
                result = eval(exp); // jshint ignore:line
              }
              logger.debug('Evaluate filter user: ' + user);
              callback(null, result);
            }

            function filterByArea(area, previousResult, callback) {
              persistence.area(area, track, function(err, rows) {
                if(err)
                  callback(err, false);
                else {
                  var result = rows > 0;
                  expressions.splice(0, 1);
                  if (typeof previousResult !== 'undefined') {
                    var exp = [previousResult, operators[0], result].join(' ');
                    operators.splice(0, 1);
                    result = eval(exp); // jshint ignore:line
                  }
                  logger.debug('Evaluate filter area: ' + area);
                  callback(null, result);
                }
              });
            }

          });
        }
      } else {
        logger.debug('Skip for Current user: ' + currentUser + ' Track user: ' + trackUser);
      }
    });
  } catch(e) {
    logger.debug(e);
  }
}

Server.prototype.track = function(clientId, payload) {
  var that = this;
  this.parse(clientId, payload, function(user, userData, filter) {
    userData.tracks.add(filter);
    that.notify(user, constant.code.TRACK_OK, filter);
  });
}

Server.prototype.untrack = function(clientId, payload) {
  var that = this;
  this.parse(clientId, payload, function(user, userData, filter) {
    userData.tracks.remove(filter);
    that.notify(user, constant.code.UNTRACK_OK, filter);
  });
}

Server.prototype.notify = function(user, code, data) {
  var message = { code: code };
  switch(code) {
    case constant.code.TRACK_OK:
    case constant.code.UNTRACK_OK:
      message.filter = data;
    break;
  }
  message = JSON.stringify(message);
  this.moscaServer.publish({
    topic: user,
    payload: message
  });
  logger.debug(util.format('Notify into user: %s, message: %s', user, message));
}

Server.prototype.parse = function(clientId, payload, callback) {
  try {
    var user = getUserId(clientId);
    var data = JSON.parse(payload);
    var userData = this.users[user];
    if (typeof userData !== 'undefined') {
      callback(user, userData, data.filter);
      /* this.notify(user, 'T', data); */
    }
  } catch(e) {
    logger.debug(e);
  }
}

function isValidClient(clientId) {
  return clientId.startsWith('webtrack_') ||
    clientId.startsWith('droidtrack_');
}

function getUserId(clientId) {
  return clientId.substr(clientId.indexOf('_') + 1);
}

module.exports = function(moscaServer) {
  return new Server(moscaServer);
}
