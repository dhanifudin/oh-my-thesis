/* vim: set foldmethod=marker: */

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /* bower_concat task {{{ */
    bower_concat: {
      marker: {
        dest: 'public/js/lib.js',
        cssDest: 'public/css/assets.css',
        mainFiles: {
          'leaflet.draw': [
            'dist/leaflet.draw.css',
            'dist/leaflet.draw.js'
          ],
          'Leaflet.label': [
            'dist/leaflet.label.css',
            'dist/leaflet.label.js'
          ]
        },
        exclude: [
          /* 'font-awesome' */
        ],
        dependencies: {
          'Leaflet.label': 'leaflet'
        },
        bowerOptions: {
          relative: false
        }
      }
    },
    /* }}} bower_concat task */

    /* copy task {{{ */
    copy: {
      leaflet: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: 'bower_components/leaflet/dist/images/*',
        dest: 'public/img',
      },
      draw: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: 'bower_components/leaflet.draw/dist/images/*',
        dest: 'public/css/images',
      },
      awesome_markers: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: 'bower_components/Leaflet.awesome-markers/dist/images/*',
        dest: 'public/css/images',
      }
    },
    /* }}} copy task */

    /* less task {{{ */
    less: {
      development: {
        options: {
          compress: false
        },
        files: {
          'public/css/style.css': 'less/style.less'
        }
      },
      production: {
        options: {
          compress: true
        },
        files: {
          'public/css/style.min.css': 'less/style.less'
        }
      }
    },
    /* }}} less task */

    /* concat task {{{ */
    concat: {
      options: {
        separator: ';',
      },
      mqtt: {
        src: [
          'public/js/lib.js',
          'node_modules/mqtt'
        ]
      },
      ng: {
        src: [
          'src/js/lib/*.js',
          'src/js/*.js'
        ],
        dest: 'public/js/app.js'
      }
    },
    /* }}} concat task */

    /* uglify task {{{ */
    uglify: {
      app: {
        files: {
          'public/js/app.min.js': [
            'public/js/bower.js',
            'public/js/app.js'
          ]
        }
      }
    },
    /* }}} uglify task */

  });

  grunt.registerTask('default', ['bower_concat', 'less']);
  grunt.registerTask('dev', ['bower_concat', 'less', 'concat']);

};

