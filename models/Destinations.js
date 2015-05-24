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
  lodging: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PointOfInterest'
  },
  travel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Travel'
  },
  pointsOfInterest: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PointOfInterest'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Destination', DestinationSchema);