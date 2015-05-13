/* var fs = require('fs'); */
var mysql = require('mysql');
var options = require('../options.json');

var pool = mysql.createPool(options.database);

var Persistence = function() {};

Persistence.prototype.execute = function(sql, data, cb) {
  pool.getConnection(function(err, connection) {
    var query = connection.query(sql, data, function(err, rows) {
      cb(err, rows);
      connection.release();
    });
  });
}

Persistence.prototype.center = function(code, cb) {
  this.execute(
    'SELECT code, x(center) as lat, y(center) as lng from location \
    WHERE code = ?',
    code,
    function(err, rows) {
      var center = {
        lat: rows[0].lat,
        lng: rows[0].lng
      };
      cb(center);
    }
  );
}
/* Persistence.prototype.getCenter = function(code) { */
/*   var center = {}; */
/*   async.series([ */
/*     this.execute( */
/*       'SELECT code, x(center) as lat, y(center) as lng from location \ */
/*       WHERE code = ?', */
/*       code, */
/*       function(err, rows) { */
/*         if (err) { */
/*           return; */
/*         } */
/*         center.lat = rows[0].lat; */
/*         center.lng = rows[0].lng; */
/*       } */
/*     ) */
/*   ]); */
/*   return center; */
/* } */

module.exports = new Persistence();
