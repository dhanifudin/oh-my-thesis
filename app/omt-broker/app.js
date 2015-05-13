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
var server = new mosca.Server(options.broker);
var model = require('./lib/model')(server, options);
var evaluator = require('./lib/evaluator')(model);
/* }}} Modules declarations */

/* Prompt to user {{{ */
program
  .usage('[options] [args]')
  .option('-m, --mode <mode>', 'Mode', /^(simple|enhanced)$/i, 'enhanced')
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
server.on('ready', onReady);
server.on('clientConnected', onClientConnected);
server.on('published', onPublished);
server.on('subscribed', onSubscribed);
server.on('clientDisconnected', onClientDisconnected);
/* }}} Mosca events */

/* Events handler {{{ */
function onReady() {
  console.log('MQTT ' + program.mode + ' broker is up and running');
}

function onClientConnected(client) {
  model.addUser(client.id);
}

function onPublished(packet, client) {
  logger.debug([packet.topic, packet.payload].join(': '));
  switch(packet.topic) {
    case 'track':
      var user = model.getUserId(client.id);
      if(evaluator.filter(user, packet.payload)) {
        if (program.mode === 'enhanced') {
          model.checkIdle(user)
        }
      }
      break;
    case 'tracker':
      evaluator.handleTracker(client.id, packet.payload);
      break;
  }
}

function onSubscribed(topic, client) {
  console.log([topic, client].join(': '));
}

function onClientDisconnected(client) {
  model.removeUser(client.id);
}
/* }}} Events handler */

httpServer.listen(options.broker.httpPort, function() {
  server.attachHttpServer(httpServer);
  console.log('Express app is listening');
});
