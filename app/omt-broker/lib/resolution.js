var async = require('async');
var constant = require('./constant');
var persistence = require('./persistence');

var Resolution = function() {};

Resolution.prototype.getLocation = function(user1, user2, location, cb) {
  async.waterfall([
    function(callback) {
      getLevel(user1, user2, callback);
    },
    function(level, callback) {
      getLocation(level, location, callback);
    }
  ], function(err, level, location) {
    cb(err, level, location);
  });
}

function getLevel(user1, user2, callback) {
  var data = [
    user1,
    user2
  ];
  persistence.execute(
    'SELECT r.relation_level AS level\
    FROM relationship r\
    INNER JOIN user u1 ON u1.id = r.relation_from\
    INNER JOIN user u2 ON u2.id = r.relation_to\
    WHERE u1.username = ? AND u2.username = ?',
    data,
    function(err, rows) {
      if (rows.length)
        callback(null, rows[0].level)
    }
  )
}

function getLocation(level, location, callback) {
  console.log(level);
  if (level == constant.level.COORDINATE) {
    callback(null, level, location);
  } else {
    var data = [
      level,
      location.lng,
      location.lat
    ];
    persistence.execute(
      'SELECT x(center) AS lng, y(center) AS lat\
      FROM location\
      WHERE level_id >= ?\
      AND st_contains(geo, POINT(?, ?))\
      ORDER BY level_id DESC',
      data,
      function(err, rows) {
        if (rows.length) {
          location = {
            lat: rows[0].lat,
            lng: rows[0].lng
          }
        } else {
          location = null;
        }
        callback(null, level, location);
      }
    )
  }
}

module.exports = new Resolution();
