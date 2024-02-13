// Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      fatherOrHusbandName: {
        type: String
      },
      address: {
        type: String
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      phone: {
        type: String,
        required: true
      },
      aadharNumber: {
        type: String
      },
      panNumber: {
        type: String
      },
      income: {
        type: Number
      },
      photo: {
        type: String // Assuming storing photo URL
      }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
