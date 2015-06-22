(function() {
  'use strict';

  angular.module('tracking', [
    'tracking.controllers',
    'tracking.services'
  ])

  .constant('TOPIC', {
    'TRACK': 'track',
    'UNTRACK': 'untrack',
    'LOCATION': 'location',
  })

  .constant('CODE', {
    'STOP': 'S',
    'CHECK': 'C',
    'TRACK': 'T',
    'TRACK_OK': 'T1',
    'TRACK_NOT_OK': 'T0',
    'UNTRACK_OK': 'U1',
    'UNTRACK_NOT_OK': 'U0',
    'LOC_OK': 'L1'
  })

  .run([
    '$rootScope',
    'tracking.data',
    'tracking.mqtt',
    'util',
    function($rootScope, data, mqtt, util) {
      $rootScope.$data = data;
      $rootScope.$storage = data.storage;
      if (data.storage.username === null) {
        util.log('Username is empty');
      } else {
        mqtt.connect(data.storage.username);
        util.log('Reconnect using existing username ' + data.storage.username);
      }
    }
  ]);

})();
