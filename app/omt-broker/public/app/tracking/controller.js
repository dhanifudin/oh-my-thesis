(function() {

  angular.module('tracking.controllers', [])

  .controller('TrackingController', [
    '$scope',
    '$mdDialog',
    'leafletData',
    'tracking.mqtt',
    'tracking.rest',
    'tracking.data',
    'util',
    trackingController
  ])

  .controller('LoginController', [
    'tracking.mqtt',
    'tracking.data',
    'util',
    loginController
  ])

  .controller('TrackDialogController', [
    '$scope',
    '$timeout',
    '$mdDialog',
    'tracking.data',
    'tracking.mqtt',
    'tracking.rest',
    trackDialogController
  ])

  .controller('TabController', [
    tabController
  ])

  .controller('TrackListController', [
    'tracking.data',
    'tracking.mqtt',
    'util',
    'ACTION',
    'CODE',
    trackListController
  ]);

  function trackingController($scope, $mdDialog, leafletData, mqtt, rest, data, util, action, code) {
    var that = this;

    angular.extend($scope, {
      its: {
        lat: -7.27956,
        lng: 112.79744,
        zoom: 16
      },
      markers: data.markers
    });

    /* $scope.$on('messageEvent', function(event, data) { */
    /*   handleMessage(data.topic, data.payload); */
    /* }); */

    /* leafletData.getMap().then(mapHandler); */

    that.logout = function() {
      util.log('Logout');
      mqtt.end();
    };

    that.showTrackDialog = function(event) {
      util.log('Track Dialog');
      $mdDialog.show({
        controller: 'TrackDialogController as dialog',
        templateUrl: 'view/dialog/track.html',
        targetEvent: event
      })
      .then(function() {
        util.log('OK');
      }, function() {
        util.log('Cancel');
      });
    };

    function handleMessage(topic, payload) {
      util.log('Received => ' + [topic, payload].join(': '));
      if (topic === data.storage.username) {
        try {
          var message = JSON.parse(payload);
          util.log('Received => ' + JSON.stringify(message));
          if (message.code === 'OK') {
            switch(message.action) {
              /* case action.TRACK: */
              case 'TRACK':
                  if ($scope.markers.hasOwnProperty(message.user)) {
                    $scope.markers[message.user].lat = message.lat;
                    $scope.markers[message.user].lng = message.lng;
                    util.log('Updating location, Lat: ' + message.lat + ' Lng: ' + message.lng);
                  } else {
                    $scope.markers[message.user] = {
                      lat: message.lat,
                      lng: message.lng,
                      message: message.user,
                      focus: true
                    }
                    util.log('New location, Lat: ' + message.lat + ' Lng: ' + message.lng);
                  }
                  /* data.storage.tracks.push(message.filter); */
                /* }); */
                break;
              /* case action.ADD: */
              case 'ADD':
                data.tracks.add(message.filter);
                break;
              /* case action.REMOVE: */
              case 'REMOVE':
                data.tracks.remove(message.filter);
                break;
            }
          } else if (message.code === 'ERR') {
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
  }

  function loginController(mqtt, data, util) {
    var that = this;

    that.connect = function() {
      /* mqtt.dummy(data.storage.username); */
      mqtt.connect(data.storage.username);
      util.log('Connecting using username: ' + data.storage.username);
    };

    that.clear = function() {
      data.clear();
      util.log('Clear username');
    };
  }

  function trackDialogController($scope, $timeout, $mdDialog, data, mqtt, rest) {
    var that = this;

    that.loadUsers = function() {
      that.users = [];
      return $timeout(function() {
        that.users = rest.users.index();
      });
    };

    that.loadAreas = function() {
      that.areas = [];
      return $timeout(function() {
        that.areas = rest.areas.index();
      });
    };

    that.filters = [];

    that.selectedType = null;
    that.selectedUser = null;
    that.manualFilter = null;

    that.types = [
      { name: 'By People', value: 'people' },
      { name: 'By Area', value: 'area' },
      { name: 'By Manual', value: 'manual' }
    ];

    that.operators = [
      { name: 'And', value: 'and' },
      { name: 'Or', value: 'or' },
      { name: 'Empty', value: null }
    ];

    that.isPeopleType = function() {
      return that.selectedType === 'people';
    };

    that.isAreaType = function() {
      return that.selectedType === 'area';
    };

    that.isManualType = function() {
      return that.selectedType === 'manual';
    };

    that.add = function() {
      var expression;
      if (that.isPeopleType()) {
        expression = 'user = \'' + that.selectedUser + '\'';
      } else if (that.isAreaType()) {
        expression = 'area = \'' + that.selectedArea + '\'';
      } else if (that.isManualType) {
        expression = that.manualFilter;
      }
      that.filters.push({
        type: that.selectedType,
        expression: expression,
        operator: null
      });
      that.selectedType = null;
      that.selectedUser = null;
      that.selectedArea = null;
      that.manualFilter = null;
    };

    that.removeByIndex = function(index) {
      if (index > -1) {
        that.filters.splice(index, 1);
      }
    };

    that.hide = function() {
      $mdDialog.hide();
    };

    that.cancel = function() {
      $mdDialog.cancel();
    };

    that.save = function() {
      var value = '';
      that.filters.forEach(function(filter) {
        value = [value,
          [filter.expression, filter.operator].join(' ')
        ].join(' ');
      });
      mqtt.track(value.trim());
      /* data.addSubscription(value); */
      $mdDialog.hide();
    };

  }

  function tabController() {
    var that = this;
    that.length = 2;

    that.selectedIndex = 0;

    that.next = function() {
      that.selectedIndex = Math.min(that.selectedIndex + 1, that.length);
    };

    that.previous = function() {
      that.selectedIndex = Math.max(that.selectedIndex - 1, 0);
    };
  }

  function trackListController(data, mqtt, util) {
    var that = this;

    that.tracks = data.tracks;
    /* that.tracks = data.storage.tracks; */
    /* that.subscriptions = data.subscriptions; */
    that.untrack = function(index) {
      mqtt.untrack(index);
      util.log('Untrack filter index: ' + index);
    }
    /* that.unsubscribe = function(index) { */
    /*   if (index > -1) { */
    /*     data.subscriptions.splice(index, 1); */
    /*     util.log('unsubscribe'); */
    /*   } */
    /* }; */

  }

})();
