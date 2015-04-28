var fs = require('fs');
var util = require('util');

var Simulator = function() {};

Simulator.prototype.generate = function(mode, input, output) {
  switch(mode) {
    case 'simple':
      generateSimple(input, output);
      break;
  }
};

Simulator.prototype.simulate = function(mode, user, input, output) {
  switch(mode) {
    case 'simple':
      simulateSimple(user, input, output);
      break;
  }
};

function generateSimple(input, output) {
  /* var conf = require(input); */
  var content = [];
  for (var i = 0; i < 100; i++) {
    content.push({
      lat: 123 + i,
      lng: 456 + i
    });
  }
  fs.writeFile(
    util.format('./data/track/%s.json', output),
    JSON.stringify(content),
    function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(util.log('Generate was done!'));
    });
}

function simulateSimple(user, input, output) {
  var client = require('./client')(user, output);
  var data = require(util.format('../data/track/%s', input));
  client.connect(user);

  var index = 0;
  var interval = setInterval(function() {
    var packet = {
      user: user,
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

module.exports = new Simulator();
