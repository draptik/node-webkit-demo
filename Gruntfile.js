'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['app/js/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    copy: {
      main: {
        expand: true,
        dot: true,
        cwd: 'app/assets/',
        src: '**',
        dest: 'dist/'
      },
      packageinfo: {
        src: 'app/assets/package.json',
        dest: 'dist-pkg/package.json'
      }
    },

    cssmin: {
      combine: {
        files: {
          'dist/<%= pkg.name %>.min.css': ['app/css/**/*.css', 'dist/<%= pkg.name %>.css']
        }
      }
    },

    jade: {
      compile: {
        options: {
          data: {
            debug: false
          },
          pretty: true
        },
        files: {
          'dist/index.html': 'app/index.jade',
          'dist/node.html': 'app/node.jade',
          'dist/page1.html': 'app/page1.jade',
          'dist/page2.html': 'app/page2.jade',
          'dist/db.html': 'app/db.jade',
          'dist/file.html': 'app/file.jade'
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'app/js/*.js'],
      options: {
        jshintrc: true
      }
    },

    nodewebkit: {
      options: {
        version: '0.9.2',
        build_dir: './dist-pkg', // jshint ignore:line
        mac: false,
        win: false,
        linux32: false,
        linux64: true
      },
      src: ['dist/**/*']
    },

    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    watch: {
      compass: {
        files: ['sass/**/*.scss'],
        tasks: ['compass', 'cssmin']
      },
      jade: {
        files: ['app/**/*.jade'],
        tasks: 'jade'
      },
      js: {
        files: ['app/js/*.js'],
        tasks: ['jshint', 'concat', 'uglify']
      }
    }
  });

  grunt.registerTask('default', ['copy', 'compass', 'cssmin', 'jade', 'jshint', 'concat', 'uglify', 'nodewebkit']);
};
