/* jshint indent: 2 */
module.exports = function (grunt) {

  "use strict";

  /* CONFIGURATION =-=-=-=-=-=-=-=-=-=-=- */
  var SERVER = './server/', // server folder
      SRC = './src/', // source folder
      DIST = './dist/', // output folder
      SERVER_PORT = 3000;

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
          cwd: SRC,
          dest: SRC, // output to src so we can continue to run tasks
          ext: '.css'
        }]
      }
    },

    // clear a directory before build
    clean: {
      all: [SRC + '/css', DIST]
    },

    // create a local server
    connect: {
      dev: {
        options: {
          port: SERVER_PORT,
          base: DIST
        }
      }
    },

    // copy files
    copy: {
      options: {
        processContentExclude: ['.DS_Store', '.gitignore', '.sass-cache', 'node_modules', 'src/tests/**']
      },
      markup: {
        files: [
          {
            cwd: SRC,
            dest: DIST,
            src: ['**/*.html'],
            expand: true,
            filter: 'isFile'
          }
        ]
      },
      images: {
        files: [
          {
            cwd: SRC,
            dest: DIST,
            src: ['img/**/*.gif'],
            expand: true,
            filter: 'isFile'
          }
        ]
      },
      json: {
        files: [
          {
            cwd: SRC,
            dest: DIST,
            src: ['**/*.json', '!**/assemble/*.json'],
            expand: true,
            filter: 'isFile'
          }
        ]
      },
      scripts: {
        files: [
          {
            cwd: SRC,
            dest: DIST,
            src: ['js/**/*.js'],
            expand: true,
            filter: 'isFile'
          }
        ]
      },
      styles: {
        files: [
          {
            cwd: SRC,
            dest: DIST,
            src: ['css/**', 'sass/**'],
            expand: true,
            filter: 'isFile'
          }
        ]
      }
    },

    // minify images
    imagemin: {
      build: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: SRC,
          src: ['img/**/*.{gif,jpg,png}'],
          dest: DIST
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
        src: [SRC + 'js/**/*.js', '!' + SRC + '/js/libs/**/*.js']
      },
      gruntfile: {
        src: ['Gruntfile.js']
      }
    },

    jsonlint: {
      dev: {
        src: [ SRC + '**/*.json' ]
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
          cwd: SRC + 'sass',
          dest: SRC + 'css',
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
          cwd: SRC + 'sass',
          dest: SRC + 'css',
          ext: '.min.css'
        }]
      }
    },

    // minify our javascript
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: DIST + '/js/script.min.js.map'
      },
      prod: {
        files: [{
          expand: true,
          src: ['js/**/*.js', '!js/libs/**/*.js'],
          cwd: SRC,
          dest: DIST,
          ext: '.min.js'
        }]
      }
    },

    // verify lowercase filenames
    verifylowercase: {
      all: {
        src: [SRC + '**/*']
      }
    },

    // update the version number of our package file
    version: {
      dev: {
        options: {
          release: 'patch'
        },
        src: [
          'package.json'
        ]
      },
      prod: {
        options: {
          release: 'minor'
        },
        src: [
          'package.json'
        ]
      }
    },

    // different watch options trigger different tasks
    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile', 'build:dev']
      },
      images: {
        files: ['src/img/**'],
        tasks: ['images']
      },
      json: {
        files: ['src/data/*.json', '!src/data/*.assemble.json'],
        tasks: ['json']
      },
      markup: {
        files: ['**/*.html'],
        tasks: ['copy:markup']
      },
      sass: {
        files: ['src/sass/**/*.scss'],
        tasks: ['styles:dev']
      },
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['scripts:dev']
      }
    }
  });

  /* MODULES =-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  // load every plugin in package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /* TASKS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  // tasks for images, scripts and styles
  grunt.registerTask('images', ['imagemin:build']);

  grunt.registerTask('scripts:dev', ['jshint:dev', 'copy:scripts', 'uglify:prod']);
  grunt.registerTask('scripts:prod', ['jshint:dev', 'copy:scripts']);
  
  grunt.registerTask('json', ['jsonlint', 'copy:json']);
  
  grunt.registerTask('styles:dev', ['sass:dev', 'autoprefixer', 'copy:styles']);
  grunt.registerTask('styles:prod', ['sass:prod', 'autoprefixer', 'copy:styles']);

  // tasks to run a complete build
  grunt.registerTask('build:dev', ['verifylowercase', 'clean', 'copy:markup', 'images', 'json', 'scripts:dev', 'styles:dev']);
  grunt.registerTask('build:prod', ['verifylowercase', 'clean', 'copy:markup', 'images', 'json', 'scripts:prod', 'styles:prod']);

  // main tasks
  grunt.registerTask('default', ['build:dev', 'connect:dev', 'watch']);
  grunt.registerTask('dev', ['build:dev']);
  grunt.registerTask('prod', ['build:prod']);

};