const mongoose = require('mongoose');

  const PaymentSchema = new mongoose.Schema({
    customerId: {
      type: String,
      required: true
    },
    paymentType: {
      type: String,
      required: true
    },
    paymentMode: {
      type: String,
      enum: ['cheque', 'cash', 'Bank Deposit', 'Bank Transfer', 'Online', 'commision Adjustment'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    reference: {
      type: String,
      required: true
    },
    comment: {
      type: String
    },
    PaymentDate: {
      type: Date
    }
  });

  const PaymentModel = mongoose.model('Payment', PaymentSchema);

  module.exports = PaymentModel;