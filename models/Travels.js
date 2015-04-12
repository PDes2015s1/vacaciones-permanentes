var mongoose = require('mongoose');

var TravelSchema = new mongoose.Schema({
  title: String,
  link: String,
  author: String,
  created_at: { type: Date, default: new Date()},
  startDate: { type: Date},
  endDate: { type: Date},
  destinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }]
});

TravelSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Travel', TravelSchema);