/* vim: set foldmethod=marker: */

var logger = require('./log')('omt:persistence');
var fs = require('fs');
var mysql = require('mysql');
var options = require('../broker.json');

var pool = mysql.createPool(options.database);

var Persistence = function() {};

/* Level {{{ */
Persistence.prototype.getLevels = function(cb) {
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM level', function(err, rows) {
      connection.release();
      cb(err, rows);
    });
  });
};
/* }}} Level */

Persistence.prototype.area = function(code, location, callback) {
  var params = [
    code,
    location.lng,
    location.lat,
  ];
  this.execute(
    'SELECT * FROM location WHERE code = ? \
    AND st_contains(geo, POINT(?, ?))',
    params,
    function(err, rows) {
      callback(err, rows);
    }
  )
}

/* Location {{{ */
Persistence.prototype.contains = function(location, point, cb) {
  var data = [
    location,
    point.latitude,
    point.longitude
  ];
  this.execute(
    'SELECT * FROM location WHERE code = ? AND st_contains(geo, POINT(?, ?))',
    data,
    function(err, rows) {
      cb(err, rows);
    }
  );
  /* pool.getConnection(function(err, connection) { */
  /*   var data = [ */
  /*     location, */
  /*     point.latitude, */
  /*     point.longitude */
  /*   ]; */
  /*   connection.query( */
  /*     'SELECT * FROM location WHERE code = ? AND st_contains(geo, POINT(?, ?))', */
  /*     data, */
  /*     function(err, rows) { */
  /*       cb(err, rows); */
  /*   }); */
  /* }); */
};
/* }}} Location */

/* Base Function {{{ */
Persistence.prototype.execute = function(sql, data, cb) {
  pool.getConnection(function(err, connection) {
    var query = connection.query(sql, data, function(err, rows) {
      cb(err, rows);
      connection.release();
    });
    logger.debug(query.sql);
  });
};

Persistence.prototype.getWithFilter = function(table, filter, cb) {
  var data = [
    table,
    filter
  ];
  this.execute(
    'SELECT * FROM ?? WHERE ?',
    data,
    cb
  );
};

Persistence.prototype.get = function(table, cb) {
  this.getWithFilter(table, 1, cb);
};

Persistence.prototype.insert = function(table, data, cb) {
  this.execute(table, data, cb);
};
/* }}} Base Function */

module.exports = new Persistence();

