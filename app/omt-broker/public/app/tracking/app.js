(function() {
  'use strict';

  angular.module('tracking', [
    'tracking.controllers',
    'tracking.services'
  ])

  .run([
    '$rootScope',
    'tracking.data',
    'tracking.mqtt',
    'util',
    function($rootScope, data, mqtt, util) {
      $rootScope.$data = data;
      $rootScope.$storage = data.storage;
      util.log(data);
      if (data.storage.username === null) {
        util.log('Username is empty');
      } else {
        mqtt.connect(data.storage.username);
        util.log('Reconnect using existing username ' + data.storage.username);
      }
    }
  ]);

})();
