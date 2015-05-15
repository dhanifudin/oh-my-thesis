var util = require('util');
var fs = require('fs')
var Generator = function() {}

Generator.prototype.simple = function(input, output) {
  var content = [];
  for (var i = 0; i < 100; i += 1) {
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

module.exports = new Generator();
