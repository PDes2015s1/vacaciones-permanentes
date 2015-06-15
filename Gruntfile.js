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
      all: ['Gruntfile.js']
    }

  });
  
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('default', 'jshint');
};