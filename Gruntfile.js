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
    }

  });
  
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-wiredep');
  
  grunt.registerTask('test', ['karma']);
};