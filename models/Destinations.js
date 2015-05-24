var mongoose = require('mongoose');

var DestinationSchema = new mongoose.Schema({
  title: String,
  location: {},
  start: {
    type: Date
  },
  end: {
    type: Date
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  travel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Travel'
  },
  pointsOfInterest: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PointOfInterest'
  }]
});

mongoose.model('Destination', DestinationSchema);