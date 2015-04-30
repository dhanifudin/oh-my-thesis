var mqtt = require('mqtt');
var util = require('util');
var options = require('../options.json');

var Client = function(user, path) {
  this.user = user;
  this.client = null;
  this.logger = require('./log')('client', path);
};

Client.prototype.connect = function(user) {
  var that = this;
  if (options.client) {
    options.client.clientId = 'droidtrack_' + user;
  }
  that.client = mqtt.connect(options.client);
};

Client.prototype.track = function(filter) {
  var message = {
    type: 'TRACK',
    filter: filter
  };
  this.publish('tracker', JSON.stringify(message));
}

Client.prototype.untrack = function(filter) {
  var message = {
    type: 'UNTRACK',
    filter: filter
  };
  this.publish('tracker', JSON.stringify(message));
}

Client.prototype.publish = function(topic, message) {
  var that = this;
  that.client.publish(topic, message, options.publish, function(err) {
    if (err) {
      that.logger.debug(
        util.format('%s error to publish caused by: %s', [topic, message].join(': '), err)
      );
      return;
    }
    that.logger.debug(
      util.format('%s publish successfully', [topic, message].join(': '))
    );
  });
};

Client.prototype.end = function() {
  var that = this;
  setTimeout(function() {
    that.client.end(function() {
      that.logger.debug('Connection has been closed!');
    })
  }, options.client.delay);
};

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
  return new Client(user, path);
};
