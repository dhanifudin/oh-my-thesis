var logger = require('./log')('omt:broker');
var util = require('util');
var async = require('async');
var mosca = require('mosca');
var schedule = require('node-schedule');
var persistence = require('./persistence');

var users = {};
var jobs = {};

var settings = require('../broker.json');
var server = new mosca.Server(settings.broker);

var Broker = function() {};

/******************************************************************************
 *                                Mosca Events                                *
 ******************************************************************************/

server.on('ready', onReady);
server.on('clientConnected', onClientConnected);
server.on('published', onPublished);
server.on('subscribed', onSubscribed);
server.on('clientDisconnected', onClientDisconnected);

/******************************************************************************
 *                               Event Handlers                               *
 ******************************************************************************/

function onReady() {
  console.log('MQTT broker is up and running');
}

function onClientConnected(client) {
  var id = client.id;
  if (isValidClient(id)) {
    var user = getUserId(id);
    if (typeof users[user] === 'undefined') {
      users[user] = {
        idle: settings.broker.idle
      };
      if (typeof users[user].users === 'undefined') {
        users[user].users = [];
      }
    }
    users[user].users.add(id);
  }
  logger.debug(dump(users));
}

function onPublished(packet, client) {
  logger.debug([packet.topic, packet.payload].join(': '));
  switch(packet.topic) {
    case 'track':
      filter(client, packet.payload);
      logger.debug(dump(users));
      break;
    case 'tracker':
      var user = getUserId(client.id);
      handleTracker(user, packet.payload);
      break;
  }
}

function onSubscribed(topic, client) {
  logger.debug('Client ' + client.id + ' subscribed on ' + topic);
}

function onClientDisconnected(client) {
  var id = client.id;
  if (isValidClient(id)) {
    var user = getUserId(id);
    users[user].users.remove(id);
    if (users[user].users.length === 0) {
      /* logger.debug('clear scheduler for ' + user); */
      /* clearInterval(schedulers[user]); */
      /* delete schedulers[user]; */
      delete users[user];
    }
  }
  logger.debug('Client disconnected:', client.id);
  logger.debug(dump(users));
}

/******************************************************************************
 *                              Function Helpers                              *
 ******************************************************************************/

function isValidClient(clientId) {
  return clientId.startsWith('webtrack_') ||
    clientId.startsWith('droidtrack_');
}

function getUserId(clientId) {
  return clientId.substr(clientId.indexOf('_') + 1);
}

function filter(client, payload) {
  var exceptUser = getUserId(client.id);
  var track = JSON.parse(payload);

  var user = track.user; // jshint ignore:line
  var lat = track.lat; // jshint ignore:line
  var lng = track.lng; // jshint ignore:line
  var time = track.time; // jshint ignore:line

  var active = 0;

  Object.keys(users).forEach(function(currentUser) {
    logger.debug('current user: ' + currentUser + ' exceptUser: ' + exceptUser);
    if (currentUser !== exceptUser) {
      var tracks = users[currentUser].tracks;
      if (typeof tracks !== 'undefined') {
        tracks.forEach(function(filter) {
          if (eval(filter)) { // jshint ignore:line
            logger.debug('subscription match, notify tracker: ' + currentUser);
            notify(currentUser, 'OK', track);
            active += 1;
            return;
          }
        });
      }
    } else {
      logger.debug('skip evaluate track from same user');
    }
  });

  // if track data is not active, reduce idle value
  if (active === 0) {
    users[track.user].idle -= 1;
  }
  // if limit of idle reached, notify to unpublish and add to check scheduler
  if (users[track.user].idle === 0) {
    notify(track.user, 'STOP');
    /* trackScheduler(track.user); */
    users[track.user].idle = settings.broker.idle;
  }
}

function trackScheduler(user) {
  var date = new Date();
  date.setMinutes(date.getMinutes() + settings.broker.schedule);
  logger.verbose(util.format('Add job for %s on %s', user, date));
  schedule.scheduleJob(date, function() {
    logger.verbose(util.format('Running job for %s', user));
    notify(user, 'CHECK');
  });
}

function notify(user, code, data) {
  var payload = {
    code: code
  };
  if (code === 'OK') {
    payload.user = data.user;
    payload.lat = data.lat;
    payload.lng = data.lng;
    payload.time = data.time;
  } else if (code === 'TRACK' || code === 'UNTRACK') {
    payload.filter = data.filter;
  }
  server.publish({
    topic: user,
    payload: JSON.stringify(payload)
  });
  logger.debug('Notify => ' + [user, code, data].join(' || '));
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

function handleTracker(user, payload) {
  try {
    var message = JSON.parse(payload);
    if (typeof users[user].tracks === 'undefined') {
      users[user].tracks = [];
    }
    switch(message.type) {
      case 'TRACK':
        users[user].tracks.add(message.filter);
        notify(user, 'TRACK', message);
        break;
      case 'UNTRACK':
        users[user].tracks.remove(message.filter);
        notify(user, 'UNTRACK', message);
        break;
    }
    logger.debug(dump(users));
  } catch(e) {
    logger.debug(e);
  }
}

function dump(obj) {
  /* var json = JSON.stringify(obj, function(key, value) { */
  /*   if (value instanceof Set) { */
  /*     var arr = []; */
  /*     value.forEach(function(v) { */
  /*       arr.push(v); */
  /*     }); */
  /*     return arr; */
  /*   } */
  /*   return value; */
  /* }, '  '); */
  var json = JSON.stringify(obj, null, '  ');
  return util.format('\n %s', json);
}

Broker.prototype.attachServer = function(httpServer) {
  server.attachHttpServer(httpServer);
  httpServer.listen(settings.broker.httpPort, function() {
    console.log('Server is listening on port ' + settings.broker.httpPort);
    /* logger('Websocket server is listening on port ' + settings.broker.httpPort); */
  });
};

module.exports = new Broker();

