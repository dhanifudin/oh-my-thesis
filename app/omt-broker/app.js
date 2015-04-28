/* vim: set foldmethod=marker: */

/******************************************************************************
 *                              Javascript Shims                              *
 ******************************************************************************/

/* Javascript shims {{{ */
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) == str;
  };
}

if (typeof Array.prototype.add !== 'function') {
  Array.prototype.add = function(value) {
    if (this.indexOf(value) < 0) {
      this.push(value);
    }
  }
}

if (typeof Array.prototype.remove !== 'function') {
  Array.prototype.remove = function(value) {
    var index = this.indexOf(value);
    if (index > -1) {
      this.splice(index, 1);
    }
  }
}
/* }}} Javascript shims */

/* Modules declaration {{{ */
var broker = require('./lib/broker');
var express = require('express');
var http = require('http');
var path = require('path');
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
