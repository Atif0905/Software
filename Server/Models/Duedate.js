const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
  dueDate: {
    type: Date,
    required: true,
  },
  installment: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,  // It's generally a good practice to make this required
  },
  amount: {
    type: String,
    default: null,
  }
});

module.exports = mongoose.model('Installment', InstallmentSchema);
