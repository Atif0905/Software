const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true 
    }, 
  name: {
    type: String,
    required: true,
  },
  assign: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Channel', ChannelSchema);

