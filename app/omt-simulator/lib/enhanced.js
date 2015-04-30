var util = require('util');

var Enhanced = function(user, path) {
  this.user = user;
  this.client = null;
  this.logger = require('./log')('client', path);
};

Enhanced.prototype.simulate = function(input, output) {
  var client = require('./client')(this.user, output);
  var data = require(util.format('../data/track/%s', input));
  client.connect(this.user);
  client.client.on('connect', function() {
    client.client.on('message', function(topic, message) {
      handleMessage(topic, message);
    });
  });

  var index = 0;
  var interval = setInterval(function() {
    var packet = {
      user: this.user,
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

function handleMessage(topic, payload) {
  this.logger.debug('Received => ' + [topic, payload].join(': '));
  if (topic === this.user) {
    try {
      var message = JSON.parse(payload);
      switch(message.code) {
        case 'OK':
          this.logger.debug('OK');
          break;
        case 'TRACK':
          break;
        case 'UNTRACK':
          break;
        case 'STOP':
          break;
        case 'CHECK':
          break;
      }
    } catch(e) {
      this.logger.debug(e);
    }
  }
}

module.exports = function(user, path) {
  return new Enhanced(user, path);
};

