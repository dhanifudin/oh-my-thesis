var Constant = function() {

  this.mode = Object.freeze({
    'SIMPLE': 'simple',
    'ADAPTIVE': 'adaptive'
  });

  /* this.topic = Object.freeze({ */
  /*   'TRACK': 'track', */
  /*   'UNTRACK': 'untrack', */
  /*   'LOCATION': 'location', */
  /* }); */

  /* this.code = Object.freeze({ */
  /*   'STOP': 'STOP', */
  /*   'TRACK_OK': 'T1', */
  /*   'TRACK_NOT_OK': 'T0', */
  /*   'UNTRACK_OK': 'U1', */
  /*   'UNTRACK_NOT_OK': 'U0', */
  /*   'LOC_OK': 'L1' */
  /* }); */

  this.flag = Object.freeze({
    'TRACK': 'TRACK',
    'CHECK': 'CHECK'
  });

  this.code = Object.freeze({
    'OK': 'OK',
    'ERR': 'ERR'
  });

  this.action = Object.freeze({
    'ADD': 'ADD',
    'REMOVE': 'REMOVE',
    'DATA': 'DATA',
    'TRACK': 'TRACK',
    'UNTRACK': 'UNTRACK',
    'CHECK': 'CHECK'
  });

};

module.exports = new Constant();

