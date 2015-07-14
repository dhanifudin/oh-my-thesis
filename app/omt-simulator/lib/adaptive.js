var util = require('util');
var debug = require('debug')('adaptive');
var constant = require('./constant');
var options = require('../options.json');

var Adaptive = function(user) {
  this.user = user;
  this.client = null;
  this.tracked = true;
  this.checked = false;
  debug('User: ' + user);
};

Adaptive.prototype.publish = function(number, output) {
  var that = this;
  var client = require('./client')(that.user, output);
  var userdata = require(util.format('../data/publisher/%s.json', that.user));
  debug('Map: ' + userdata.data);
  var data = require(util.format('../data/track/%s.json', userdata.data));
  debug('Data: ' + data.length);
  client.connect();
  client.client.on('connect', function() {
    client.subscribe();
    client.client.on('message', function(topic, message) {
      that.handleMessage(topic, message);
    });
  });

  var index = 0;
  var interval = setInterval(function() {
    var packet = {
      id: data[index].id,
      user: that.user,
      lat: data[index].lat,
      lng: data[index].lng,
      time: getUnixTime()
    };

    if (that.tracked) {
      packet.flag = constant.flag.TRACK;
      client.location(packet);
    } else if (that.checked) {
      packet.flag = constant.flag.CHECK;
      client.location(packet);
    }

    index += 1;
    if ((index * options.client.interval) >= options.client.time) {
      clearInterval(interval);
      client.end();
    }
  }, options.client.interval);
}

Adaptive.prototype.subscribe = function(number, output) {
  var that = this;
  var client = require('./client')(that.user, output);
  var userdata = require(util.format('../data/subscriber%s/%s.json', number, that.user));
  var lattency = require('./lattency')(output);
  client.connect();
  client.client.on('connect', function() {
    client.subscribe();
    userdata.tracks.forEach(function(track) {
      client.track(track);
    });
    client.client.on('message', function(topic, message) {
      lattency.info(message);
      debug([topic, message].join(': '));
    });
  });

  setTimeout(function() {
    client.end();
  }, options.client.time);
}

Adaptive.prototype.handleMessage = function(topic, message) {
  if (topic === this.user) {
    try {
      var data = JSON.parse(message);
      debug(data.action);
      switch(data.action) {
        case constant.action.TRACK:
          this.tracked = true;
          this.checked = false;
          break;
        case constant.action.UNTRACK:
          this.tracked = false;
          this.checked = false;
          break;
        case constant.action.CHECK:
          if (!this.tracked) {
            this.checked = true;
          }
          break;
      }
    } catch(e) {
      debug(e);
    }
  }
}

function getUnixTime() {
  return new Date().getTime();
}

module.exports = function(user) {
  return new Adaptive(user);
};

