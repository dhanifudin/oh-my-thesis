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
  logger.debug('Resolution: ' + this.resolution);
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
            var words = filter.split(' ');
            var tasks = [],
              props = [],
              comparators = [],
              values = [],
              logicals = [];

            words.forEach(function(word) {
              if (/user|area/i.test(word)) {
                props.push(word);
              } else if(/=|<>|<=|>=/.test(word)) {
                comparators.push(word);
              } else if (/and|or/i.test(word)) {
                logicals.push(word);
              } else {
                values.push(word.replace(/'/g, ''));
              }
            });

            for (var i = 0; i < props.length; i += 1) {
              tasks.push(taskFilter(props[i], comparators[i], values[i], logicals[i - 1]));
            }

            function taskFilter(prop, comparator, value, logical) {
              return function(result, callback) {
                var previousResult;
                // Handle first task waterfall
                if (typeof callback === 'undefined') {
                  callback = result;
                } else {
                  previousResult = result;
                }
                switch(prop.toUpperCase()) {
                  case 'USER':
                    filterByUser(previousResult, comparator, value, logical, callback);
                    break;
                  case 'AREA':
                    filterByArea(previousResult, value, logical, callback);
                    break;
                  default:
                    callback(null, false);
                    break;
                }
              }
            }

            function logicalHelper(result1, logical, result2) {
              switch(logical.toUpperCase()) {
                case 'AND':
                  return (result1 && result2);
                case 'OR':
                  return (result1 || result2);
                default:
                  return false;
              }
            }

            function filterByUser(previousResult, comparator, value, logical, callback) {
              logger.debug('trackUser: ' + trackUser + ' value: ' + value);
              var result = (comparator == '=') ?
                (trackUser === value) : (
                  (comparator == '<>') ? (trackUser !== value) : false
              );
              if (typeof logical !== 'undefined') {
                result = logicalHelper(previousResult, logical, result);
              }
              callback(null, result);
            }

            function filterByArea(previousResult, area, logical, callback) {
              persistence.area(area, track, function(err, rows) {
                if (err)
                  callback(err, false);
                else {
                  var result = rows > 0;
                  if (typeof logical !== 'undefined') {
                    result = logicalHelper(previousResult, logical, result);
                  }
                  callback(null, result);
                }
              });
            }

            async.waterfall(tasks, function(err, result) {
              if (result) {
                logger.debug('notify track for current user: ' + currentUser);
                logger.debug('Resolution module: ' + that.resolution);
                if (that.resolution) {
                  resolution.getLocation(currentUser, trackUser, {
                    lat: track.lat,
                    lng: track.lng
                  }, function(err, level, location) {
                    logger.debug('Resolution module, Level: ' + level + ' location: ' + location);
                    track.level = level;
                    if (location != null) {
                      track.lat = location.lat;
                      track.lng = location.lng;
                    }
                    that.notify(
                      currentUser,
                      constant.code.OK,
                      constant.action.TRACK,
                      track
                    );
                  })
                } else {
                  that.notify(
                    currentUser,
                    constant.code.OK,
                    constant.action.TRACK,
                    track
                  );
                }
              }
              cb(trackUser, result, track.flag);
              filterResult = result;
            });

          });
        }
      } else {
        logger.debug('Skip for Current user: ' + currentUser + ' Track user: ' + trackUser);
        cb(trackUser, false, track.flag);
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
    that.notify(user, constant.code.OK, constant.action.ADD, filter);
  });
}

Server.prototype.untrack = function(clientId, payload) {
  var that = this;
  this.parse(clientId, payload, function(user, userData, filter) {
    userData.tracks.remove(filter);
    that.notify(user, constant.code.OK, constant.action.REMOVE, filter);
  });
}

Server.prototype.notify = function(user, code, action, data) {
  var message = {
    code: code,
    action: action
  };
  if (code === constant.code.OK) {
    switch(action) {
      case constant.action.ADD:
      case constant.action.REMOVE:
        message.filter = data;
        break;
      case constant.action.TRACK:
        message.id = data.id;
        message.user = data.user;
        message.lat = data.lat;
        message.lng = data.lng;
        message.time = data.time;
        break;
      case constant.action.UNTRACK:
        break;
    }
  }
  /* switch(action) { */
  /*   case constant.code.LOC_OK: */
  /*     message.user = data.user; */
  /*     message.lat = data.lat; */
  /*     message.lng = data.lng; */
  /*     message.time = data.time; */
  /*     break; */
  /*   case constant.code.TRACK_OK: */
  /*   case constant.code.UNTRACK_OK: */
  /*     message.filter = data; */
  /*   break; */
  /* } */
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

module.exports = function(moscaServer, resolution) {
  return new Server(moscaServer, resolution);
}
