var util = require('util');

var Simple = function(user, path) {
  this.user = user;
  this.client = null;
  this.logger = require('./log')('simple', path);
  this.logger.debug('User: ' + this.user);
};

Simple.prototype.simulate = function(input, output) {
  var that = this;
  var client = require('./client')(this.user, output);
  var data = require(util.format('../data/track/%s', input));
  client.connect(this.user);
  client.client.on('connect', function() {
    client.client.on('message', function(topic, message) {
      console.log([topic, message].join(': '));
    });
  });

  var index = 0;
  var interval = setInterval(function() {
    var packet = {
      user: that.user,
      lat: data[index].lat,
      lng: data[index].lng,
      time: getUnixTime()
    };

    client.publish('track', JSON.stringify(packet));
    index += 1;
    if (index >= data.length) {
      clearInterval(interval);
      client.end();
    }
  }, 1000);
}

function getUnixTime() {
  return Math.round(new Date().getTime() / 1000);
}

module.exports = function(user, path) {
  return new Simple(user, path);
};

