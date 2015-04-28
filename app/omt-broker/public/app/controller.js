angular.module('omt.controllers', [

])

.controller('AppController', [
  '$scope',
  'util',
  appController
]);

function appController($scope, util) {

  var that = this;

  that.testToast = function() {
    util.log('test toast');
    util.toast('Hello');
  };
}
