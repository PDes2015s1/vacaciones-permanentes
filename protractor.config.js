var mongoose = require('mongoose');

exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  onComplete: function() {
    mongoose.connect('mongodb://localhost/travelstest', function() {
      /* Drop the DB */
      mongoose.connection.db.dropDatabase();
    });

  },
  /*capabilities: {
    'browserName': 'firefox'
  },*/
  specs: ['tests/protractor/**/*Spec.js']
}