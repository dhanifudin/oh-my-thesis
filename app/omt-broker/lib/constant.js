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
  /*   'STOP': 'S', */
  /*   'CHECK': 'C', */
  /*   'TRACK': 'T', */
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
    'TRACK': 'TRACK',
    'UNTRACK': 'UNTRACK',
    'CHECK': 'CHECK'
  });

  this.level = Object.freeze({
    'COORDINATE': 1,
    'BUILDING': 2,
    'ZONE': 3,
    'AREA': 4
  });

};

module.exports = new Constant();
