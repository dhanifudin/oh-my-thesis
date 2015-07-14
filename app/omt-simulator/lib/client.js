var mqtt = require('mqtt');
var util = require('util');
var debug = require('debug')('client');
var constant = require('./constant');
var options = require('../options.json');

var Client = function(user, path) {
  this.user = user;
  this.client = null;
  this.logger = require('./log')(path);
}

Client.prototype.connect = function() {
  var that = this;
  if (options.client) {
    options.client.clientId = 'droidtrack_' + that.user;
  }
  that.client = mqtt.connect(options.client);
}

Client.prototype.subscribe = function() {
  this.client.subscribe(this.user);
}

Client.prototype.location = function(data) {
  this.publish(constant.action.TRACK, JSON.stringify(data));
  this.logger.info(data);
}

Client.prototype.track = function(filter) {
  var message = {
    filter: filter
  };
  this.publish(constant.action.ADD, JSON.stringify(message));
}

Client.prototype.untrack = function(filter) {
  var message = {
    filter: filter
  };
  this.publish(constant.action.REMOVE, JSON.stringify(message));
}

Client.prototype.publish = function(topic, message) {
  var that = this;
  that.client.publish(topic, message, options.publish, function(err) {
    if (err) {
      debug(
        util.format(
          '%s error to publish caused by: %s',
          [topic, message].join(': '),
          err
        )
      );
      return;
    }
    debug(
      util.format('%s publish successfully', [topic, message].join(': '))
    );
  });
}

Client.prototype.end = function() {
  var that = this;
  setTimeout(function() {
    that.client.end(function() {
      debug('Connection has been closed!');
    })
  }, options.client.delay);
}

function handleMessage(topic, payload) {
  debug('Received => ' + [topic, payload].join(': '));
  if (topic === this.user) {
    try {
      var message = JSON.parse(payload);
      switch(message.code) {
        case 'OK':
          debug('OK');
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
      debug(e);
    }
  }
}

module.exports = function(user, path) {
  return new Client(user, path);
}
