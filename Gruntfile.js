module.exports = function(grunt) {

  grunt.initConfig({

    wiredep: {
      task: {
        src: ['views/**/*.ejs']
      },
      options: {
        devDependencies: true
      }
    },

    karma: {
      unit: {
        configFile: 'karma.config.js'
      }
    },

    jshint: {
      all: ['Gruntfile.js',
        'models/*.js',
        'routes/**/*.js',
        'public/javascripts/angular/**/*.js',
        '*.js'
      ]
    },

    nodeunit: {
      all: ['tests/nodeunit/**/*Test.js'],
      options: {
        reporter: 'junit',
        reporterOptions: {
          output: 'outputdir'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('jasmine', ['karma']);
  grunt.registerTask('default', 'jshint');
};