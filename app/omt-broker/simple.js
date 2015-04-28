/* vim: set foldmethod=marker: */

/* Modules declaration {{{ */
var broker = require('./lib/broker');
var express = require('express');
var http = require('http');
var path = require('path');
/* var debug = require('debug')('omt:app'); */
var app = express();
var httpServer = http.createServer(app);
/* }}} Modules declaration */

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

// Attach Http server into broker
broker.attachServer(httpServer);

