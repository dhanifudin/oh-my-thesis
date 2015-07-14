var util = require('util');
var debug = require('debug')('simple');
var options = require('../options.json');

var Simple = function(user) {
  this.user = user;
  this.client = null;
  debug('User: ' + user);
};

Simple.prototype.publish = function(number, output) {
  var that = this;
  var client = require('./client')(that.user, output);
  var userdata = require(util.format('../data/publisher/%s.json', that.user));
  var data = require(util.format('../data/track/%s.json', userdata.data));
  client.connect();
  client.client.on('connect', function() {
    client.subscribe();
    client.client.on('message', function(topic, message) {
      debug([topic, message].join(': '));
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

    client.location(packet);
    index += 1;
    if ((index * options.client.interval) >= options.client.time) {
      clearInterval(interval);
      client.end();
    }
  }, options.client.interval);
}

Simple.prototype.subscribe = function(number, output) {
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
  }, options.client.time + options.client.wait);
}

function getUnixTime() {
  return new Date().getTime();
}

module.exports = function(user) {
  return new Simple(user);
};

