const mongoose = require('mongoose');

// Define the schema for Mailcontent
const MailcontentSchema = new mongoose.Schema({
  Subject: {
    type: String,
    required: true,
    trim: true,
  },
  Body: {
    type: String,
    required: true,
    trim: true,
  },
  Lastdata: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create the model
const Mailcontent = mongoose.model('Mailcontent', MailcontentSchema);

module.exports = Mailcontent;
