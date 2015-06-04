var logger = require('./log')('omt:evaluator');
var persistence = require('./persistence');
var constant = require('./constant');
var async = require('async');
var model = null;

var Evaluator = function(_model) {
  model = _model;
};

Evaluator.prototype.filter = function(mode, trackUser, payload) {
  var track = JSON.parse(payload);
  Object.keys(model.users).forEach(function(currentUser) {
    handleFilter(mode, currentUser, trackUser, track);
  });
}

/* Evaluator.prototype.handleTracker = function(user, payload) { */
/*   try { */
/*     var message = JSON.parse(payload); */
/*     switch(message.type) { */
/*       case 'TRACK': */
/*         logger.debug('Handle TRACK for user: ' + user); */
/*         model.addTrack(user, message.filter); */
/*         model.notify(user, 'TRACK', message); */
/*         break; */
/*       case 'UNTRACK': */
/*         logger.debug('Handle UNTRACK for user: ' + user); */
/*         model.removeTrack(user, message.filter); */
/*         model.notify(user, 'UNTRACK', message); */
/*         break; */
/*     } */
/*     logger.dump(model.users); */
/*   } catch(e) { */
/*     logger.debug(e); */
/*   } */
/* } */

function handleFilter(mode, currentUser, trackUser, track) {
  if (currentUser !== trackUser) {
    logger.debug('Current user: ' + currentUser + ' trackUser: ' + trackUser);
    var tracks = model.getTracks(currentUser);
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
          logger.debug('Result: ' + result + ' mode: ' + mode);
          if (result) {
            logger.debug('notify track for current user: ' + currentUser);
            model.notify(currentUser, constant.code.LOC_OK, track);
          } else {
            if (mode === constant.mode.ADAPTIVE) {
              logger.debug('check idle for adaptive');
              model.checkIdle(trackUser);
            }
          }
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
}

module.exports = function(users) {
  return new Evaluator(users);
};
