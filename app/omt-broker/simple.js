var logger = require('./lib/log')('omt:simple');
var options = require('./broker.json');
var express = require('./lib/express');
var mosca = require('mosca');
var server = new mosca.Server(options.broker);
var model = require('./lib/model')(server, options);
var evaluator = require('./lib/evaluator')(model);

server.on('ready', onReady);
server.on('clientConnected', onClientConnected);
server.on('published', onPublished);
server.on('subscribed', onSubscribed);
server.on('clientDisconnected', onClientDisconnected);

express.http.listen(8000, function() {
  server.attachHttpServer(express.http);
  console.log('Express app is listening');
});

function onReady() {
  console.log('Simple broker is up and running');
}

function onClientConnected(client) {
  model.addUser(client.id);
}

function onPublished(packet, client) {
  logger.debug([packet.topic, packet.payload].join(': '));
  switch(packet.topic) {
    case 'track':
      evaluator.filter(client.id, packet.payload);
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
