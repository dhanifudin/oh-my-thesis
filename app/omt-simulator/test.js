/* function bearing(lat1, lon1, lat2, lon2) { */
/*   lat1 *= Math.PI / 180; */
/*   lon1 *= Math.PI / 180; */
/*   lat2 *= Math.PI / 180; */
/*   lon2 *= Math.PI / 180; */
/*   var lonDelta = lon2 - lon1; */
/*   var y = Math.sin(lonDelta) * Math.cos(lat2); */
/*   var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta); */
/*   var brng = Math.atan2(y, x); */
/*   brng = brng * (180 / Math.PI); */

/*   if ( brng < 0 ) { brng += 360; } */

/*   return brng; */
/* } */

/* var lat1 = 53.320556; */
/* var lng1 = 1.729722; */
/* var lat2 = 53.204444; */
/* var lng2 = 0.075; */

/* console.log(bearing(lat1, lng1, lat2, lng2)); */

var async = require('async');
var persistence = require('./lib/persistence');

var center1;
var center2;

async.series([
  function() {
    console.log('function 1');
  },
  function() {
    console.log('function 2');
  },
  function() {
    console.log('function 3');
  }
  ],
  function(err, results) {
    console.log('Finisih');
  }
            );

async.series([
  persistence.center('ZONA_ASRAMA', function(center) {
    center1 = center;
  }),
  persistence.center('ZONA_FTIF', function(center) {
    center2 = center;
  })
  ],
  function(err, results) {
    console.log(err);
    console.log(results);
    /* console.log(center1); */
    /* console.log(center2); */
});
