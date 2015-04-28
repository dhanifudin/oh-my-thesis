angular.module('omt.services', [])

.factory('util', [
  '$window',
  '$mdToast',
  utilService
]);

function utilService($window, $mdToast) {

  var logger = $window.debug('omt');

  function log(message) {
    logger(message);
  }

  function toast(message) {
    $mdToast.show(
      $mdToast.simple()
        .content(message)
        .hideDelay(2000)
        .position('bottom right')
    );
  }

  return {
    log: log,
    toast: toast
  };
}
