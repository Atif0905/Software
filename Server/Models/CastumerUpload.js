const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerId: String,
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
    type: String  // Adjusted to store only the name of the payment plan
  },
  bookingDate: {
    type: Date
  },
  bookingType: {
    type: String
  },
  sendEmail: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  },
});

// Before saving, generate and set the customer ID
customerSchema.pre('save', async function(next) {
  try {
    // Generate a scenario number
    const scenarioNumber = await mongoose.models.Customer.countDocuments() + 1;
    // Construct the customer ID
    this.customerId = `WI0${scenarioNumber}`;
    next();
  } catch (error) {
    next(error);
  }
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
