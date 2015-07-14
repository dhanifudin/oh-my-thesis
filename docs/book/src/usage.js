var usage = require('usage');

var pid = process.pid;
usage.lookup(pid, function(err, result) {
  // monitor here
});
