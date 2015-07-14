var constant = require('./constant');

var Simulator = function() {};

Simulator.prototype.publish = function(mode, user, number, output) {
  switch(mode) {
    case constant.mode.SIMPLE:
      var simple = require('./simple')(user);
      simple.publish(number, output);
      break;
    case constant.mode.ADAPTIVE:
      var adaptive = require('./adaptive')(user);
      adaptive.publish(number, output);
      break;
    default:
      console.log('Invalid mode');
  }
};

Simulator.prototype.subscribe = function(mode, user, number, output) {
  switch(mode) {
    case constant.mode.SIMPLE:
      var simple = require('./simple')(user);
      simple.subscribe(number, output);
      break;
    case constant.mode.ADAPTIVE:
      var adaptive = require('./adaptive')(user);
      adaptive.subscribe(number, output);
      break;
    default:
      console.log('Invalid mode');
  }
}

module.exports = new Simulator();
