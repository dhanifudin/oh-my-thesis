(function() {

  if (typeof Array.prototype.add !== 'function') {
    Array.prototype.add = function(value) {
      if (this.indexOf(value) < 0) {
        this.push(value);
      }
    }
  }

  if (typeof Array.prototype.remove !== 'function') {
    Array.prototype.remove = function(value) {
      var index = this.indexOf(value);
      if (index > -1) {
        this.splice(index, 1);
      }
    }
  }

  angular.module('omtApp', [
    'ngMaterial',
    'ngStorage',
    'ui.router',
    'leaflet-directive',
    'omt.controllers',
    'omt.services',
    'tracking',
    'marker'
  ])

  .config([
    '$mdThemingProvider',
    '$mdIconProvider',
    '$stateProvider',
    '$urlRouterProvider',
    configuration
  ]);

  function configuration(
    $mdThemingProvider,
    $mdIconProvider,
    $stateProvider,
    $urlRouterProvider
  ) {
    // Icon configuration
    $mdIconProvider
      .defaultIconSet('./assets/svg/avatars.svg', 128)
      .icon('add',           './assets/svg/add.svg',           24)
      .icon('remove',        './assets/svg/remove.svg',        24)
      .icon('remove-circle', './assets/svg/remove-circle.svg', 24)
      .icon('menu',          './assets/svg/menu.svg',          24)
      .icon('share',         './assets/svg/share.svg',         24)
      .icon('google_plus',   './assets/svg/google_plus.svg',   512)
      .icon('hangouts',      './assets/svg/hangouts.svg',      512)
      .icon('twitter',       './assets/svg/twitter.svg',       512)
      .icon('phone',         './assets/svg/phone.svg',         512);

    // Theme configuration
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('light-blue');

    // Route configuration
    $urlRouterProvider.otherwise('/');

    $stateProvider
      // Main page / Tracking
      .state('home', {
        url: '/',
        templateUrl: 'view/tracking.html',
        controller: 'TrackingController as track'
      })

      // Marker page
      .state('marker', {
        url: '/marker',
        templateUrl: 'view/marker.html',
        controller: 'MarkerController as marker'
      });
  }
})();
