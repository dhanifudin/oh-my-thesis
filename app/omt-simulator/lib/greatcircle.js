var GreatCircle = function() {};

GreatCircle.prototype.toDecimal = function(degree, minute, second) {
  return degree + (minute/60) + (second/3600);
}

GreatCircle.prototype.toDegree = function(radian) {
  return (radian * 180) / Math.PI;
}

GreatCircle.prototype.toRadian = function(degree) {
  return (degree * Math.PI) / 180;
}

GreatCircle.prototype.bearing = function(location1, location2) {
  location1 = {
    lat: this.toRadian(location1.lat),
    lng: this.toRadian(location1.lng)
  };
  location2 = {
    lat: this.toRadian(location2.lat),
    lng: this.toRadian(location2.lng)
  };
  var deltaLng = location2.lng - location1.lng;
  var y = Math.sin(deltaLng) * Math.cos(location2.lat);
  var x = Math.cos(location1.lat) * Math.sin(location2.lat) -
    Math.sin(location1.lat) * Math.cos(location2.lat) * Math.cos(deltaLng);
  var bearing = Math.atan2(y, x);
  bearing = this.toDegree(bearing);
  return (bearing + 360) % 360;
}

GreatCircle.prototype.destination = function(location, bearing, distance, unit) {
  if (unit === undefined) {
    unit = 'm';
  }
  var R = validateRadius(unit);
  location = {
    lat: this.toRadian(location.lat),
    lng: this.toRadian(location.lng)
  }
  bearing = this.toRadian(bearing);
  var lat = Math.asin(
    Math.sin(location.lat) * Math.cos(distance/R) +
    Math.cos(location.lat) * Math.sin(distance/R) * Math.cos(bearing)
  );
  var lng = location.lng + Math.atan2(
    Math.sin(bearing) * Math.sin(distance/R) * Math.cos(location.lat),
    Math.cos(distance/R) - (Math.sin(location.lat) * Math.sin(lat))
  );
  return {
    lat: this.toDegree(lat),
    lng: this.toDegree(lng)
  }
}

function validateRadius(unit) {
  var R = {
    'm': 6371000,
    'km': 6371
  }
  return (unit in R) ? R[unit] : unit;
}

module.exports = new GreatCircle();
