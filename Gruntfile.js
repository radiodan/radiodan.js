module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true,
          globals: ['assert', 'fs', 'sinon', 'utils', 'winston', 'EventEmitter'],
          require: 'test/helper'
        },
        src: [ 'test/**/test-*.js' ]
      }
    },
    watch: {
      js: {
        options: {
          spawn: false,
        },
        files: ['test/**/test-*.js', 'lib/**/*.js'],
        tasks: ['default']
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      src: {
        src: ['Gruntfile.js', 'lib/**/*.js', 'bin/*']
      },
      test: {
        src: ['test/**/*.js']
      }
    }
  });

  // On watch events, if the changed file is a test file then configure mochaTest to only
  // run the tests from that file. Otherwise run all the tests
  var defaultTestSrc = grunt.config('mochaTest.test.src');
  grunt.event.on('watch', function(action, filepath) {
    console.log(filepath);
    grunt.config('mochaTest.test.src', defaultTestSrc);
    if (filepath.match('test/')) {
      grunt.config('mochaTest.test.src', filepath);
    }
  });

  grunt.registerTask('default', ['jshint', 'mochaTest']);
};
