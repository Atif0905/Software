const mongoose = require('mongoose');

  const ReturnPaymentSchema = new mongoose.Schema({
    customername: {
      type: String,
      required: true
    },
    customeremail:{
        type: String,
        required: true
    },
    projectname:{
        type:String,
        require: true,
    },
    blockname:{
        type:String,
        require: true,
    },
    unitname:{
        type:String,
        require: true,
    },
    paymentMode: {
      type: String,
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

  const ReturnPaymentModel = mongoose.model('ReturnPayment', ReturnPaymentSchema);

  module.exports = ReturnPaymentModel;