(function() {
  'use strict';

  angular.module('marker.services', [
    'ngResource',
    'ngStorage'
  ])

  .service('marker.data', [
    function() {
      var that = this;
      this.properties = {}

      this.clear = function() {
        that.properties = {}
      }
    }
  ])

  .factory('marker.rest', [
    '$resource',
    restFactory
  ]);

  /* function dataFactory(util) { */
  /*   var properties = { */
  /*     code: null, */
  /*     name: null, */
  /*     level: null, */
  /*     parent: null, */
  /*     geojson: null */
  /*   }; */

  /*   function clear() { */
  /*     properties = { */
  /*       code: null, */
  /*       name: null, */
  /*       level: null, */
  /*       parent: null, */
  /*       geojson: null */
  /*     }; */
  /*   } */

  /*   return { */
  /*     code: properties.code, */
  /*     name: properties.name, */
  /*     level: properties.level, */
  /*     parent: properties.parent, */
  /*     geojson: properties.geojson, */
  /*     clear: clear */
  /*   } */
  /*   /1* $sessionStorage.$default({ *1/ */
  /*   /1*   location: {}, *1/ */
  /*   /1*   properties: {} *1/ */
  /*   /1* }); *1/ */

  /*   /1* function clear() { *1/ */
  /*   /1*   delete $sessionStorage.location; *1/ */
  /*   /1*   delete $sessionStorage.properties; *1/ */
  /*   /1*   util.log($sessionStorage.location); *1/ */
  /*   /1*   util.log($sessionStorage.properties); *1/ */
  /*   /1* } *1/ */

  /*   /1* return { *1/ */
  /*   /1*   location: $sessionStorage.location, *1/ */
  /*   /1*   properties: $sessionStorage.properties, *1/ */
  /*   /1*   clear: clear *1/ */
  /*   /1* }; *1/ */
  /* } */

  function restFactory($resource) {

    var levels = $resource(
      '/api/levels', {
      }, {
        'index': { method: 'GET', isArray: true }
      }
    ).index();

    var locations = $resource(
      '/api/locations/:id', {
        id: '@_id'
      }, {
        'create': { method: 'POST' },
        'index': { method: 'GET', isArray: true },
        'show': { method: 'GET', isArray: true },
        'update': { method: 'PUT' },
        'destroy': { method: 'DELETE' }
      }
    );

    var parents = $resource(
      '/api/parents/:id', {
        id: '@_id'
      }, {
        'show': { method: 'GET', isArray: true }
      }
    );

    return {
      levels: levels,
      locations: locations,
      parents: parents
    };
  }
})();
