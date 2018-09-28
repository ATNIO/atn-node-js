'use strict';
grunt.loadNpmTasks('grunt-jsdoc');

module.exports = require('./src/atn')

grunt.initConfig({
  jsdoc : {
    dist : {
      src: ['src/*.js', 'test/*.js'],
      options: {
        destination: 'doc'
      }
    }
  }
});
