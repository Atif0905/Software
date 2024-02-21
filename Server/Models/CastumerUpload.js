const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fatherOrHusbandName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  aadharNumber: {
    type: String,
    required: true
  },
  panNumber: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  // income: {
  //   type: String,
  //   required: true
  // },
  email: {
    type: String,
    required: true,
    unique: true
  },
  propertyType: {
    type: String
  },
  project: {
    type: String
  },
  block: {
    type: String
  },
  plotOrUnit: {
    type: String
  },
  discount: {
    type: Number,
    default: 0
  },
  paymentPlan: {
    type: String
  },
  bookingDate: {
    type: Date
  },
  bookingType: {
    type: String
  },
  sendEmail: {
    type: Boolean, // Adjusted to Boolean type as per the given code
    default: false // Assuming default value is false
  },
  selected: {
    type: Boolean,
    default: false
  },
  paymentReceived: { // Add paymentReceived field
    type: String
}
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
