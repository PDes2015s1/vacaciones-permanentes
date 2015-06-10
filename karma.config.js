// Karma configuration
// Generated on Sat Apr 11 2015 19:38:38 GMT-0300 (ART)
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/bootstrap/dist/css/bootstrap.css',
      'bower_components/fullcalendar/dist/fullcalendar.css',
      'bower_components/angular-google-places-autocomplete/src/autocomplete.css',
      'public/stylesheets/style.css',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/lodash/dist/lodash.compat.js',
      'bower_components/angular-google-maps/dist/angular-google-maps.js',
      'bower_components/fullcalendar/dist/fullcalendar.js',
      'bower_components/angular-ui-calendar/src/calendar.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'https://maps.googleapis.com/maps/api/js?libraries=places',
      'bower_components/angular-google-places-autocomplete/src/autocomplete.js',
      'public/javascripts/angular/**/*.js',
      'tests/jasmine/**/*Spec.js'
    ],


    // list of files to exclude 
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};