/* vim: set foldmethod=marker: */

/* Javascript shims {{{ */
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) == str;
  };
}

Array.prototype.add = function(value) {
  if (this.indexOf(value) < 0) {
    this.push(value);
  }
}

Array.prototype.remove = function(value) {
  var index = this.indexOf(value);
  if (index > -1) {
    this.splice(index, 1);
  }
}
/* }}} Javascript shims */

/* Modules declarations {{{ */
var program = require('commander');
var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
var httpServer = http.createServer(app);
var logger = require('./lib/log')('omt:app');
var options = require('./broker.json');
var mosca = require('mosca');
var moscaServer = new mosca.Server(options.broker);
var server = require('./lib/server')(moscaServer);
var constant = require('./lib/constant');
var broker = null;
/* var evaluator = require('./lib/evaluator')(model); */
/* }}} Modules declarations */

/* Prompt to user {{{ */
program
  .usage('[options] [args]')
  .option('-m, --mode <mode>', 'Mode', /^(simple|adaptive)$/i, 'adaptive')
  .option('-r, --resolution', 'Enable resolution')
  .parse(process.argv);
/* }}} Prompt to user */

/* ExpressJS configuration {{{ */
// Configure bodyparser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup static page directory
app.use(express.static(path.dirname(require.resolve('mosca')) + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Routing
var api = require('./routes/api');
var location = require('./routes/location');
app.use('/api', api);
app.use('/api/locations', location);
/* }}} ExpressJS configuration */

/* Mosca events {{{ */
moscaServer.on('ready', onReady);
moscaServer.on('clientConnected', onClientConnected);
moscaServer.on('published', onPublished);
moscaServer.on('subscribed', onSubscribed);
moscaServer.on('clientDisconnected', onClientDisconnected);
/* }}} Mosca events */

/* Events handler {{{ */
function onReady() {
  switch(program.mode) {
    case constant.mode.SIMPLE:
      broker = require('./lib/simple')(moscaServer, program.resolution);
      break;
    case constant.mode.ADAPTIVE:
      broker = require('./lib/adaptive')(moscaServer, program.resolution);
      break;
  }
  console.log('MQTT ' + program.mode + ' broker is up and running');
}

function onClientConnected(client) {
  server.addUser(client.id);
}

function onPublished(packet, client) {
  logger.debug([packet.topic, packet.payload].join(': '));
  if (typeof client !== 'undefined') {
    switch(packet.topic) {
      case constant.topic.LOCATION:
        broker.filter(client.id, packet.payload);
        break;
      case constant.topic.TRACK:
        server.track(client.id, packet.payload);
        break;
      case constant.topic.UNTRACK:
        server.untrack(client.id, packet.payload);
        break;
    }
  }
}

function onSubscribed(topic, client) {
  logger.debug([topic, client].join(': '));
}

function onClientDisconnected(client) {
  server.removeUser(client.id);
}
/* }}} Events handler */

httpServer.listen(options.broker.httpPort, function() {
  moscaServer.attachHttpServer(httpServer);
  console.log('Express app is listening');
});
