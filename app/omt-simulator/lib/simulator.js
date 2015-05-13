var generator = require('./generator');

var Simulator = function() {};

Simulator.prototype.generate = function(mode, input, output) {
  switch(mode) {
    case 'simple':
      generator.simple(input, output);
      break;
    case 'area':
      generator.area(code1, code2, distance);
      break;
    default:
      console.log('Invalid mode');
  }
};

Simulator.prototype.simulate = function(mode, user, input, output) {
  switch(mode) {
    case 'simple':
      var simple = require('./simple')(user, output);
      simple.simulate(input, output);
      break;
    case 'enhanced':
      var enhanced = require('./enhanced')(user, output);
      enhanced.simulate(input, output);
      break;
    default:
      console.log('Invalid mode');
  }
};

module.exports = new Simulator();
