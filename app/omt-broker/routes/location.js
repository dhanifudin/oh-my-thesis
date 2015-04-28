var logger = require('debug')('omt:location');
var express = require('express');
var persistence = require('../lib/persistence');
var router = express.Router();

router.get('/', function(req, res) {
  persistence.execute(
    'SELECT geojson FROM location',
    null,
    function(err, rows) {
      if (err) {
        debug('Error selecting: %s', err);
      } else {
        var results = [];
        rows.forEach(function(row) {
          results.push(JSON.parse(row.geojson));
        })
        res.json(results);
      }
    }
  )
});

router.post('/', function(req, res) {

  var geojson = req.body;

  logger(geojson);

  var data = [
    geojson.properties.code,
    geojson.properties.name,
    geojson.properties.level,
    geojson.properties.parent,
    toGeometry(geojson),
    JSON.stringify(geojson)
  ];

  persistence.execute(
    'INSERT INTO location \
    SET code = ?, name = ?, level_id = ?, parent_id = ?, \
    geo = PolyFromText(?), geojson = ?, center = Centroid(geo)',
    data,
    function(err, rows) {
      if (err) {
        logger(err);
      }
      res.json(rows);
    }
  );

});

function toGeometry(geojson) {
  var coordinates = [];
  logger(typeof geojson);
  logger(typeof geojson.geometry.coordinates[0]);
  logger(geojson.geometry.coordinates[0]);
  geojson.geometry.coordinates[0].forEach(function(geo) {
    coordinates.push(geo.join(' '));
  });
  return geojson.geometry.type.toUpperCase()
    + '((' + coordinates.join(', ') + '))';
}

module.exports = router;
