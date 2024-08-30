const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
  teamLeadName: {
    type: String,
    required: true,
  },
  expenseSummary: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    default: '', // Comment is optional, so we set a default value
  },
  Paydate: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Create a Mongoose Model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
