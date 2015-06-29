(function() {
  angular.module('tracking.services', [
    'ngResource',
    'ngStorage'
  ])

  .service('tracking.data', [
    '$rootScope',
    '$localStorage',
    'LEVEL',
    'util',
    function($rootScope, $storage, LEVEL, util) {
      var that = this;
      this.client = null;
      this.joined = false;
      this.tracks = [];
      this.markers = {};

      this.storage = $storage.$default({
        username: null,
        /* tracks: [] */
      });

      this.clear = function() {
        that.client = null;
        that.joined = false;
        that.tracks = [];
        that.storage.$default({
          username: null,
          tracks: []
        });
      }

      this.updateMarker = function(track) {
        util.log(that.markers);
        if (that.markers.hasOwnProperty(track.user)) {
          that.markers[track.user].lat = track.lat;
          that.markers[track.user].lng = track.lng;
          util.log('Updating location, Lat: ' + track.lat + ' Lng: ' + track.lng);
        } else {
          that.markers[track.user] = {
            lat: track.lat,
            lng: track.lng,
            message: track.user
          }
          util.log('New location, Lat: ' + track.lat + ' Lng: ' + track.lng);
        }
      }

      function getMarker(level) {
        var marker = null;
        switch(level) {
          case LEVEL.COORDINATE:
            marker = L.AwesomeMarkers.icon({
              markerColor: 'red'
            });
            break;
          case LEVEL.BUILDING:
            marker = L.AwesomeMarkers.icon({
              markerColor: 'green'
            });
            break;
          case LEVEL.ZONE:
            marker = L.AwesomeMarkers.icon({
              markerColor: 'blue'
            });
            break;
          case LEVEL.AREA:
            marker = L.AwesomeMarkers.icon({
              markerColor: 'yellow'
            });
            break;
          default:
            marker = L.AwesomeMarkers.icon({
              markerColor: 'white'
            });
            break;
        }
        return marker;
      }
    }
  ])

  .factory('tracking.mqtt', [
    '$rootScope',
    '$window',
    'tracking.data',
    'util',
    'CODE',
    'ACTION',
    mqttFactory
  ])

  .factory('tracking.rest', [
    '$resource',
    restFactory
  ]);

  function mqttFactory($rootScope, $window, data, util, code, action) {

    function connect(username) {
      var options = {
        clientId: 'webtrack_' + username
      };
      data.client = $window.mqtt.connect(options);

      data.client.on('connect', function() {
        $rootScope.$apply(function() {
          subscribe(username);
          data.joined = true;
        });
      });
      data.client.on('message', function(topic, payload) {
        /* $rootScope.$broadcast('messageEvent', { topic: topic, payload: payload }); */
        handleMessage(topic, payload);
      });
      data.client.on('close', function() {
        $rootScope.$apply(function() {
          data.joined = false;
        });
      });
    }

    function handleMessage(topic, payload) {
      util.log('Received => ' + [topic, payload].join(': '));
      if (topic === data.storage.username) {
        try {
          var message = JSON.parse(payload);
          util.log('Received => ' + JSON.stringify(message));
          if (message.code === code.OK) {
            switch(message.action) {
              case action.TRACK:
                $rootScope.$apply(function() {
                  data.updateMarker(message);
                  /* data.storage.tracks.push(message.filter); */
                });
                break;
              case action.ADD:
                $rootScope.$apply(function() {
                  data.tracks.add(message.filter);
                  /* data.storage.tracks.push(message.filter); */
                });
                break;
              case action.REMOVE:
                $rootScope.$apply(function() {
                  data.tracks.remove(message.filter);
                  /* data.storage.tracks.remove(message.filter); */
                });
                break;
            }
          } else if (message.code === code.ERR) {
            util.log('Error');
          }
          /* switch(message.code) { */
          /*   case 'OK': */
          /*     util.log(message); */
          /*     break; */
          /*   case 'TRACK': */
          /*     $rootScope.$apply(function() { */
          /*       data.tracks.add(message.filter); */
          /*       /1* data.storage.tracks.push(message.filter); *1/ */
          /*     }); */
          /*     break; */
          /*   case 'UNTRACK': */
          /*     $rootScope.$apply(function() { */
          /*       data.tracks.remove(message.filter); */
          /*       /1* data.storage.tracks.remove(message.filter); *1/ */
          /*     }); */
          /*     break; */
          /*   case 'STOP': */
          /*     util.log('STOP'); */
          /*     break; */
          /*   case 'CHECK': */
          /*     util.log('CHECK'); */
          /*     break; */
          /* } */
        } catch(e) {
          util.log(e);
        }
      }
    }

    function publish(type, filter, callback) {
      if (data.client != null) {
        var message = {
          type: type,
          filter: filter
        };
        util.log(message);
        data.client.publish(
          type,
          JSON.stringify(message),
          callback
        );
      }
    }

    function track(filter) {
      util.log(filter);
      publish(action.ADD, filter, function(e1, e2) {
        util.log(e1);
        util.log(e2);
      });
    }

    function untrack(index) {
      /* var filter = data.storage.tracks[index]; */
      var filter = data.tracks[index];
      publish(action.REMOVE, filter, function(e1, e2) {
        util.log(e1);
        util.log(e2);
      });
    }

    function subscribe(topic) {
      if (data.client !== null) {
        data.client.subscribe(topic);
      }
    }

    function end() {
      if (data.client !== null) {
        data.client.end();
        data.clear();
      }
    }

    return {
      connect: connect,
      track: track,
      untrack: untrack,
      end: end
    };

  }

  function restFactory($resource) {
    var users = $resource(
      '/api/users',
      null, {
        'index': { method: 'GET', isArray: true }
      }
    );

    var areas = $resource(
      '/api/areas',
      null, {
        'index': { method: 'GET', isArray: true }
      }
    );

    return {
      users: users,
      areas: areas
    };
  }

})();
