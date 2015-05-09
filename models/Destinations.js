var mongoose = require('mongoose');

var DestinationSchema = new mongoose.Schema({
  body: {},
  created_at: { type: Date ,default: new Date()},
  travel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Travel'
  }
});

mongoose.model('Destination', DestinationSchema);