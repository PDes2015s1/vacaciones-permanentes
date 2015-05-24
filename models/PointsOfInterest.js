var mongoose = require('mongoose');

var PointOfInterestSchema = new mongoose.Schema({
  title: String,
  formatted_address: String,
  formatted_phone_number: String,
  location: {},
  created_at: {
    type: Date,
    default: new Date()
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }
});

mongoose.model('PointOfInterest', PointOfInterestSchema);