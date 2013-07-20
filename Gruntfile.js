/* jshint indent: 2 */
module.exports = function (grunt) {

  "use strict";

  /* CONFIGURATION =-=-=-=-=-=-=-=-=-=-=- */

  /* GRUNT INIT =-==-=-=-=-=-=-=-=-=-=-=- */
  grunt.initConfig({
    // package file
    pkg: grunt.file.readJSON('package.json'),

    // automatically add prefixes
    autoprefixer: {
      options: {
        browsers: ['last 2 version', '> 1%', 'ff 17', 'ie 8', 'ie 7']
      },
      all: {
        files: [{
          expand: true,
          src: ['*/**.css'],
          ext: '.css'
        }]
      }
    },

    jshint: {
      options: {
        browser: true,
        curly: true,
        devel: true,
        eqeqeq: true,
        evil: true,
        immed: true,
        indent: 2,
        regexdash: true,
        sub: true,
        trailing: true,
        unused: true,
        white: true,
        globals: {
          jQuery: true,
          modernizr: true
        },
        force: true // allow build to continue with errors
      },
      dev: {
        src: ['js/**/*.js', '!node_modules/*/**.js', '!js/libs/**/*.js']
      },
      gruntfile: {
        src: ['Gruntfile.js']
      }
    },

    jsonlint: {
      dev: {
        src: ['data/*.json']
      }
    },

    sass: {
      options: {
        sourcemap: true,
        trace: true
      },
      dev: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          src: ['**/*.scss', '!**/_*.scss'],
          cwd: '/sass',
          dest: '/css',
          ext: '.css'
        }]
      },
      prod: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          src: ['**/*.scss', '!**/_*.scss'],
          cwd: '/sass',
          dest: '/css',
          ext: '.min.css'
        }]
      }
    },

    // different watch options trigger different tasks
    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      json: {
        files: ['data/*.json', '!data/*.assemble.json'],
        tasks: ['jsonlint']
      },
      sass: {
        files: ['sass/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer']
      },
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['jshint:dev']
      }
    }
  });

  /* MODULES =-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  // load every plugin in package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /* TASKS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  grunt.registerTask('build', ['jshint:gruntfile','sass:dev', 'autoprefixer', 'jsonlint', 'jshint:dev']);
  grunt.registerTask('default', ['build', 'watch']);

};