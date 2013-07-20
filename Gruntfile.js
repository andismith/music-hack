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
          src: ['public/css/**.css'],
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
        src: ['public/js/**/*.js', '!node_modules/*/**.js', '!js/libs/**/*.js']
      },
      gruntfile: {
        src: ['Gruntfile.js']
      }
    },

    jsonlint: {
      dev: {
        src: ['public/data/*.json']
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
          cwd: 'public/sass',
          dest: 'public/css',
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
          cwd: 'public/sass',
          dest: 'public/css',
          ext: '.css'
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
        files: ['public/data/*.json', '!data/*.assemble.json'],
        tasks: ['jsonlint']
      },
      sass: {
        files: ['public/sass/*.scss'],
        tasks: ['sass:dev', 'autoprefixer']
      },
      scripts: {
        files: ['public/js/**/*.js'],
        tasks: ['jshint:dev']
      }
    }
  });

  /* MODULES =-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  // load every plugin in package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /* TASKS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  grunt.registerTask('build', ['jshint:gruntfile', 'sass:dev', 'autoprefixer', 'jsonlint', 'jshint:dev']);
  grunt.registerTask('default', ['build', 'watch']);

};