(function() {
  'use strict';

  angular.module('marker', [
    'marker.controllers',
    'marker.services'
  ])

  .run([
    '$rootScope',
    'marker.data',
    function($rootScope, data) {
      $rootScope.$markerdata = data;
    }
  ]);

})();

