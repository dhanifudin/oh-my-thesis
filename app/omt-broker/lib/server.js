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
    var tasks = [];
    Object.keys(that.users).forEach(function(currentUser) {
      tasks.push(taskUser(that, trackUser, currentUser, track));
    });
    async.waterfall(tasks, function(err, result) {
      cb(trackUser, result, track.flag);
    });
  } catch(e) {
    logger.debug(e);
  }
}

function taskUser(instance, trackUser, currentUser, track, isResolution) {
  return function(result, callback) {
    var previousResult;
    // Handle first task waterfall
    if (typeof callback === 'undefined') {
      callback = result;
    } else {
      previousResult = result;
    }
    if (currentUser !== trackUser) {
      logger.debug('Current user: ' + currentUser + ' trackUser: ' + trackUser);
      var tracks = instance.users[currentUser].tracks;
      logger.debug('Tracks: ' + tracks);
      if (typeof tracks !== 'undefined') {
        var tasks = [];
        tracks.forEach(function(filter) {
          tasks.push(taskFilter(trackUser, track, filter))
        });
        async.series(tasks, function(err, results) {
          if (err) {
            logger.debug(err);
            callback(err, false);
          } else {
            var notify = results.indexOf(true) > -1;
            if (notify) {
              if (isResolution) {
                resolution.getLocation(currentUser, trackUser, {
                  lat: track.lat,
                  lng: track.lng
                }, function(err, level, location) {
                  track.level = level;
                  if (location != null) {
                    track.lat = location.lat;
                    track.lng = location.lng;
                  }
                  instance.notify(currentUser, constant.code.OK, constant.action.TRACK, track);
                })
              } else {
                instance.notify(currentUser, constant.code.OK, constant.action.TRACK, track);
              }
            }
            if (previousResult !== 'undefined')
              previousResult = previousResult || notify;
            callback(null, previousResult);
          }
        });
      }
    } else {
      logger.debug('Skip for Current user: ' + currentUser + ' Track user: ' + trackUser);
      if (previousResult !== 'undefined')
        previousResult = previousResult || false;
      callback(null, previousResult);
    }
  }
}

function taskFilter(trackUser, track, filter) {
  return function(callback) {
    var words = filter.split(' ');
    var tasks = [],
      props = [],
      comparators = [],
      values = [],
      logicals = [];
    words.forEach(function(word) {
      filterGrammar(word, props, comparators, values, logicals);
    });

    props.forEach(function(prop, index) {
      tasks.push(taskProp(
        trackUser, track, prop, comparators[index],
        values[index]
      ));
    });

    async.series(tasks, function(err, results) {
      logger.debug('Result Task Filter: ' + results + ' Filter: ' + filter);
      if (err) {
        logger.debug(err);
        callback(err, results);
      } else {
        var logic;
        for (var i = 0; i < results.length; i += 1) {
          if (typeof logic === 'undefined')
            logic = results[0];
          if (logicals.length > 0)
            logic = logicalHelper(logic, logicals[i], results[i + 1]);
          if (i === results.length - 1)
            callback(null, logic);
        }
      }
    });
  }
}

function taskProp(trackUser, track, prop, comparator, value) {
  return function(callback) {
    switch(prop.toUpperCase()) {
      case 'USER':
        filterByUser(trackUser, comparator, value, callback);
      break;
      case 'AREA':
        filterByArea(track, value, callback);
      break;
      default:
        callback(null, false);
      break;
    }
  }
}

function filterGrammar(word, props, comparators, values, logicals) {
  if (/user|area/i.test(word)) {
    props.push(word);
  } else if(/=|<>|<=|>=/.test(word)) {
    comparators.push(word);
  } else if (/and|or/i.test(word)) {
    logicals.push(word);
  } else {
    values.push(word.replace(/'/g, ''));
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

function filterByUser(trackUser, comparator, value, callback) {
  var result = (comparator == '=') ?
    (trackUser === value) : (
      (comparator == '<>') ? (trackUser !== value) : false
  );
  callback(null, result);
}

function filterByArea(track, area, callback) {
  persistence.area(area, track, function(err, rows) {
    if (err)
      callback(err, false);
    else {
      var result = rows > 0;
      callback(null, result);
    }
  });
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
        if (typeof data !== 'undefined') {
          message.id = data.id;
          message.user = data.user;
          message.lat = data.lat;
          message.lng = data.lng;
          message.level = data.level;
          message.time = data.time;
        }
        break;
      case constant.action.UNTRACK:
        break;
    }
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

module.exports = function(moscaServer, resolution) {
  return new Server(moscaServer, resolution);
}
