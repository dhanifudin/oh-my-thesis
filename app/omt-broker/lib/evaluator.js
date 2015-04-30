var logger = require('./log')('omt:model');
var persistence = require('./persistence');
var async = require('async');
var model = null;

var Evaluator = function(_model) {
  model = _model;
};

Evaluator.prototype.filter = function(trackUser, payload) {
  var track = JSON.parse(payload);

  var user = track.user; // jshint ignore:line
  var lat = track.lat; // jshint ignore:line
  var lng = track.lng; // jshint ignore:line
  var time = track.time; // jshint ignore:line

  var result = 0;

  Object.keys(model.users).forEach(function(currentUser) {
    logger.debug('current user: ' + currentUser + ' trackUser: ' + trackUser);
    if (currentUser !== trackUser) {
      var tracks = model.getTracks(currentUser);
      if (typeof tracks !== 'undefined') {
        tracks.forEach(function(filter) {
          if (eval(filter)) { // jshint ignore:line
            logger.debug('subscription match, notify tracker: ' + currentUser);
            model.notify(currentUser, 'OK', track);
            result += 1;
            return;
          }
        });
      }
    } else {
      logger.debug('skip evaluate track from same user');
    }
  });

  return result;
}

Evaluator.prototype.handleTracker = function(user, payload) {
  try {
    var message = JSON.parse(payload);
    if (typeof model.getTracks(user) === 'undefined') {
      model.initTracks(user);
      /* users[user].tracks = []; */
    }
    switch(message.type) {
      case 'TRACK':
        model.addTrack(user, message.filter);
        model.notify(user, 'TRACK', message);
        break;
      case 'UNTRACK':
        model.removeTrack(user, message.filter);
        model.notify(user, 'UNTRACK', message);
        break;
    }
    logger.dump(model.users);
  } catch(e) {
    logger.debug(e);
  }
}

function contains(location, point) { // jshint ignore:line
  var result = false;
  async.series([
    persistence.contains(location, point, function(err, rows) {
      if (err) {
        return;
      }
      result = rows.length > 0 ? true : false;
    })
  ]);
  return result;
}

module.exports = function(users) {
  return new Evaluator(users);
};
