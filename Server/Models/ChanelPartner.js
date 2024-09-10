// /models/channelPartner.js
const mongoose = require('mongoose');
const { sendPartnerEmail } = require('../services/emailService'); // Import the email service

// ChannelPartner Schema
const ChannelPartnerSchema = new mongoose.Schema({
  customerFirstName: {
    type: String,
    required: true,
  },
  customerSecondName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  referredBy: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to generate uniqueId before saving a new document
ChannelPartnerSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const lastPartner = await mongoose.model('ChannelPartner').findOne().sort({ createdAt: -1 });

      let lastNumber = 0;
      if (lastPartner && lastPartner.uniqueId) {
        const match = lastPartner.uniqueId.match(/\d+$/);
        if (match) {
          lastNumber = parseInt(match[0], 10);
        }
      }

      const newNumber = lastNumber + 1;
      const newUniqueId = `WICChanel${newNumber.toString().padStart(2, '0')}`;

      this.uniqueId = newUniqueId;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Post-save middleware to send an email
ChannelPartnerSchema.post('save', async function (doc, next) {
  try {
    await sendPartnerEmail(doc); // Call the email sending function
    next();
  } catch (error) {
    console.error('Error sending email:', error);
    next(error);
  }
});

const ChannelPartner = mongoose.model('ChannelPartner', ChannelPartnerSchema);

module.exports = ChannelPartner;
