var logger = require('debug')('omt:api');
var express = require('express');
var persistence = require('../lib/persistence');
var router = express.Router();

router.get('/users', function(req, res) {
  persistence.execute(
    'SELECT * FROM user',
    null,
    function(err, rows) {
      if (err) {
        logger('')
      } else {
        res.json(rows);
      }
    }
  );
});

router.get('/areas', function(req, res) {
  /* var areas = [ */
  /*   { */
  /*     code: 'FTIF', */
  /*     level: 'area', */
  /*     name: 'Fakultas Teknik Informasi' */
  /*   }, */
  /*   { */
  /*     code: 'FTSP', */
  /*     level: 'area', */
  /*     name: 'Fakultas Teknik Sipil dan Perencanaan' */
  /*   } */
  /* ]; */
  /* res.json(areas); */
  persistence.execute(
    'SELECT lo.code AS code, l.name AS level, lo.name AS name FROM location lo \
    INNER JOIN level l ON l.id = lo.level_id',
    null,
    function(err, rows) {
      if (err) {
        logger('Error selecting: %s', err);
      } else {
        res.json(rows);
      }
    }
  )
});

router.get('/levels', function(req, res) {
  persistence.execute(
    'SELECT * FROM level WHERE id <> 1',
    null,
    function(err, rows) {
      if (err) {
        logger('Error selecting: %s', err);
      } else {
        res.json(rows);
      }
    }
  );
});

router.get('/parents/:id', function(req, res) {
  var data = [
    parseInt(req.params.id) + 1
  ];
  persistence.execute(
    'SELECT id, name FROM location WHERE level_id = ?',
    data,
    function(err, rows) {
      if (err) {
        logger('Error selecting: $s', err);
      } else {
        res.json(rows);
      }
    }
  );
});

module.exports = router;
