var resolution = require('./lib/resolution');

resolution.getLocation('subscriber1', 'publisher2', {
  lat: 112.79835230112076,
  lng: -7.285888366574687
}, function(err, level, location) {
  console.log(level);
  console.log(location);
});
