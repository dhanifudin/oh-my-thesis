(function() {
  angular.module('tracking.services', [
    'ngResource',
    'ngStorage'
  ])

  .service('tracking.data', [
    '$localStorage',
    function($storage) {
      var that = this;
      this.client = null;
      this.joined = false;
      this.tracks = [];
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

    }
  ])

  .factory('tracking.mqtt', [
    '$rootScope',
    '$window',
    'tracking.data',
    'util',
    'TOPIC',
    mqttFactory
  ])

  .factory('tracking.rest', [
    '$resource',
    restFactory
  ]);

  function mqttFactory($rootScope, $window, data, util, topic) {

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
          switch(message.code) {
            case 'OK':
              util.log(message);
              break;
            case 'TRACK':
              $rootScope.$apply(function() {
                data.tracks.add(message.filter);
                /* data.storage.tracks.push(message.filter); */
              });
              break;
            case 'UNTRACK':
              $rootScope.$apply(function() {
                data.tracks.remove(message.filter);
                /* data.storage.tracks.remove(message.filter); */
              });
              break;
            case 'STOP':
              util.log('STOP');
              break;
            case 'CHECK':
              util.log('CHECK');
              break;
          }
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
        data.client.publish(
          'tracker',
          JSON.stringify(message),
          callback
        );
      }
    }

    function track(filter) {
      publish(topic.TRACK, filter, function(e1, e2) {
        util.log(e1);
        util.log(e2);
      });
    }

    function untrack(index) {
      /* var filter = data.storage.tracks[index]; */
      var filter = data.tracks[index];
      publish(topic.UNTRACK, filter, function(e1, e2) {
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
