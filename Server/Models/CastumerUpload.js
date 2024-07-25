const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true
  },
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
    type: String  
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
  name2: {
    type: String,
    required: true
  },
  fatherOrHusbandName2: {
    type: String,
    required: true
  },
  address2: {
    type: String,
    required: true
  },
  aadharNumber2: {
    type: String,
    required: true
  },
  panNumber2: {
    type: String,
    required: true
  },
  mobileNumber2: {
    type: String,
    required: true
  },
  email2: {
    type: String,
  },
  name3: {
    type: String,
    required: true
  },
  fatherOrHusbandName3: {
    type: String,
    required: true
  },
  address3: {
    type: String,
    required: true
  },
  aadharNumber3: {
    type: String,
    required: true
  },
  panNumber3: {
    type: String,
    required: true
  },
  mobileNumber3: {
    type: String,
    required: true
  },
  email3: {
    type: String,
  },
});
customerSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const scenarioNumber = await mongoose.models.Customer.countDocuments() + 1;
      this.customerId = `WI0${scenarioNumber}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});
const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;