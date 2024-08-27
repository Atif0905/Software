const mongoose = require('mongoose');

// Define the Expense Schema
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
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Create a Mongoose Model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
