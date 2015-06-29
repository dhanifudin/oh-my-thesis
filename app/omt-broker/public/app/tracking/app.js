(function() {
  'use strict';

  angular.module('tracking', [
    'tracking.controllers',
    'tracking.services'
  ])

  .constant('FLAG', {
    'TRACK': 'TRACK',
    'CHECK': 'CHECK'
  })

  .constant('CODE', {
    'OK': 'OK',
    'ERR': 'ERR'
  })

  .constant('ACTION', {
    'ADD': 'ADD',
    'REMOVE': 'REMOVE',
    'TRACK': 'TRACK',
    'UNTRACK': 'UNTRACK',
    'CHECK': 'CHECK'
  })

  .constant('LEVEL', {
    'COORDINATE': 1,
    'BUILDING': 2,
    'ZONE': 3,
    'AREA': 4
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
