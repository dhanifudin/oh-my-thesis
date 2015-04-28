(function() {
  angular.module('marker.controllers', [
  ])

  .controller('MarkerController', [
    'marker.data',
    'marker.rest',
    'leafletData',
    '$mdDialog',
    'util',
    markerController
  ])

  .controller('LocationDialogController', [
    '$timeout',
    'marker.data',
    'marker.rest',
    '$mdDialog',
    'util',
    locationDialogController
  ]);

  function markerController(data, rest, leafletData, $mdDialog, util) {
    var that = this;
    that.data = data;

    that.its = {
      lat: -7.27956,
      lng: 112.79744,
      zoom: 16
    };

    that.controls = {
      draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false
      }
    };

    rest.locations.index().
      $promise.then(function(geojsonFeatures) {
        that.geojsonFeatures = geojsonFeatures;
        leafletData.getMap().then(mapHandler);
      });

    function mapHandler(map) {
      that.geojsonFeatures.forEach(function(geojson) {
        var layer = L.geoJson(geojson);
        // Dynamic label
        layer.bindLabel(geojson.properties.name).addTo(map);
        // Static label
        var label = new L.Label();
        label.setContent(geojson.properties.name);
        label.setLatLng(layer.getBounds().getCenter());
        map.showLabel(label);
        layer.addTo(map);
      });
      var drawnItems = that.controls.edit.featureGroup;

      map.on('draw:created', function(e) {
        var layer = e.layer;
        that.data.geojson = layer.toGeoJSON();

        $mdDialog.show({
          controller: 'LocationDialogController as dialog',
          templateUrl: 'view/dialog/location.html'
        }).then(success, failure);

        function success() {
          // Dynamic label
          layer.bindLabel(that.data.name).addTo(map);
          // Static label
          var label = new L.Label();
          label.setContent(that.data.name);
          label.setLatLng(layer.getBounds().getCenter());
          map.showLabel(label);
          drawnItems.addLayer(layer);
          util.toast(that.data.name + ' has been saved');
          that.data.clear();
        }

        function failure() {
          that.data.clear();
          util.toast('You canceled the dialog');
        }
      });
    }
  }

  function locationDialogController($timeout, data, rest, $mdDialog, util) {
    var that = this;
    that.data = data;

    that.levels = rest.levels;

    that.loadParents = function() {
      that.parents = [];
      return $timeout(function() {
        if (typeof that.data.level !== 'undefined') {
          that.parents = rest.parents.show({
            id: that.data.level
          });
        }
      }, 650);
    };

    that.save = function() {
      that.data.geojson.properties = {
        code: that.data.code,
        name: that.data.name,
        level: that.data.level,
        parent: that.data.parent
      };
      rest.locations.create(
        that.data.geojson,
        function(response) {
          $mdDialog.hide();
          util.toast('Success: ' + response);
        },
        function(response) {
          util.toast('Failure: ' + response);
        }
      );
    };

    that.cancel = function() {
      $mdDialog.cancel();
    };
  }

})();
